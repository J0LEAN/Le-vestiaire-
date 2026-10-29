// Enregistrement des tenues en base (utilisé par l'import, l'admin et les données d'exemple).
import type { PrismaClient } from "@prisma/client";
import type { ParsedOutfit } from "./import";
import { slugify } from "./format";

/** Trouve une URL libre : "robe-noire", sinon "robe-noire-2", "robe-noire-3"… */
export async function uniqueSlug(db: PrismaClient, title: string, ignoreId?: number): Promise<string> {
  const base = slugify(title) || "tenue";
  const taken = new Set(
    (
      await db.outfit.findMany({
        where: { slug: { startsWith: base }, NOT: ignoreId ? { id: ignoreId } : undefined },
        select: { slug: true },
      })
    ).map((o) => o.slug),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Crée des tenues (et leurs articles) à partir de données vérifiées. */
export async function createOutfits(
  db: PrismaClient,
  outfits: ParsedOutfit[],
  status: "brouillon" | "publiee",
): Promise<number> {
  for (const o of outfits) {
    await db.outfit.create({
      data: {
        slug: await uniqueSlug(db, o.title),
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
        publishedAt: status === "publiee" ? new Date() : null,
        items: { create: o.items.map((item, position) => ({ ...item, position })) },
      },
    });
  }
  return outfits.length;
}
