// Lecture des tenues publiées (pages publiques).
import { db } from "./db";
import { filterOutfits, type Filters } from "./filters";
import { withSavedImages } from "./images";
import { withBasePath } from "./site";

export type { Filters } from "./filters";

/** Tenues publiées, des plus récentes aux plus anciennes, avec filtres. */
export async function getPublishedOutfits(filters: Filters = {}) {
  const rows = await db.outfit.findMany({
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
  return filterOutfits(rows.map(withSavedImages).map(withBasePath), { budget: filters.budget });
}

export type OutfitWithItems = Awaited<ReturnType<typeof getPublishedOutfits>>[number];

/** Tenues mises "à la une" (au plus 3). */
export async function getFeaturedOutfits() {
  const rows = await db.outfit.findMany({
    where: { status: "publiee", featured: true },
    include: { items: { orderBy: { position: "asc" } } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: 3,
  });
  return rows.map(withSavedImages).map(withBasePath);
}

/** Une tenue publiée par son URL. */
export async function getOutfitBySlug(slug: string) {
  const outfit = await db.outfit.findFirst({
    where: { slug, status: "publiee" },
    include: { items: { orderBy: { position: "asc" } } },
  });
  return outfit && withBasePath(withSavedImages(outfit));
}
