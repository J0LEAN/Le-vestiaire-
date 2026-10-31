import type { Metadata } from "next";
import Link from "next/link";
import { BigHanger } from "@/components/icons";
import { OutfitVisual } from "@/components/OutfitVisual";
import { STYLES } from "@/lib/constants";
import { getPublishedOutfits } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Collections par style",
  description: "Toutes les tenues du Vestiaire classées par style : classique, chic, casual, minimaliste, bohème…",
  alternates: { canonical: "/collections" },
};

const TILTS = ["-1.2deg", "0.9deg", "-0.5deg"];

export default async function CollectionsPage() {
  const outfits = await getPublishedOutfits();
  // Seuls les styles qui ont au moins une tenue publiée sont affichés.
  const collections = STYLES.map((s) => ({ ...s, outfits: outfits.filter((o) => o.style === s.value) })).filter(
    (c) => c.outfits.length > 0,
  );

  return (
    <div className="pt-12">
      <span className="pill">Par style</span>
      <h1 className="mt-4 font-serif text-[44px] leading-none tracking-[-0.02em] md:text-[64px]">
        Les <em>collections</em>
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">Trouvez votre style, puis la tenue qui vous ressemble.</p>

      <div className="rail mt-12 h-[18px]" aria-hidden="true" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-1 sm:gap-x-9 sm:px-5 md:grid-cols-3">
        {collections.map((c, i) => (
          <Link
            key={c.value}
            href={`/collections/${c.value}`}
            className={`lv-swing ${["", "d1", "d2"][i % 3]} flex flex-col items-center`}
            style={{ transform: `rotate(${TILTS[i % 3]})`, transformOrigin: "top center" }}
          >
            <BigHanger className="-mt-3 block h-[44px] w-[114px] text-ink sm:h-[54px] sm:w-[140px]" />
            <span className="lv-card glass -mt-1.5 flex w-full flex-col rounded-[26px] p-2 sm:rounded-[34px] sm:p-2.5">
              <OutfitVisual outfit={c.outfits[0]} className="rounded-[20px] sm:rounded-[26px]" />
              <span className="px-2 pt-3 pb-1.5">
                <span className="block font-serif text-2xl leading-none sm:text-[28px]">{c.label}</span>
                <span className="mt-1.5 block text-sm font-bold text-ink-soft">
                  {c.outfits.length} tenue{c.outfits.length > 1 ? "s" : ""}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
