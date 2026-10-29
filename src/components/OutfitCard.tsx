import Link from "next/link";
import { OCCASIONS, SEASONS, labelOf } from "@/lib/constants";
import { formatPrice, outfitBudget } from "@/lib/format";
import type { OutfitWithItems } from "@/lib/queries";
import { OutfitVisual } from "./OutfitVisual";

/** Carte d'une tenue dans une grille. */
export function OutfitCard({ outfit, priority }: { outfit: OutfitWithItems; priority?: boolean }) {
  return (
    <Link href={`/tenues/${outfit.slug}`} className="group block">
      <OutfitVisual outfit={outfit} priority={priority} className="transition-opacity group-hover:opacity-90" />
      <div className="mt-3">
        <p className="eyebrow text-muted">
          {labelOf(OCCASIONS, outfit.occasion)} · {labelOf(SEASONS, outfit.season)}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug group-hover:underline underline-offset-4">{outfit.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {outfit.items.length} pièce{outfit.items.length > 1 ? "s" : ""} · env. {formatPrice(outfitBudget(outfit))}
        </p>
      </div>
    </Link>
  );
}

/** Grille de cartes (2 colonnes sur mobile, jusqu'à 4 sur grand écran). */
export function OutfitGrid({ outfits }: { outfits: OutfitWithItems[] }) {
  if (outfits.length === 0) {
    return (
      <p className="border border-line bg-mist p-8 text-center text-sm">
        Aucune tenue ne correspond à ces critères pour le moment. Essayez d&apos;enlever un filtre.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {outfits.map((o, i) => (
        <OutfitCard key={o.id} outfit={o} priority={i < 4} />
      ))}
    </div>
  );
}
