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

/** Une case du collage, en fraction de la largeur/hauteur totale (0 à 1). */
export type Tile = { x: number; y: number; w: number; h: number };

/** Cases du collage selon le nombre d'images (pensé pour un cadre vertical 4:5). */
export function collageLayout(count: number): Tile[] {
  switch (count) {
    case 0:
      return [];
    case 1:
      return [{ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }];
    case 2:
      return [
        { x: 0, y: 0.08, w: 0.5, h: 0.84 },
        { x: 0.5, y: 0.08, w: 0.5, h: 0.84 },
      ];
    case 3:
      return [
        { x: 0, y: 0, w: 0.56, h: 1 },
        { x: 0.56, y: 0, w: 0.44, h: 0.5 },
        { x: 0.56, y: 0.5, w: 0.44, h: 0.5 },
      ];
    case 4:
      return [
        { x: 0, y: 0, w: 0.5, h: 0.5 },
        { x: 0.5, y: 0, w: 0.5, h: 0.5 },
        { x: 0, y: 0.5, w: 0.5, h: 0.5 },
        { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
      ];
    case 5:
      return [
        { x: 0, y: 0, w: 0.56, h: 0.62 },
        { x: 0.56, y: 0, w: 0.44, h: 0.31 },
        { x: 0.56, y: 0.31, w: 0.44, h: 0.31 },
        { x: 0, y: 0.62, w: 0.5, h: 0.38 },
        { x: 0.5, y: 0.62, w: 0.5, h: 0.38 },
      ];
    default:
      // 6 images : 2 colonnes x 3 lignes
      return Array.from({ length: 6 }, (_, i) => ({
        x: (i % 2) * 0.5,
        y: Math.floor(i / 2) / 3,
        w: 0.5,
        h: 1 / 3,
      }));
  }
}

/** Couleur de fond des collages. */
export const COLLAGE_BG = "#F4F4F4";
