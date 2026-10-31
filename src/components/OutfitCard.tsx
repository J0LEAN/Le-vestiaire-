import Link from "next/link";
import { BigHanger } from "@/components/icons";
import { SaveButton } from "@/components/portant/SaveButton";
import { OCCASIONS, SEASONS, STYLES, labelOf } from "@/lib/constants";
import { formatPrice, outfitBudget } from "@/lib/format";
import type { OutfitWithItems } from "@/lib/queries";
import { OutfitVisual } from "./OutfitVisual";
import { PinterestButton } from "./PinterestButton";

const pieces = (n: number) => `${n} pièce${n > 1 ? "s" : ""}`;

/** Carte d'une tenue dans une grille (collage, bouton cintre, Pinterest). */
export function OutfitCard({ outfit, priority }: { outfit: OutfitWithItems; priority?: boolean }) {
  const href = `/tenues/${outfit.slug}`;
  return (
    <article className="lv-card lv-reveal glass flex flex-col rounded-[24px] p-1.5 sm:rounded-[32px] sm:p-2.5">
      <div className="relative">
        <Link href={href} aria-label={outfit.title} tabIndex={-1}>
          <OutfitVisual outfit={outfit} priority={priority} className="rounded-[18px] sm:rounded-[24px]" />
        </Link>
        <div className="absolute top-2 right-2 flex flex-col gap-2 sm:top-2.5 sm:right-2.5">
          <SaveButton slug={outfit.slug} title={outfit.title} />
          <span className="hidden sm:block">
            <PinterestButton slug={outfit.slug} title={outfit.title} round />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-2 pt-3 pb-2 sm:px-2.5 sm:pt-3.5">
        <span className="text-xs font-bold text-ink-muted sm:text-[13px]">
          {labelOf(OCCASIONS, outfit.occasion)}
          <span className="hidden sm:inline"> · {labelOf(STYLES, outfit.style)} · {labelOf(SEASONS, outfit.season)}</span>
        </span>
        <Link href={href} className="font-serif text-lg leading-[1.1] hover:text-accent sm:text-2xl">
          {outfit.title}
        </Link>
        <span className="flex items-center justify-between pt-1.5 text-sm font-bold">
          <span className="hidden sm:inline">{pieces(outfit.items.length)}</span>
          <span>≈ {formatPrice(outfitBudget(outfit))}</span>
        </span>
      </div>
    </article>
  );
}

/** Grille de cartes (2 colonnes sur mobile, jusqu'à 4 sur grand écran). */
export function OutfitGrid({ outfits }: { outfits: OutfitWithItems[] }) {
  if (outfits.length === 0) {
    return (
      <p className="py-12 text-center font-serif text-3xl">
        Aucune tenue pour ces critères… <em>pour l&apos;instant.</em>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4">
      {outfits.map((o, i) => (
        <OutfitCard key={o.id} outfit={o} priority={i < 4} />
      ))}
    </div>
  );
}

const TILTS = ["-1.4deg", "1deg", "-0.6deg"];
const SWINGS = ["", "d1", "d2"];

/** Tenues « à la une » suspendues à la tringle sur leurs cintres. */
export function HangingOutfits({ outfits }: { outfits: OutfitWithItems[] }) {
  return (
    <div>
      <div className="rail h-[18px]" aria-hidden="true" />
      <div className="-mx-4 flex snap-x gap-6 overflow-x-auto px-6 pb-6 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:gap-9 sm:overflow-visible sm:px-5">
        {outfits.map((o, i) => (
          <Link
            key={o.id}
            href={`/tenues/${o.slug}`}
            className={`lv-swing ${SWINGS[i % 3]} flex w-[78%] shrink-0 snap-center flex-col items-center sm:w-auto`}
            style={{ transform: `rotate(${TILTS[i % 3]})`, transformOrigin: "top center" }}
          >
            <BigHanger className="-mt-3 block h-[54px] w-[140px] text-ink" />
            <span className="lv-card glass -mt-1.5 flex w-full flex-col rounded-[34px] p-2.5">
              <span className="relative block">
                <OutfitVisual outfit={o} priority={i === 0} className="rounded-[26px]" />
                <span className="absolute top-3 left-3 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-extrabold backdrop-blur-md">
                  {labelOf(OCCASIONS, o.occasion)}
                </span>
              </span>
              <span className="flex flex-col gap-2 px-2.5 pt-4 pb-2">
                <span className="font-serif text-[26px] leading-[1.08] sm:text-[28px]">{o.title}</span>
                <span className="line-clamp-2 text-[15px] leading-normal text-ink-soft">{o.description}</span>
                <span className="flex items-center justify-between pt-1.5 text-sm font-bold">
                  <span>{pieces(o.items.length)}</span>
                  <span className="rounded-full bg-ink px-3 py-1.5 text-on-ink">≈ {formatPrice(outfitBudget(o))}</span>
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const PAR_PAGE = 24;

/**
 * Grille affichée par paquets de 24, avec un bouton « Voir plus de tenues ».
 * Le nombre affiché est gardé dans l'adresse (?plus=48) : les filtres restent actifs
 * et le lien peut être partagé.
 */
export function PagedOutfitGrid({
  outfits,
  searchParams,
  basePath,
  anchor = "",
}: {
  outfits: OutfitWithItems[];
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
  anchor?: string;
}) {
  const demande = Number(searchParams.plus);
  const shown = Number.isFinite(demande) && demande > PAR_PAGE ? demande : PAR_PAGE;
  const rest = outfits.length - shown;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) if (typeof v === "string" && k !== "plus") params.set(k, v);
  params.set("plus", String(shown + PAR_PAGE));

  return (
    <>
      <OutfitGrid outfits={outfits.slice(0, shown)} />
      {rest > 0 && (
        <div className="mt-10 flex justify-center">
          <Link href={`${basePath}?${params.toString()}${anchor}`} scroll={false} className="lv-btn btn-secondary px-7 py-4 text-base">
            Voir plus de tenues ({rest} restante{rest > 1 ? "s" : ""})
          </Link>
        </div>
      )}
    </>
  );
}
