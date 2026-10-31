// Copies des photos sur le site.
// Les produits (surtout en édition limitée) disparaissent souvent des boutiques,
// et leur photo avec eux : le site garde donc sa propre copie de chaque image.
// Les copies sont redimensionnées (1200 px au plus) et converties en JPEG ; pour
// les photos produits sur fond uni, le fond est blanchi et l'image recadrée.

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PrismaClient } from "@prisma/client";
import sharp, { type Sharp } from "sharp";
import { mapLimit } from "./linkcheck";

/**
 * Dossier des copies : IMAGES_DIR si défini, sinon /data/images si le disque
 * permanent /data existe (Railway), sinon storage/images dans le projet (en local).
 */
export const IMAGES_DIR =
  process.env.IMAGES_DIR || (existsSync("/data") ? "/data/images" : join(process.cwd(), "storage", "images"));

const MAX_BYTES = 15 * 1024 * 1024; // 15 Mo
/** Nom d'une copie : empreinte du contenu + .jpg (une même image n'est stockée qu'une fois). */
export const IMAGE_FILE = /^[a-f0-9]{64}\.jpg$/;

/** Adresse publique d'une copie. */
export const imagePath = (file: string) => `/images/${file}`;

/** Lit une copie (ou null si elle n'existe pas). */
export async function readImage(file: string): Promise<Buffer | null> {
  if (!IMAGE_FILE.test(file)) return null;
  try {
    return await readFile(join(IMAGES_DIR, file));
  } catch {
    return null;
  }
}

/**
 * Photo produit sur fond uni et clair (gris pâle, beige…) : ramène ce fond au
 * blanc pur (pour qu'il se fonde dans les collages) et recadre au plus près du
 * produit. Les autres photos (décor, ambiance) sont laissées telles quelles.
 */
async function cleanPackshot(image: Sharp): Promise<Sharp> {
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const b = Math.max(4, Math.round(Math.min(w, h) * 0.03));
  const border: number[][] = [[], [], []];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (x >= b && x < w - b && y >= b && y < h - b) continue;
      const i = (y * w + x) * c;
      for (let k = 0; k < 3; k++) border[k].push(data[i + k]);
    }
  }
  const median = (v: number[]) => v.sort((p, q) => p - q)[Math.floor(v.length / 2)];
  const bg = border.map(median);
  const uniform =
    border[0].filter((_, i) => Math.abs(border[0][i] - bg[0]) + Math.abs(border[1][i] - bg[1]) + Math.abs(border[2][i] - bg[2]) < 30).length /
    border[0].length;
  const raw = sharp(data, { raw: info });
  if (uniform < 0.9 || Math.min(...bg) < 200) return raw; // pas un packshot : on ne touche à rien

  // Fond → blanc pur, puis recadrage serré avec une petite marge.
  // (Deux passes : sharp recadrerait sinon avant de blanchir le fond.)
  const whitened = await raw.linear(bg.map((v) => 255 / v), [0, 0, 0]).toBuffer({ resolveWithObject: true });
  const white = await sharp(whitened.data, { raw: whitened.info })
    .trim({ background: "#ffffff", threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  const margin = Math.round(Math.max(white.info.width, white.info.height) * 0.04);
  return sharp(white.data, { raw: { width: white.info.width, height: white.info.height, channels: white.info.channels } }).extend({
    top: margin, bottom: margin, left: margin, right: margin, background: "#ffffff",
  });
}

/** Traite et enregistre une image ; renvoie le nom du fichier créé. */
export async function storeImage(data: Buffer): Promise<string> {
  const base = sharp(data, { failOn: "none" })
    .rotate() // respecte l'orientation des photos de téléphone
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" }) // fond transparent → blanc
    .removeAlpha();
  const cleaned = await cleanPackshot(base).catch(() => base);
  const jpeg = await cleaned.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  const file = `${createHash("sha256").update(jpeg).digest("hex")}.jpg`;
  await mkdir(IMAGES_DIR, { recursive: true });
  const path = join(IMAGES_DIR, file);
  if (!existsSync(path)) await writeFile(path, jpeg);
  return file;
}

/** Télécharge une image depuis une boutique et en garde une copie. */
export async function saveImageFromUrl(url: string): Promise<{ file: string } | { error: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        // On se présente comme un navigateur : certaines boutiques bloquent les robots.
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { error: `La boutique a refusé le téléchargement (erreur ${res.status}).` };
    const type = res.headers.get("content-type") ?? "";
    if (type && !type.startsWith("image/")) {
      return { error: "Cette adresse mène à une page web, pas à une image : copiez l'adresse de la photo elle-même." };
    }
    const data = Buffer.from(await res.arrayBuffer());
    if (data.length > MAX_BYTES) return { error: "Image trop lourde (plus de 15 Mo)." };
    return { file: await storeImage(data) };
  } catch (e) {
    if (e instanceof Error && e.name === "TimeoutError") return { error: "La boutique n'a pas répondu à temps." };
    if (e instanceof Error && /unsupported image format|Input buffer/i.test(e.message)) {
      return { error: "Ce fichier n'est pas une image lisible." };
    }
    return { error: "Impossible de joindre la boutique pour copier l'image." };
  }
}

const isRemote = (url: string | null): url is string => Boolean(url && /^https?:\/\//.test(url));

/**
 * Copie les images qui n'ont pas encore de copie (articles et images principales).
 * `outfitIds` limite le travail à certaines tenues ; `retry` réessaie aussi les échecs.
 */
export async function archiveImages(
  db: PrismaClient,
  { outfitIds, retry = false }: { outfitIds?: number[]; retry?: boolean } = {},
): Promise<{ saved: number; failed: number }> {
  const scope = outfitIds ? { outfitId: { in: outfitIds } } : {};
  const errorFilter = retry ? {} : { imageError: null };
  const items = (await db.item.findMany({ where: { ...scope, imageFile: null, ...errorFilter } })).filter((i) => isRemote(i.imageUrl));
  const outfits = (
    await db.outfit.findMany({
      where: { ...(outfitIds ? { id: { in: outfitIds } } : {}), mainImageFile: null, ...(retry ? {} : { mainImageError: null }) },
    })
  ).filter((o) => isRemote(o.mainImage));

  // Une même adresse n'est téléchargée qu'une fois.
  const urls = [...new Set([...items.map((i) => i.imageUrl!), ...outfits.map((o) => o.mainImage!)])];
  const results = await mapLimit(urls, 4, saveImageFromUrl);
  const byUrl = new Map(urls.map((u, i) => [u, results[i]]));

  for (const i of items) {
    const r = byUrl.get(i.imageUrl!)!;
    await db.item.update({ where: { id: i.id }, data: "file" in r ? { imageFile: r.file, imageError: null } : { imageError: r.error } });
  }
  for (const o of outfits) {
    const r = byUrl.get(o.mainImage!)!;
    await db.outfit.update({ where: { id: o.id }, data: "file" in r ? { mainImageFile: r.file, mainImageError: null } : { mainImageError: r.error } });
  }
  const failed = [...items.map((i) => byUrl.get(i.imageUrl!)!), ...outfits.map((o) => byUrl.get(o.mainImage!)!)].filter((r) => "error" in r).length;
  return { saved: items.length + outfits.length - failed, failed };
}

/** Remplace les adresses d'images par les copies du site quand elles existent. */
export function withSavedImages<
  I extends { imageUrl: string | null; imageFile: string | null },
  O extends { mainImage: string | null; mainImageFile: string | null; items: I[] },
>(outfit: O): O {
  return {
    ...outfit,
    mainImage: outfit.mainImageFile ? imagePath(outfit.mainImageFile) : outfit.mainImage,
    items: outfit.items.map((i) => (i.imageFile ? { ...i, imageUrl: imagePath(i.imageFile) } : i)),
  };
}
