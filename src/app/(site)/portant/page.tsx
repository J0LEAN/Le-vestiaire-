import type { Metadata } from "next";
import { PortantList } from "@/components/portant/PortantList";
import { getPublishedOutfits } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mon portant",
  description: "Les tenues que vous avez mises de côté.",
  robots: { index: false }, // page personnelle
};

export default async function PortantPage() {
  // Toutes les tenues publiées ; le navigateur affiche celles mises de côté.
  const outfits = await getPublishedOutfits();
  return (
    <div className="pt-12">
      <span className="pill">Vos favorites</span>
      <h1 className="mt-4 font-serif text-[44px] leading-none tracking-[-0.02em] md:text-[64px]">
        Mon <em>portant</em>
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        Les tenues que vous avez mises de côté avec le bouton cintre. Elles sont gardées sur ce navigateur.
      </p>
      <PortantList outfits={outfits} />
    </div>
  );
}
