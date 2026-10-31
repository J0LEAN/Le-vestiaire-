import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackIcon, BigHanger } from "@/components/icons";
import { BuyBar, ChecklistProvider, PiecesList } from "@/components/OutfitPieces";
import { OutfitVisual } from "@/components/OutfitVisual";
import { PinterestButton } from "@/components/PinterestButton";
import { SaveButton } from "@/components/portant/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { CATEGORIES, OCCASIONS, SEASONS, STYLES, labelOf } from "@/lib/constants";
import { outfitBudget } from "@/lib/format";
import { getOutfitBySlug, getPublishedOutfits } from "@/lib/queries";
import { OG_DEFAULTS } from "@/lib/site";
import { splitFirstSentence, splitLastWord } from "@/lib/text";

// Balises SEO propres à chaque tenue (titre, description, image de partage).
export async function generateMetadata({ params }: PageProps<"/tenues/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const outfit = await getOutfitBySlug(slug);
  if (!outfit) return {};
  const image = `/visuels/${slug}?format=og`;
  return {
    title: outfit.title,
    description: outfit.description,
    alternates: { canonical: `/tenues/${slug}` },
    openGraph: { ...OG_DEFAULTS, title: outfit.title, description: outfit.description, type: "article", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { title: outfit.title, description: outfit.description, images: [image] },
  };
}

export default async function OutfitPage({ params }: PageProps<"/tenues/[slug]">) {
  const { slug } = await params;
  const outfit = await getOutfitBySlug(slug);
  if (!outfit) notFound();

  const hasAffiliate = outfit.items.some((i) => i.isAffiliate);
  const similar = (await getPublishedOutfits({ style: outfit.style })).filter((o) => o.id !== outfit.id).slice(0, 4);
  const [titleStart, titleEnd] = splitLastWord(outfit.title);
  const [quote, explanation] = splitFirstSentence(outfit.whyItWorks);
  const pieces = outfit.items.map((i) => ({
    id: i.id,
    name: i.name,
    category: labelOf(CATEGORIES, i.category),
    brand: i.brand,
    price: i.price,
    imageUrl: i.imageUrl,
    url: i.url,
    isAffiliate: i.isAffiliate,
  }));

  return (
    <ChecklistProvider pieces={pieces} budget={outfitBudget(outfit)}>
      <article className="pt-6">
        {/* Retour, partage, portant */}
        <div className="flex items-center justify-between">
          <Link href="/#tenues" aria-label="Retour aux tenues" className="lv-btn glass flex h-12 w-12 items-center justify-center rounded-full">
            <BackIcon />
          </Link>
          <div className="flex gap-2">
            <ShareButton title={outfit.title} />
            <SaveButton slug={outfit.slug} title={outfit.title} variant="hero" />
          </div>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
          {/* La tenue sur son cintre */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="rail mx-2 h-3.5" aria-hidden="true" />
            <div className="lv-swing flex flex-col items-center">
              <BigHanger className="-mt-2.5 block h-[50px] w-[130px] text-ink" />
              <div className="glass -mt-1.5 w-full rotate-[-1deg] rounded-[36px] p-2.5" style={{ transformOrigin: "top center" }}>
                <OutfitVisual outfit={outfit} priority className="rounded-[28px]" />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="lv-up s2 flex flex-col gap-3.5">
              <div className="flex flex-wrap gap-1.5">
                {[
                  [`/collections/${outfit.style}`, labelOf(STYLES, outfit.style)],
                  [`/?occasion=${outfit.occasion}#tenues`, labelOf(OCCASIONS, outfit.occasion)],
                  [null, labelOf(SEASONS, outfit.season)],
                ].map(([href, label]) =>
                  href ? (
                    <Link key={label} href={href} className="lv-chip rounded-full border border-white/95 bg-white/60 px-3.5 py-2 text-[13px] font-bold">{label}</Link>
                  ) : (
                    <span key={label} className="rounded-full border border-white/95 bg-white/60 px-3.5 py-2 text-[13px] font-bold">{label}</span>
                  ),
                )}
              </div>
              <h1 className="font-serif text-[44px] leading-none tracking-[-0.025em] md:text-[56px] [font-variation-settings:'SOFT'_100,'opsz'_144]">
                {titleStart}
                <em>{titleEnd}</em>
              </h1>
              <p className="text-[17px] leading-[1.55] text-ink-soft">{outfit.description}</p>
              <PinterestButton slug={outfit.slug} title={outfit.title} />
            </div>

            {/* Conseil de style */}
            <section aria-labelledby="pourquoi" className="lv-reveal relative mt-8 overflow-hidden rounded-[32px] bg-ink px-[22px] py-6 text-on-ink sm:px-8 sm:py-8">
              <span className="lv-halo absolute -right-[70px] -bottom-[70px] h-[220px] w-[220px] rounded-full bg-accent opacity-70 blur-[60px]" aria-hidden="true" />
              <h2 id="pourquoi" className="relative inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[13px] font-extrabold">
                Pourquoi ça marche
              </h2>
              <p className="relative mt-4 font-serif text-[25px] leading-[1.2] sm:text-[28px]">{quote}</p>
              {explanation && <p className="relative mt-3 text-[15px] leading-relaxed text-[#EBD8E4]">{explanation}</p>}
            </section>

            {/* Les pièces */}
            <section aria-labelledby="pieces" className="pt-9">
              <div className="mb-3.5 flex items-baseline justify-between">
                <h2 id="pieces" className="font-serif text-[30px]">Les pièces</h2>
                <span className="text-sm font-bold text-ink-soft">{pieces.length} pièce{pieces.length > 1 ? "s" : ""}</span>
              </div>
              <PiecesList />
              <p className="mx-1 mt-3.5 text-[13px] leading-[1.55] text-ink-soft">
                {hasAffiliate && (
                  <>
                    Certains liens sont affiliés : Le Vestiaire peut toucher une petite commission, sans surcoût pour vous.{" "}
                    <Link href="/liens-affilies" className="underline">En savoir plus</Link>.{" "}
                  </>
                )}
                Prix relevés à la création de la tenue, susceptibles d&apos;avoir changé.
              </p>
            </section>
          </div>
        </div>

        {/* Dans le même esprit */}
        {similar.length > 0 && (
          <section aria-labelledby="meme-esprit" className="pt-16">
            <h2 id="meme-esprit" className="mb-3.5 font-serif text-[28px] md:text-[36px]">
              Dans le même <em>esprit</em>
            </h2>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
              {similar.map((o) => (
                <Link key={o.id} href={`/tenues/${o.slug}`} className="lv-card glass flex w-[200px] flex-none flex-col rounded-[24px] p-1.5 md:w-auto">
                  <OutfitVisual outfit={o} className="rounded-[18px]" />
                  <span className="px-1.5 pt-2.5 pb-1.5 font-serif text-lg leading-[1.1]">{o.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BuyBar />
      </article>
    </ChecklistProvider>
  );
}
