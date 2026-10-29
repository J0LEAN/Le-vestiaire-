"use server";
// Import en lot : aperçu puis validation.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseImportFile, type ParsedOutfit } from "@/lib/import";
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
  const count = await createOutfits(db, result.outfits, "brouillon");
  revalidatePath("/admin");
  return { ok: true, message: `${count} tenue${count > 1 ? "s" : ""} importée${count > 1 ? "s" : ""} en brouillon.` };
}
