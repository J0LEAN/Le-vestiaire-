"use server";
// Import en lot : aperçu puis validation.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseImportFile, type ParsedOutfit } from "@/lib/import";
import { archiveImages } from "@/lib/images";
import { createOutfits } from "@/lib/outfits";

export type PreviewResult =
  | { ok: true; outfits: ParsedOutfit[]; duplicates: string[] }
  | { ok: false; errors: string[] };

/** Analyse le fichier sans rien enregistrer. */
export async function previewImport(text: string, fileName: string): Promise<PreviewResult> {
  await requireAdmin();
  const result = parseImportFile(text, fileName);
  if (!result.ok) return result;
  // Repère les tenues dont le titre existe déjà (probable doublon).
  const titles = result.outfits.map((o) => o.title);
  const existing = await db.outfit.findMany({ where: { title: { in: titles } }, select: { title: true } });
  return { ok: true, outfits: result.outfits, duplicates: existing.map((e) => e.title) };
}

/** Enregistre les tenues du fichier, en brouillon. */
export async function confirmImport(text: string, fileName: string): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const result = parseImportFile(text, fileName); // on revérifie côté serveur
  if (!result.ok) return { ok: false, message: "Le fichier contient des erreurs : relancez l'aperçu." };
  const ids = await createOutfits(db, result.outfits, "brouillon");
  const count = ids.length;
  // Copie des photos sur le site (au cas où les produits disparaîtraient des boutiques)
  const images = await archiveImages(db, { outfitIds: ids });
  revalidatePath("/admin");
  let message = `${count} tenue${count > 1 ? "s" : ""} importée${count > 1 ? "s" : ""} en brouillon.`;
  if (images.saved) message += ` ${images.saved} image${images.saved > 1 ? "s" : ""} copiée${images.saved > 1 ? "s" : ""} sur le site.`;
  if (images.failed) message += ` ${images.failed} image${images.failed > 1 ? "s n'ont" : " n'a"} pas pu être copiée${images.failed > 1 ? "s" : ""} : voir Admin › Images.`;
  return { ok: true, message };
}
