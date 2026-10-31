import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { HomeHero, type HeroOutfit } from "@/components/HomeHero";
import { HangingOutfits, PagedOutfitGrid } from "@/components/OutfitCard";
import { formatPrice, outfitBudget } from "@/lib/format";
import { getFeaturedOutfits, getPublishedOutfits, readFilters, type OutfitWithItems } from "@/lib/queries";
import { OG_DEFAULTS } from "@/lib/site";
import { splitFirstSentence } from "@/lib/text";

// Image de partage de l'accueil : le visuel de la tenue à la une la plus récente.
export async function generateMetadata(): Promise<Metadata> {
  const [first] = await getFeaturedOutfits();
  return {
    alternates: { canonical: "/" },
    openGraph: first ? { ...OG_DEFAULTS, type: "website", images: [{ url: `/visuels/${first.slug}?format=og`, width: 1200, height: 630 }] } : undefined,
  };
}

const STEPS = [
  ["Choisissez", "une tenue selon l'occasion, la saison ou votre budget."],
  ["Comprenez", "pourquoi elle fonctionne, grâce au conseil de style."],
  ["Copiez-la", "en ouvrant le lien de chaque pièce."],
];

/** Données minimales d'une tenue pour le grand titre (composant navigateur). */
const toHero = (o: OutfitWithItems): HeroOutfit => ({
  slug: o.slug,
  title: o.title,
  total: formatPrice(outfitBudget(o)),
  mainImage: o.mainImage,
  items: o.items.map(({ name, category, imageUrl, position }) => ({ name, category, imageUrl, position })),
});

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const filters = readFilters(sp);
  const filtered = Object.values(filters).some(Boolean);
  const [featured, outfits, all] = await Promise.all([
    getFeaturedOutfits(),
    getPublishedOutfits(filters),
    filtered ? getPublishedOutfits() : null,
  ]);
  const published = all ?? outfits;
  // La tenue vedette : d'abord les tenues à la une, puis les autres (pour « Surprenez-moi »)
  const heroList = [...featured, ...published.filter((o) => !featured.some((f) => f.id === o.id))].map(toHero);
  const quoted = featured[0] ?? published[0];

  return (
    <>
      <HomeHero outfits={heroList} />

      {/* Les 3 étapes */}
      <ol className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {STEPS.map(([verb, rest], i) => (
          <li key={verb} className="lv-card lv-reveal glass flex items-center gap-4 rounded-[28px] py-[18px] pr-[22px] pl-[18px]">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-accent text-lg font-extrabold text-on-ink">{i + 1}</span>
            <span className="text-base leading-[1.45]">
              <strong className="font-extrabold">{verb}</strong> {rest}
            </span>
          </li>
        ))}
      </ol>

      {/* Tenues à la une, sur le portant */}
      {featured.length > 0 && (
        <section aria-labelledby="une" className="pt-20 md:pt-24">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="une" className="lv-reveal font-serif text-[40px] leading-none tracking-[-0.02em] md:text-[52px]">
              Sur le portant <em>cette semaine</em>
            </h2>
            <span className="pill">
              {featured.length} tenue{featured.length > 1 ? "s" : ""} à la une
            </span>
          </div>
          <HangingOutfits outfits={featured} />
        </section>
      )}

      {/* Toutes les tenues, avec filtres */}
      <section id="tenues" aria-labelledby="toutes" className="scroll-mt-28 pt-20 md:pt-[104px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="toutes" className="lv-reveal font-serif text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[64px]">
            Toutes les tenues
          </h2>
          <span className="text-[15px] font-bold text-ink-soft">
            {outfits.length} tenue{outfits.length > 1 ? "s" : ""}
          </span>
        </div>
        <FilterBar basePath="/" current={filters} anchor="#tenues" />
        <PagedOutfitGrid outfits={outfits} searchParams={sp} basePath="/" anchor="#tenues" />
      </section>

      {/* Pourquoi ça marche : extrait du conseil d'une tenue à la une */}
      {quoted && (
        <section className="lv-reveal relative mt-20 flex flex-wrap items-center gap-8 overflow-hidden rounded-[36px] bg-ink p-7 text-on-ink sm:p-14 md:mt-[104px] md:gap-12 md:rounded-[44px]">
          <span className="lv-halo absolute -top-20 -right-20 h-[360px] w-[360px] rounded-full bg-accent opacity-55 blur-[90px]" aria-hidden="true" />
          <div className="relative flex flex-[1_1_260px] flex-col gap-[18px]">
            <span className="self-start rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold">Pourquoi ça marche</span>
            <p className="text-[17px] leading-relaxed text-[#EBD8E4]">
              Chaque tenue est livrée avec son explication, sans jargon. À force de copier, on apprend à composer.
            </p>
            <Link href={`/tenues/${quoted.slug}`} className="font-extrabold text-on-ink underline-offset-4 hover:underline">
              Lire la tenue « {quoted.title} » →
            </Link>
          </div>
          <blockquote className="relative min-w-0 flex-[999_1_520px] rounded-[32px] border border-white/20 bg-white/10 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl sm:px-11 sm:py-10">
            <p className="font-serif text-[clamp(26px,3.2vw,44px)] leading-[1.18]">« {splitFirstSentence(quoted.whyItWorks)[0]} »</p>
          </blockquote>
        </section>
      )}
    </>
  );
}
