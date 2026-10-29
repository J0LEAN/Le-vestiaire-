// Lecture des tenues publiées (pages publiques).
import { BUDGETS } from "./constants";
import { db } from "./db";
import { outfitBudget } from "./format";

export type Filters = { style?: string; occasion?: string; season?: string; budget?: string };

/** Lit les filtres depuis l'URL (?style=chic&occasion=soiree…). */
export function readFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const get = (k: string) => (typeof sp[k] === "string" && sp[k] ? (sp[k] as string) : undefined);
  return { style: get("style"), occasion: get("occasion"), season: get("saison"), budget: get("budget") };
}

/** Tenues publiées, des plus récentes aux plus anciennes, avec filtres. */
export async function getPublishedOutfits(filters: Filters = {}) {
  const outfits = await db.outfit.findMany({
    where: {
      status: "publiee",
      style: filters.style,
      occasion: filters.occasion,
      // "Toutes saisons" convient aussi quand on filtre sur une saison précise
      season: filters.season ? { in: [filters.season, "toutes"] } : undefined,
    },
    include: { items: { orderBy: { position: "asc" } } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  // Le budget peut être calculé (somme des prix) : on filtre donc ici.
  const range = BUDGETS.find((b) => b.value === filters.budget);
  if (!range) return outfits;
  return outfits.filter((o) => {
    const total = outfitBudget(o);
    return total >= range.min && (range.max == null || total < range.max);
  });
}

export type OutfitWithItems = Awaited<ReturnType<typeof getPublishedOutfits>>[number];

/** Tenues mises "à la une" (au plus 3). */
export async function getFeaturedOutfits() {
  return db.outfit.findMany({
    where: { status: "publiee", featured: true },
    include: { items: { orderBy: { position: "asc" } } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: 3,
  });
}

/** Une tenue publiée par son URL. */
export async function getOutfitBySlug(slug: string) {
  return db.outfit.findFirst({
    where: { slug, status: "publiee" },
    include: { items: { orderBy: { position: "asc" } } },
  });
}
