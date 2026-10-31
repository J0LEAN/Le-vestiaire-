import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="pt-12">
      <Link href="/collections" className="pill">← Collections</Link>
      <h1 className="mt-4 font-serif text-[44px] leading-none tracking-[-0.02em] md:text-[64px]">
        Tenues <em>{s.label.toLowerCase()}</em>
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">{s.description}</p>
      <FilterBar basePath={`/collections/${s.value}`} current={filters} hideStyle />
      <OutfitGrid outfits={outfits} />
    </div>
  );
}
