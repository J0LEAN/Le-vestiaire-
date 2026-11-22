/* eslint-disable @next/next/no-img-element -- ImageResponse n'accepte que <img> */
// Génère l'image PNG d'une tenue (collage ou image principale).
//   /visuels/<slug>/pin.png   → format vertical 1000x1500 (Pinterest)
//   /visuels/<slug>/og.png    → format paysage 1200x630 (Facebook, WhatsApp, X…)
// Les deux adresses sont des fichiers fabriqués à l'avance (voir app/visuels/).

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { db } from "@/lib/db";
import { COLLAGE_BG, COLLAGE_PADDING, collageItems, collageLayout } from "@/lib/collage";
import { readImage, withSavedImages } from "@/lib/images";
import { SITE } from "@/lib/site";

export async function renderVisuel(slug: string, isOg: boolean): Promise<Response> {
  const row = await db.outfit.findFirst({
    where: { slug, status: "publiee" },
    include: { items: true },
  });
  if (!row) return new Response("Tenue introuvable", { status: 404 });

  const outfit = withSavedImages(row);

  // Dimensions : le collage est un cadre 4:5.
  const W = isOg ? 1200 : 1000;
  const H = isOg ? 630 : 1500;
  const boxW = isOg ? 504 : 1000;
  const boxH = isOg ? 630 : 1250;

  // Charge les images (celles qui échouent sont simplement ignorées).
  const main = outfit.mainImage ? await toDataUri(outfit.mainImage, false) : null;
  const pieces: string[] = [];
  if (!main) {
    for (const item of collageItems(outfit.items)) {
      const uri = await toDataUri(item.imageUrl!, true);
      if (uri) pieces.push(uri);
    }
  }
  const tiles = collageLayout(pieces.length);
  const pad = COLLAGE_PADDING;

  const visual = (
    <div style={{ display: "flex", position: "relative", width: boxW, height: boxH, background: COLLAGE_BG }}>
      {main ? (
        <img src={main} width={boxW} height={boxH} style={{ objectFit: "cover" }} alt="" />
      ) : (
        pieces.map((src, i) => {
          const t = tiles[i];
          const innerW = boxW * (1 - 2 * pad);
          const innerH = boxH * (1 - 2 * pad);
          const w = t.w * innerW;
          const h = t.h * innerH;
          return (
            <img
              key={i}
              src={src}
              width={w}
              height={h}
              alt=""
              style={{
                position: "absolute",
                left: boxW * pad + t.x * innerW,
                top: boxH * pad + t.y * innerH,
                objectFit: "contain",
              }}
            />
          );
        })
      )}
    </div>
  );

  const caption = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        padding: isOg ? "48px 56px" : "36px 56px",
        background: "#F6EEF3",
        color: "#26121F",
      }}
    >
      <div style={{ fontSize: isOg ? 26 : 28, letterSpacing: 6, textTransform: "uppercase" }}>{SITE.name}</div>
      <div style={{ fontSize: isOg ? 56 : 52, fontWeight: 400, lineHeight: 1.1, marginTop: 16 }}>{outfit.title}</div>
      {isOg && <div style={{ fontSize: 26, marginTop: 24, color: "#5F4558" }}>{SITE.tagline}</div>}
    </div>
  );

  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: isOg ? "row" : "column", width: W, height: H, background: "#F6EEF3" }}>
      {visual}
      {caption}
    </div>,
    {
      width: W,
      height: H,
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}

/**
 * Lit une image (copie du site, fichier du dossier public/ ou adresse distante)
 * et la renvoie en PNG sous forme "data:…", ou null en cas d'échec.
 * Avec `blend`, l'image est posée sur le fond rose pâle comme sur le site
 * (le générateur d'images ne sait pas le faire lui-même) : ombre douce pour une
 * photo détourée, effet « multiply » pour une photo sur fond blanc.
 */
async function toDataUri(src: string, blend: boolean): Promise<string | null> {
  try {
    let buffer: Buffer;
    if (src.startsWith("/images/")) {
      // Copie enregistrée par le site
      const copy = await readImage(src.slice("/images/".length));
      if (!copy) return null;
      buffer = copy;
    } else if (src.startsWith("/")) {
      // Image du dossier public/ du site (on refuse de sortir de ce dossier)
      const publicDir = join(process.cwd(), "public");
      const file = join(publicDir, src);
      if (!file.startsWith(publicDir + "/")) return null;
      buffer = await readFile(file);
    } else {
      const res = await fetch(src, { signal: AbortSignal.timeout(5000), headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return null;
      buffer = Buffer.from(await res.arrayBuffer());
    }
    // Conversion en PNG (le générateur ne lit ni le WebP ni l'AVIF), taille raisonnable
    const resized = sharp(buffer, { failOn: "none" }).resize(1000, 1000, { fit: "inside", withoutEnlargement: true });
    const { hasAlpha } = await resized.clone().metadata();
    let png: Buffer;
    if (blend && hasAlpha) {
      // Photo détourée (fond transparent) : posée sur le fond rose avec une ombre douce,
      // pour qu'un vêtement blanc reste visible
      const { data, info } = await resized.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width, height } = info;
      // Ombre : la silhouette du produit (sa transparence), floutée et très légère
      const alpha = Buffer.alloc(width * height);
      for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
      const blurred = await sharp(alpha, { raw: { width, height, channels: 1 } }).blur(14).extractChannel(0).raw().toBuffer();
      const shadow = Buffer.alloc(width * height * 4);
      for (let i = 0; i < blurred.length; i++) {
        shadow.set([0x6e, 0x1e, 0x50, Math.round(blurred[i] * 0.22)], i * 4);
      }
      const raw = { width, height, channels: 4 as const };
      png = await sharp({ create: { width, height, channels: 3, background: COLLAGE_BG } })
        .composite([{ input: shadow, raw }, { input: data, raw }])
        .png()
        .toBuffer();
    } else {
      const { data, info } = await resized.flatten({ background: "#ffffff" }).png().toBuffer({ resolveWithObject: true });
      png = blend
        ? await sharp({ create: { width: info.width, height: info.height, channels: 3, background: COLLAGE_BG } })
            .composite([{ input: data, blend: "multiply" }])
            .png()
            .toBuffer()
        : data;
    }
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}
