"use server";
// Actions liées aux liens d'achat : vérification et mise à jour en masse.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkUrl, mapLimit } from "@/lib/linkcheck";

/** Vérifie tous les liens d'articles et enregistre le résultat. */
export async function checkAllLinks(): Promise<{ checked: number; problems: number }> {
  await requireAdmin();
  const items = await db.item.findMany({ select: { id: true, url: true } });

  // Un même lien utilisé par plusieurs articles n'est testé qu'une fois.
  const urls = [...new Set(items.map((i) => i.url))];
  const results = await mapLimit(urls, 5, checkUrl);
  const byUrl = new Map(urls.map((u, i) => [u, results[i]]));

  const now = new Date();
  for (const url of urls) {
    const r = byUrl.get(url)!;
    await db.item.updateMany({ where: { url }, data: { linkStatus: r.status, linkError: r.error, linkCheckedAt: now } });
  }
  revalidatePath("/admin", "layout");
  return { checked: urls.length, problems: results.filter((r) => r.status !== "ok").length };
}

export type LinkUpdate = { id: number; url: string; isAffiliate: boolean };

/** Enregistre d'un coup les liens (affiliés ou non) modifiés dans le tableau. */
export async function updateLinks(updates: LinkUpdate[]): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const invalid = updates.filter((u) => !/^https?:\/\/\S+$/.test(u.url.trim()));
  if (invalid.length) {
    return { ok: false, message: `${invalid.length} lien(s) ne sont pas des adresses valides (elles doivent commencer par https://). Rien n'a été enregistré.` };
  }
  for (const u of updates) {
    const before = await db.item.findUnique({ where: { id: u.id } });
    if (!before) continue;
    const url = u.url.trim();
    await db.item.update({
      where: { id: u.id },
      data: {
        url,
        isAffiliate: u.isAffiliate,
        ...(url !== before.url ? { linkStatus: "inconnu", linkError: null, linkCheckedAt: null } : {}),
      },
    });
  }
  revalidatePath("/", "layout");
  return { ok: true, message: `${updates.length} article(s) mis à jour.` };
}
