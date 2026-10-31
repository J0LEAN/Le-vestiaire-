/* eslint-disable @next/next/no-img-element -- les images viennent de sites marchands variés */
import { itemRel } from "@/components/ItemLink";
import { COLLAGE_BG, COLLAGE_PADDING, collageItems, collageLayout } from "@/lib/collage";
import { formatPrice } from "@/lib/format";

type Props = {
  outfit: {
    title: string;
    mainImage: string | null;
    items: {
      name: string;
      category: string;
      imageUrl: string | null;
      position: number;
      // utiles seulement avec `shoppable`
      url?: string;
      isAffiliate?: boolean;
      price?: number | null;
    }[];
  };
  /** Chaque article du collage devient un lien vers sa boutique (page d'une tenue). */
  shoppable?: boolean;
  /** true pour la première image visible de la page (chargement prioritaire). */
  priority?: boolean;
  className?: string;
};

/**
 * Visuel d'une tenue : l'image principale si elle existe,
 * sinon un collage automatique des images de ses articles.
 * Le cadre est toujours vertical (4:5) et arrondi.
 */
export function OutfitVisual({ outfit, priority, shoppable, className = "rounded-[24px]" }: Props) {
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
      role={shoppable ? "group" : "img"}
      aria-label={
        shoppable
          ? `Les pièces de la tenue « ${outfit.title} »`
          : `Collage de la tenue « ${outfit.title} » : ${items.map((i) => i.name).join(", ")}`
      }
    >
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-xl">
          {outfit.title}
        </div>
      )}
      <div className="absolute" style={{ inset }}>
        {items.map((item, i) => {
          const t = tiles[i];
          const box = { left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${t.w * 100}%`, height: `${t.h * 100}%` };
          // mix-blend-multiply : le fond blanc des photos produits se fond dans le rose pâle
          const img = (
            <img
              src={item.imageUrl!}
              alt=""
              loading={loading}
              className={`h-full w-full object-contain mix-blend-multiply ${shoppable ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
            />
          );
          if (!shoppable || !item.url) {
            return <span key={i} className="absolute" style={box}>{img}</span>;
          }
          const price = item.price != null ? ` · ${formatPrice(item.price)}` : "";
          return (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel={itemRel(Boolean(item.isAffiliate))}
              aria-label={`Voir l'article : ${item.name}${price}${item.isAffiliate ? " (lien affilié)" : ""}`}
              className="group absolute rounded-2xl focus-visible:outline-2 focus-visible:outline-accent"
              style={box}
            >
              {img}
              {/* Mention toujours visible sur les liens affiliés (obligation légale) */}
              {item.isAffiliate && (
                <span className="absolute top-0 left-0 rounded-full bg-white/85 px-1.5 py-0.5 text-[10px] font-bold">affilié</span>
              )}
              {/* Nom et prix au survol ou au clavier */}
              <span className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-max max-w-[160%] -translate-x-1/2 translate-y-1/2 rounded-full bg-ink px-3 py-1.5 text-center text-xs font-bold text-on-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.name}
                {price}
                {item.isAffiliate && " · Lien affilié"} ↗
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
