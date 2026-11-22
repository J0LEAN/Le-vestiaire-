// Filtres des tenues (style, occasion, saison, budget).
// Ce fichier ne touche pas à la base de données : il sert aussi dans le navigateur.
import { BUDGETS } from "./constants";
import { outfitBudget } from "./format";

export type Filters = { style?: string; occasion?: string; season?: string; budget?: string };

/** Lit les filtres depuis l'adresse (?style=chic&occasion=soiree…). */
export function readFilters(sp: { get(key: string): string | null }): Filters {
  const get = (k: string) => sp.get(k) || undefined;
  return { style: get("style"), occasion: get("occasion"), season: get("saison"), budget: get("budget") };
}

/** Ne garde que les tenues qui correspondent aux filtres. */
export function filterOutfits<
  T extends { style: string; occasion: string; season: string; budget: number | null; items: { price: number | null }[] },
>(outfits: T[], filters: Filters): T[] {
  const range = BUDGETS.find((b) => b.value === filters.budget);
  return outfits.filter((o) => {
    if (filters.style && o.style !== filters.style) return false;
    if (filters.occasion && o.occasion !== filters.occasion) return false;
    // "Toutes saisons" convient aussi quand on filtre sur une saison précise
    if (filters.season && o.season !== filters.season && o.season !== "toutes") return false;
    if (range) {
      const total = outfitBudget(o);
      if (total < range.min || (range.max != null && total >= range.max)) return false;
    }
    return true;
  });
}
