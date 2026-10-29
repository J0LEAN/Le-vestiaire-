import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { OutfitGrid } from "@/components/OutfitCard";
import { OutfitVisual } from "@/components/OutfitVisual";
import { OCCASIONS, labelOf } from "@/lib/constants";
import { getFeaturedOutfits, getPublishedOutfits, readFilters } from "@/lib/queries";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const filters = readFilters(await searchParams);
  const [featured, outfits] = await Promise.all([getFeaturedOutfits(), getPublishedOutfits(filters)]);

  return (
    <>
      {/* En-tête de présentation */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-20">
          <p className="eyebrow">Le magazine des tenues complètes</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Vous ne savez pas quoi porter&nbsp;? Copiez la tenue.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Chaque tenue est composée pièce par pièce, avec ses liens pour tout retrouver. Haut, bas, chaussures,
            accessoires&nbsp;: il ne vous reste qu&apos;à choisir.
          </p>
          <ol className="mx-auto mt-10 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
            {[
              ["Choisissez", "une tenue selon l'occasion, la saison et votre budget."],
              ["Comprenez", "pourquoi elle fonctionne, grâce au conseil de style."],
              ["Copiez-la", "en ouvrant les liens de chaque pièce en un clic."],
            ].map(([title, text], i) => (
              <li key={title} className="flex gap-3">
                <span className="font-serif text-3xl leading-none">{i + 1}</span>
                <p className="text-sm">
                  <strong className="font-semibold">{title}</strong> {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tenues à la une */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <h2 className="eyebrow mb-6">À la une</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((o, i) => (
              <Link key={o.id} href={`/tenues/${o.slug}`} className="group block">
                <OutfitVisual outfit={o} priority={i === 0} />
                <p className="eyebrow mt-4 text-muted">{labelOf(OCCASIONS, o.occasion)}</p>
                <h3 className="mt-1 font-serif text-2xl leading-snug group-hover:underline underline-offset-4">{o.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{o.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Toutes les tenues, avec filtres */}
      <section id="tenues" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16">
        <h2 className="mb-6 font-serif text-3xl">Toutes les tenues</h2>
        <FilterBar basePath="/" current={filters} anchor="#tenues" />
        <OutfitGrid outfits={outfits} />
      </section>
    </>
  );
}
