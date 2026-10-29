/* eslint-disable @next/next/no-img-element -- images de sites marchands variés */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateBadge, ItemLink } from "@/components/ItemLink";
import { BuyAllButton } from "@/components/BuyAllButton";
import { OutfitCard } from "@/components/OutfitCard";
import { OutfitVisual } from "@/components/OutfitVisual";
import { PinterestButton } from "@/components/PinterestButton";
import { CATEGORIES, OCCASIONS, SEASONS, STYLES, labelOf } from "@/lib/constants";
import { formatPrice, outfitBudget } from "@/lib/format";
import { getOutfitBySlug, getPublishedOutfits } from "@/lib/queries";

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
    openGraph: { title: outfit.title, description: outfit.description, type: "article", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { title: outfit.title, description: outfit.description, images: [image] },
  };
}

export default async function OutfitPage({ params }: PageProps<"/tenues/[slug]">) {
  const { slug } = await params;
  const outfit = await getOutfitBySlug(slug);
  if (!outfit) notFound();

  const hasAffiliate = outfit.items.some((i) => i.isAffiliate);
  const similar = (await getPublishedOutfits({ style: outfit.style })).filter((o) => o.id !== outfit.id).slice(0, 4);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-6">
      {/* Fil d'Ariane */}
      <nav className="text-xs text-muted" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:underline">Accueil</Link> /{" "}
        <Link href={`/collections/${outfit.style}`} className="hover:underline">{labelOf(STYLES, outfit.style)}</Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <OutfitVisual outfit={outfit} priority />
        </div>

        <div>
          <p className="eyebrow text-muted">
            {labelOf(STYLES, outfit.style)} · {labelOf(OCCASIONS, outfit.occasion)} · {labelOf(SEASONS, outfit.season)}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{outfit.title}</h1>
          <p className="mt-4 text-lg leading-relaxed">{outfit.description}</p>
          <p className="mt-4 text-sm">
            Budget indicatif : <strong>environ {formatPrice(outfitBudget(outfit))}</strong>
          </p>

          <div className="mt-6 grid gap-3">
            <BuyAllButton links={outfit.items.map((i) => ({ name: i.name, url: i.url }))} />
            <PinterestButton slug={outfit.slug} title={outfit.title} />
          </div>

          {/* Conseil de style */}
          <section className="mt-10 border-l-2 border-ink bg-mist p-6">
            <h2 className="eyebrow">Pourquoi ça marche</h2>
            <p className="mt-3 font-serif text-lg leading-relaxed">{outfit.whyItWorks}</p>
          </section>

          {/* Liste des articles */}
          <section className="mt-10">
            <h2 className="eyebrow mb-4">Les pièces de la tenue</h2>
            <ul className="divide-y divide-line border-y border-line">
              {outfit.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="h-24 w-20 shrink-0 bg-mist p-2">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-xs text-muted">
                      {labelOf(CATEGORIES, item.category)}
                      {item.brand && <> · {item.brand}</>}
                    </p>
                    <p className="font-medium leading-snug">{item.name}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                      <span className="text-sm">{formatPrice(item.price)}</span>
                      <span className="flex items-center gap-2">
                        {item.isAffiliate && <AffiliateBadge />}
                        <ItemLink url={item.url} isAffiliate={item.isAffiliate} className="btn-secondary px-3 py-1.5 text-xs">
                          Voir l&apos;article
                        </ItemLink>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {hasAffiliate && (
              <p className="mt-4 text-xs text-muted">
                Certains liens de cette page sont des liens affiliés : si vous achetez via ces liens,
                Le Vestiaire peut toucher une petite commission, sans aucun surcoût pour vous.{" "}
                <Link href="/liens-affilies" className="underline">En savoir plus</Link>.
              </p>
            )}
            <p className="mt-2 text-xs text-muted">Prix indicatifs relevés à la création de la tenue, susceptibles d&apos;avoir changé.</p>
          </section>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-serif text-3xl">Dans le même style</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {similar.map((o) => <OutfitCard key={o.id} outfit={o} />)}
          </div>
        </section>
      )}
    </article>
  );
}
