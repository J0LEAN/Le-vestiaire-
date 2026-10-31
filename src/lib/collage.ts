// Disposition du collage automatique (utilisée à la fois pour l'affichage
// sur le site et pour l'image PNG générée pour Pinterest / réseaux sociaux).

// Ordre d'importance des catégories : la pièce principale est mise en grand.
const PRIORITY = ["robe", "manteau", "haut", "bas", "chaussures", "sac", "accessoire", "bijou"];

/** Garde les articles avec image, triés de la pièce principale aux accessoires. */
export function collageItems<T extends { category: string; imageUrl: string | null; position: number }>(items: T[]): T[] {
  const rank = (c: string) => (PRIORITY.indexOf(c) === -1 ? 99 : PRIORITY.indexOf(c));
  return items
    .filter((i) => i.imageUrl)
    .sort((a, b) => rank(a.category) - rank(b.category) || a.position - b.position)
    .slice(0, 6);
}

/** Une case du collage, en fraction de la zone intérieure (0 à 1). */
export type Tile = { x: number; y: number; w: number; h: number };

/** Marge intérieure du cadre et espace entre les images (en fraction du cadre). */
export const COLLAGE_PADDING = 0.11;
const GAP = 0.08;

/**
 * Cases du collage selon le nombre d'images, sur 2 colonnes (cadre vertical 4:5).
 * Au-delà de 2 images, la pièce principale (la première) peut occuper 2 rangées.
 */
export function collageLayout(count: number): Tile[] {
  const w = (1 - GAP) / 2;
  const col = (c: number) => c * (w + GAP);
  // hauteur et position d'une rangée quand il y en a `rows`
  const cell = (rows: number, r: number, span = 1) => {
    const h = (1 - (rows - 1) * GAP) / rows;
    return { y: r * (h + GAP), h: h * span + GAP * (span - 1) };
  };
  switch (count) {
    case 0:
      return [];
    case 1:
      return [{ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }];
    case 2:
      return [0, 1].map((c) => ({ x: col(c), w, ...cell(1, 0) }));
    case 3:
      return [
        { x: col(0), w, ...cell(2, 0, 2) },
        { x: col(1), w, ...cell(2, 0) },
        { x: col(1), w, ...cell(2, 1) },
      ];
    case 4:
      return [0, 1, 2, 3].map((i) => ({ x: col(i % 2), w, ...cell(2, Math.floor(i / 2)) }));
    case 5:
      return [
        { x: col(0), w, ...cell(3, 0, 2) },
        { x: col(1), w, ...cell(3, 0) },
        { x: col(1), w, ...cell(3, 1) },
        { x: col(0), w, ...cell(3, 2) },
        { x: col(1), w, ...cell(3, 2) },
      ];
    default:
      // 6 images : 2 colonnes x 3 rangées
      return Array.from({ length: 6 }, (_, i) => ({ x: col(i % 2), w, ...cell(3, Math.floor(i / 2)) }));
  }
}

/** Couleur de fond des collages. */
export const COLLAGE_BG = "#FBF4F7";

/**
 * Photo « détourée » (produit seul sur fond transparent), comme celles de
 * public/produits/. On ne la fond pas dans le décor : on lui ajoute une ombre
 * douce, pour qu'un vêtement blanc reste visible sur le fond clair.
 */
export function isCutout(src: string | null): boolean {
  return !!src && src.startsWith("/produits/") && /\.(webp|png)$/i.test(src);
}

/**
 * Classes CSS d'une photo produit dans le collage et les vignettes :
 * - détourée : ombre douce autour de la pièce ;
 * - sur fond blanc : « multiply » fond le blanc dans le rose pâle.
 */
export function productImageClass(src: string | null): string {
  return isCutout(src) ? "drop-shadow-[0_3px_6px_rgba(110,30,80,0.22)]" : "mix-blend-multiply";
}
