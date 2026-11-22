"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { OutfitGrid } from "@/components/OutfitCard";
import { filterOutfits, readFilters } from "@/lib/filters";
import type { OutfitWithItems } from "@/lib/queries";

const PAR_PAGE = 24;

type Props = {
  /** Toutes les tenues publiées (le tri se fait ici, dans le navigateur). */
  outfits: OutfitWithItems[];
  /** Adresse de la page (ex. "/" ou "/collections/chic"). */
  basePath: string;
  /** Style déjà fixé (page collection) : le filtre de style est alors masqué. */
  fixedStyle?: string;
  /** Ancre vers laquelle revenir après filtrage. */
  anchor?: string;
  /** Titre affiché au-dessus des filtres, avec le nombre de tenues à droite (accueil). */
  heading?: ReactNode;
};

/**
 * Filtres + liste des tenues. Les filtres sont gardés dans l'adresse (?occasion=soiree)
 * pour pouvoir partager le lien, mais le tri est fait dans le navigateur :
 * le site n'a donc besoin d'aucun serveur (hébergement GitHub Pages).
 */
function Browser({ outfits, basePath, fixedStyle, anchor = "", heading }: Props) {
  const sp = useSearchParams();
  const filters = { ...readFilters(sp), ...(fixedStyle ? { style: fixedStyle } : {}) };
  const list = filterOutfits(outfits, filters);

  // Nombre de tenues affichées, gardé dans l'adresse (?plus=48)
  const demande = Number(sp.get("plus"));
  const shown = Number.isFinite(demande) && demande > PAR_PAGE ? demande : PAR_PAGE;
  const rest = list.length - shown;
  const more = new URLSearchParams(sp.toString());
  more.set("plus", String(shown + PAR_PAGE));

  return (
    <>
      {heading && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          {heading}
          <span className="text-[15px] font-bold text-ink-soft">
            {list.length} tenue{list.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
      <FilterBar basePath={basePath} current={filters} hideStyle={Boolean(fixedStyle)} anchor={anchor} />
      <OutfitGrid outfits={list.slice(0, shown)} />
      {rest > 0 && (
        <div className="mt-10 flex justify-center">
          <Link href={`${basePath}?${more.toString()}${anchor}`} scroll={false} className="lv-btn btn-secondary px-7 py-4 text-base">
            Voir plus de tenues ({rest} restante{rest > 1 ? "s" : ""})
          </Link>
        </div>
      )}
    </>
  );
}

export function OutfitBrowser(props: Props) {
  // useSearchParams demande un Suspense dans un site figé
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Browser {...props} />
    </Suspense>
  );
}
