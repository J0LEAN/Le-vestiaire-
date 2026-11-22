// Informations générales sur le site, utilisées partout (titre, SEO…).
export const SITE = {
  name: "Le Vestiaire",
  tagline: "Des tenues complètes, prêtes à copier.",
  description:
    "Le Vestiaire propose des tenues complètes pour toutes les occasions : chaque pièce est trouvée pour vous, il ne reste qu'à copier le look en quelques clics.",
  // Adresse publique du site (avec son sous-dossier éventuel, ex. https://nom.github.io/Buy-my-dress),
  // définie dans la variable d'environnement SITE_URL.
  url: (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

/** Transforme un chemin ("/tenues/x") ou une image relative en adresse complète. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Infos Open Graph communes (à répéter : Next.js ne fusionne pas les objets openGraph). */
export const OG_DEFAULTS = { siteName: SITE.name, locale: "fr_FR" };

/**
 * Sous-dossier du site quand il n'est pas à la racine de son adresse
 * (GitHub Pages : "/Buy-my-dress"). Vide sur Railway ou avec un nom de domaine à soi.
 */
export const BASE_PATH = (process.env.BASE_PATH || "").replace(/\/$/, "");

/** Ajoute le sous-dossier du site à une adresse d'image locale ("/produits/x.webp"). */
export function assetPath(src: string | null): string | null {
  if (!src || !BASE_PATH || !src.startsWith("/") || src.startsWith("//")) return src;
  return `${BASE_PATH}${src}`;
}

/** Applique `assetPath` aux images d'une tenue (image principale et articles). */
export function withBasePath<O extends { mainImage: string | null; items: { imageUrl: string | null }[] }>(outfit: O): O {
  if (!BASE_PATH) return outfit;
  return {
    ...outfit,
    mainImage: assetPath(outfit.mainImage),
    items: outfit.items.map((i) => ({ ...i, imageUrl: assetPath(i.imageUrl) })),
  };
}
