"use client";

import Link from "next/link";
import { BigHanger } from "@/components/icons";
import { OutfitGrid } from "@/components/OutfitCard";
import type { OutfitWithItems } from "@/lib/queries";
import { usePortant } from "./PortantProvider";

/** Tenues du portant, dans l'ordre où elles ont été ajoutées (les plus récentes d'abord). */
export function PortantList({ outfits }: { outfits: OutfitWithItems[] }) {
  const { saved } = usePortant();
  // Les tenues dépubliées entre-temps sont simplement ignorées.
  const list = [...saved]
    .reverse()
    .map((slug) => outfits.find((o) => o.slug === slug))
    .filter((o): o is OutfitWithItems => Boolean(o));

  if (list.length === 0) {
    return (
      <div className="glass mt-10 flex flex-col items-center rounded-[36px] px-6 py-14 text-center">
        <div className="rail w-56" aria-hidden="true" />
        <BigHanger className="lv-swing -mt-2.5 block h-[54px] w-[140px] text-ink" />
        <h2 className="mt-6 font-serif text-3xl">Votre portant attend sa première tenue</h2>
        <p className="mt-3 max-w-md text-ink-soft">
          Touchez le cintre sur une tenue qui vous plaît : elle viendra se ranger ici, prête à être copiée.
        </p>
        <Link href="/#tenues" className="lv-btn lv-shine btn-primary mt-7 px-7 py-4 text-base font-extrabold">
          Voir les tenues
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="mb-5 text-[15px] font-bold text-ink-soft">
        {list.length} tenue{list.length > 1 ? "s" : ""} sur votre portant
      </p>
      <OutfitGrid outfits={list} />
    </div>
  );
}
