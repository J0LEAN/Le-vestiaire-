// Petites fonctions de mise en forme.

/** "Robe noire d'été !" → "robe-noire-d-ete" (pour les URLs). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // enlève les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const eurosRond = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** 49.9 → "49,90 €" */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  return Number.isInteger(price) ? eurosRond.format(price) : euros.format(price);
}

/** Date en français : "29 octobre 2026". */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Budget à afficher : celui saisi, sinon la somme des prix des articles. */
export function outfitBudget(outfit: { budget: number | null; items: { price: number | null }[] }): number {
  if (outfit.budget != null) return outfit.budget;
  return Math.round(outfit.items.reduce((sum, i) => sum + (i.price ?? 0), 0));
}
