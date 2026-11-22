import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OutfitBrowser } from "@/components/OutfitBrowser";
import { STYLES } from "@/lib/constants";
import { getPublishedOutfits } from "@/lib/queries";

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

// Une page par style, fabriquée à l'avance.
export const dynamicParams = false;
export function generateStaticParams() {
  return STYLES.map((s) => ({ style: s.value }));
}

export default async function CollectionPage({ params }: PageProps<"/collections/[style]">) {
  const { style } = await params;
  const s = STYLES.find((x) => x.value === style);
  if (!s) notFound();

  const outfits = await getPublishedOutfits({ style: s.value });

  return (
    <div className="pt-12">
      <Link href="/collections" className="pill">← Collections</Link>
      <h1 className="mt-4 font-serif text-[44px] leading-none tracking-[-0.02em] md:text-[64px]">
        Tenues <em>{s.label.toLowerCase()}</em>
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">{s.description}</p>
      <OutfitBrowser outfits={outfits} basePath={`/collections/${s.value}`} fixedStyle={s.value} />
    </div>
  );
}
