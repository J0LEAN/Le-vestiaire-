import type { Metadata } from "next";
import Link from "next/link";
import { OutfitVisual } from "@/components/OutfitVisual";
import { STYLES } from "@/lib/constants";
import { getPublishedOutfits } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Collections par style",
  description: "Toutes les tenues du Vestiaire classées par style : classique, chic, casual, minimaliste, bohème…",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const outfits = await getPublishedOutfits();
  // Seuls les styles qui ont au moins une tenue publiée sont affichés.
  const collections = STYLES.map((s) => ({ ...s, outfits: outfits.filter((o) => o.style === s.value) })).filter(
    (c) => c.outfits.length > 0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-serif text-4xl md:text-5xl">Collections</h1>
      <p className="mt-3 max-w-xl text-muted">Trouvez votre style, puis la tenue qui vous ressemble.</p>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.value} href={`/collections/${c.value}`} className="group block">
            <OutfitVisual outfit={c.outfits[0]} />
            <h2 className="mt-3 font-serif text-2xl group-hover:underline underline-offset-4">{c.label}</h2>
            <p className="text-sm text-muted">
              {c.outfits.length} tenue{c.outfits.length > 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
