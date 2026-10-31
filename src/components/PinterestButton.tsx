import { PinIcon } from "@/components/icons";
import { absoluteUrl } from "@/lib/site";

/** Adresse de partage Pinterest d'une tenue (simple lien, sans script externe). */
function pinterestUrl(slug: string, title: string) {
  return (
    "https://www.pinterest.com/pin/create/button/?" +
    new URLSearchParams({
      url: absoluteUrl(`/tenues/${slug}`),
      media: absoluteUrl(`/visuels/${slug}`),
      description: `${title} — tenue complète à copier`,
    }).toString()
  );
}

/** Bouton « Enregistrer sur Pinterest » : en pilule, ou rond (icône seule) sur les cartes. */
export function PinterestButton({ slug, title, round }: { slug: string; title: string; round?: boolean }) {
  if (round) {
    return (
      <a
        href={pinterestUrl(slug, title)}
        target="_blank"
        rel="noopener"
        aria-label={`Enregistrer sur Pinterest : ${title}`}
        className="lv-btn flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/90 bg-white/65 text-ink backdrop-blur-md"
      >
        <PinIcon className="h-[18px] w-[18px]" />
      </a>
    );
  }
  return (
    <a
      href={pinterestUrl(slug, title)}
      target="_blank"
      rel="noopener"
      className="lv-btn inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-ink/20 bg-white/55 px-4 text-sm font-bold"
    >
      <PinIcon className="h-4 w-4" />
      Enregistrer sur Pinterest
    </a>
  );
}
