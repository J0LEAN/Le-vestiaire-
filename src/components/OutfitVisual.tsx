/* eslint-disable @next/next/no-img-element -- les images viennent de sites marchands variés */
import { COLLAGE_BG, COLLAGE_PADDING, collageItems, collageLayout } from "@/lib/collage";

type Props = {
  outfit: {
    title: string;
    mainImage: string | null;
    items: { name: string; category: string; imageUrl: string | null; position: number }[];
  };
  /** true pour la première image visible de la page (chargement prioritaire). */
  priority?: boolean;
  className?: string;
};

/**
 * Visuel d'une tenue : l'image principale si elle existe,
 * sinon un collage automatique des images de ses articles.
 * Le cadre est toujours vertical (4:5) et arrondi.
 */
export function OutfitVisual({ outfit, priority, className = "rounded-[24px]" }: Props) {
  const loading = priority ? "eager" : "lazy";

  if (outfit.mainImage) {
    return (
      <div className={`relative aspect-[4/5] overflow-hidden ${className}`} style={{ background: COLLAGE_BG }}>
        <img src={outfit.mainImage} alt={outfit.title} loading={loading} className="h-full w-full object-cover" />
      </div>
    );
  }

  const items = collageItems(outfit.items);
  const tiles = collageLayout(items.length);
  const inset = `${COLLAGE_PADDING * 100}%`;

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden ${className}`}
      style={{ background: COLLAGE_BG }}
      role="img"
      aria-label={`Collage de la tenue « ${outfit.title} » : ${items.map((i) => i.name).join(", ")}`}
    >
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-xl">
          {outfit.title}
        </div>
      )}
      <div className="absolute" style={{ inset }}>
        {items.map((item, i) => {
          const t = tiles[i];
          return (
            <img
              key={i}
              src={item.imageUrl!}
              alt=""
              loading={loading}
              // mix-blend-multiply : le fond blanc des photos produits se fond dans le rose pâle
              className="absolute h-full w-full object-contain mix-blend-multiply"
              style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${t.w * 100}%`, height: `${t.h * 100}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
