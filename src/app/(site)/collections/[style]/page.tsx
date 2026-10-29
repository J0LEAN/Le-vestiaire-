import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { OutfitGrid } from "@/components/OutfitCard";
import { STYLES } from "@/lib/constants";
import { getPublishedOutfits, readFilters } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/collections/[style]">): Promise<Metadata> {
  const { style } = await params;
  const s = STYLES.find((x) => x.value === style);
  if (!s) return {};
  return {
    title: `Tenues ${s.label.toLowerCase()}`,
    description: `${s.description} Découvrez nos tenues complètes de style ${s.label.toLowerCase()}, prêtes à copier.`,
    alternates: { canonical: `/collections/${s.value}` },
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[style]">) {
  const { style } = await params;
  const s = STYLES.find((x) => x.value === style);
  if (!s) notFound();

  const filters = { ...readFilters(await searchParams), style: s.value };
  const outfits = await getPublishedOutfits(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <p className="eyebrow text-muted">Collection</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{s.label}</h1>
      <p className="mt-3 mb-10 max-w-xl text-muted">{s.description}</p>
      <FilterBar basePath={`/collections/${s.value}`} current={filters} hideStyle />
      <OutfitGrid outfits={outfits} />
    </div>
  );
}
