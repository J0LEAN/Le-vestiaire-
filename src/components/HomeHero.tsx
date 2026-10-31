"use client";

import { useState } from "react";
import Link from "next/link";
import { BigHanger, HangerIcon, ShuffleIcon } from "@/components/icons";
import { OutfitVisual } from "@/components/OutfitVisual";

export type HeroOutfit = {
  slug: string;
  title: string;
  total: string; // budget déjà mis en forme (ex. « 214 € »)
  mainImage: string | null;
  items: { name: string; category: string; imageUrl: string | null; position: number }[];
};

/** Grand titre de l'accueil, avec une tenue vedette sur son cintre et le bouton « Surprenez-moi ». */
export function HomeHero({ outfits }: { outfits: HeroOutfit[] }) {
  const [index, setIndex] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const hero = outfits[index];

  // Choisit une autre tenue au hasard
  function surprise() {
    let next = Math.floor(Math.random() * (outfits.length - 1));
    if (next >= index) next++;
    setIndex(next);
    setSwaps((n) => n + 1);
  }

  return (
    <section className="flex flex-wrap items-center gap-12 pt-12 pb-10 md:pt-[72px]">
      <div className="flex min-w-0 flex-[999_1_540px] flex-col gap-6">
        <span className="lv-up s1 pill self-start">Le magazine des tenues complètes</span>
        <h1 className="lv-up s2 font-serif text-[clamp(48px,7.6vw,116px)] leading-[0.95] tracking-[-0.03em] [font-variation-settings:'SOFT'_100,'opsz'_144]">
          Vous ne savez pas quoi porter&nbsp;? <em>Copiez la tenue.</em>
        </h1>
        <p className="lv-up s3 max-w-[540px] text-lg leading-relaxed text-ink-soft sm:text-[19px]">
          Des tenues complètes, pièce par pièce, avec leurs liens et un conseil de style tout doux. Vous choisissez, vous
          comprenez, vous copiez.
        </p>
        <div className="lv-up s4 flex flex-wrap gap-3">
          <Link href="/#tenues" className="lv-btn lv-shine lv-glow btn-primary px-7 py-4 text-base font-extrabold">
            Voir les tenues
          </Link>
          <Link href="/collections" className="lv-btn btn-secondary px-6 py-4 text-base">
            Par style
          </Link>
          {outfits.length > 1 && (
            <button
              type="button"
              onClick={surprise}
              className="lv-btn inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-accent bg-white/40 px-[22px] py-4 text-base font-extrabold text-accent"
            >
              <ShuffleIcon className="h-[18px] w-[18px]" />
              Surprenez-moi
            </button>
          )}
        </div>
      </div>

      {hero && (
        <Link href={`/tenues/${hero.slug}`} className="lv-up s3 mx-auto flex w-full max-w-[440px] flex-[1_1_340px] flex-col items-center">
          <span className="rail block w-full" aria-hidden="true" />
          <BigHanger className="lv-swing -mt-2.5 block h-[58px] w-[150px] text-ink" />
          <span className="lv-swing glass relative -mt-1.5 block w-full rounded-[36px] p-3" style={{ transformOrigin: "top center" }}>
            {/* Badge tournant « Copiez-la en 1 clic » */}
            <span className="lv-spin absolute -top-6 -right-3 z-10 block h-[88px] w-[88px] rounded-full bg-accent shadow-[0_12px_26px_rgba(209,31,90,0.4)] sm:-top-[30px] sm:-right-[30px] sm:h-[104px] sm:w-[104px]" aria-hidden="true">
              <svg viewBox="0 0 104 104" className="h-full w-full">
                <defs>
                  <path id="lv-cercle" d="M52,52 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text fill="#FFF5FA" fontFamily="var(--font-nunito), sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="1.6" textLength="228" lengthAdjust="spacing">
                  <textPath href="#lv-cercle">COPIEZ-LA ✦ EN 1 CLIC ✦</textPath>
                </text>
              </svg>
              <HangerIcon className="absolute top-1/2 left-1/2 h-[26px] w-[34px] -translate-x-1/2 -translate-y-1/2 text-on-ink" />
            </span>
            <span key={swaps} className={`block ${swaps ? `lv-swap${swaps % 2 ? "A" : "B"}` : ""}`}>
              <OutfitVisual outfit={hero} priority className="rounded-[26px]" />
            </span>
            <span className="flex items-center justify-between gap-3 px-2 pt-3.5 pb-1">
              <span className="font-serif text-[22px] leading-[1.1]">{hero.title}</span>
              <span className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-extrabold whitespace-nowrap text-on-ink">≈ {hero.total}</span>
            </span>
          </span>
        </Link>
      )}
      {/* Annonce la tenue affichée après « Surprenez-moi » */}
      <p className="sr-only" aria-live="polite">{swaps > 0 && hero ? `Tenue proposée : ${hero.title}` : ""}</p>
    </section>
  );
}
