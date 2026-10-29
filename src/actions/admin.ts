"use server";
// Actions de l'espace admin. Chacune vérifie d'abord que l'on est connecté.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateOutfits } from "@/lib/import";
import { uniqueSlug } from "@/lib/outfits";

// ------------------------------------------------------------ Connexion

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 1000)); // ralentit les essais au hasard
    return "Mot de passe incorrect.";
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/connexion");
}

// ------------------------------------------------------------ Tenues

export type SaveState = { errors: string[] } | null;

/**
 * Crée ou modifie une tenue. Le formulaire envoie les données en JSON
 * (même format que l'import), ce qui permet de réutiliser les mêmes vérifications.
 */
export async function saveOutfit(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const status = formData.get("status") === "publiee" ? "publiee" : "brouillon";
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(String(formData.get("data")));
  } catch {
    return { errors: ["Données du formulaire illisibles."] };
  }

  const result = validateOutfits([raw]);
  if (!result.ok) return { errors: result.errors.map((e) => e.replace(/^Tenue n°1( « [^»]*»)? : /, "")) };
  const o = result.outfits[0];
  const itemIds = (raw.articles as { id?: number }[]).map((a) => a.id ?? null);

  const fields = {
    title: o.title,
    description: o.description,
    whyItWorks: o.whyItWorks,
    style: o.style,
    occasion: o.occasion,
    season: o.season,
    budget: o.budget,
    mainImage: o.mainImage,
    featured: o.featured,
    status,
  };

  let outfitId = id;
  if (id) {
    const existing = await db.outfit.findUnique({ where: { id }, include: { items: true } });
    if (!existing) return { errors: ["Cette tenue n'existe plus."] };
    await db.outfit.update({
      where: { id },
      data: {
        ...fields,
        // L'adresse est figée dès la première publication (pour ne pas casser les liens partagés).
        slug: existing.publishedAt || existing.title === o.title ? existing.slug : await uniqueSlug(db, o.title, id),
        publishedAt: status === "publiee" ? existing.publishedAt ?? new Date() : existing.publishedAt,
      },
    });
    // Articles : on supprime ceux retirés, on met à jour les autres, on crée les nouveaux.
    const keep = itemIds.filter((x): x is number => x != null);
    await db.item.deleteMany({ where: { outfitId: id, id: { notIn: keep } } });
    for (const [position, item] of o.items.entries()) {
      const itemId = itemIds[position];
      const before = existing.items.find((i) => i.id === itemId);
      if (before) {
        const urlChanged = before.url !== item.url;
        await db.item.update({
          where: { id: before.id },
          data: {
            ...item,
            position,
            // un nouveau lien n'a pas encore été vérifié
            ...(urlChanged ? { linkStatus: "inconnu", linkError: null, linkCheckedAt: null } : {}),
          },
        });
      } else {
        await db.item.create({ data: { ...item, position, outfitId: id } });
      }
    }
  } else {
    const created = await db.outfit.create({
      data: {
        ...fields,
        slug: await uniqueSlug(db, o.title),
        publishedAt: status === "publiee" ? new Date() : null,
        items: { create: o.items.map((item, position) => ({ ...item, position })) },
      },
    });
    outfitId = created.id;
  }

  revalidatePath("/", "layout");
  redirect(`/admin?ok=${encodeURIComponent(`Tenue « ${o.title} » enregistrée.`)}#tenue-${outfitId}`);
}

export async function setOutfitStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const publish = formData.get("status") === "publiee";
  const outfit = await db.outfit.findUnique({ where: { id } });
  if (!outfit) return;
  await db.outfit.update({
    where: { id },
    data: { status: publish ? "publiee" : "brouillon", publishedAt: publish ? outfit.publishedAt ?? new Date() : outfit.publishedAt },
  });
  revalidatePath("/", "layout");
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const outfit = await db.outfit.findUnique({ where: { id } });
  if (!outfit) return;
  await db.outfit.update({ where: { id }, data: { featured: !outfit.featured } });
  revalidatePath("/", "layout");
}

export async function deleteOutfit(formData: FormData) {
  await requireAdmin();
  await db.outfit.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidatePath("/", "layout");
}
