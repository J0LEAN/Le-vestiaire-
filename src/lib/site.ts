// Informations générales sur le site, utilisées partout (titre, SEO…).
export const SITE = {
  name: "Le Vestiaire",
  tagline: "Des tenues complètes, prêtes à copier.",
  description:
    "Le Vestiaire propose des tenues complètes pour toutes les occasions : chaque pièce est trouvée pour vous, il ne reste qu'à copier le look en quelques clics.",
  // Adresse publique du site, définie dans la variable d'environnement.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

/** Transforme un chemin ("/tenues/x") ou une image relative en adresse complète. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Infos Open Graph communes (à répéter : Next.js ne fusionne pas les objets openGraph). */
export const OG_DEFAULTS = { siteName: SITE.name, locale: "fr_FR" };
