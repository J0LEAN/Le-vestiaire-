"use server";
// Copies des images : relance des copies et envoi manuel d'une photo.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { archiveImages, storeImage } from "@/lib/images";

/** Copie toutes les images qui n'en ont pas encore (en réessayant les échecs). */
export async function archiveAllImages(): Promise<{ saved: number; failed: number }> {
  await requireAdmin();
  const result = await archiveImages(db, { retry: true });
  revalidatePath("/", "layout");
  return result;
}

/** Enregistre une photo envoyée depuis l'ordinateur pour un article ou une tenue. */
export async function uploadImage(_prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin();
  const file = formData.get("image");
  const id = Number(formData.get("id"));
  const kind = formData.get("kind");
  if (!(file instanceof File) || file.size === 0) return "Choisissez d'abord une image.";
  if (!file.type.startsWith("image/")) return "Ce fichier n'est pas une image.";
  if (file.size > 15 * 1024 * 1024) return "Image trop lourde (plus de 15 Mo).";

  let saved: string;
  try {
    saved = await storeImage(Buffer.from(await file.arrayBuffer()));
  } catch {
    return "Cette image n'a pas pu être lue. Essayez un fichier JPEG ou PNG.";
  }
  if (kind === "outfit") {
    await db.outfit.update({ where: { id }, data: { mainImageFile: saved, mainImageError: null } });
  } else {
    await db.item.update({ where: { id }, data: { imageFile: saved, imageError: null } });
  }
  revalidatePath("/", "layout");
  return null;
}
