import { absoluteUrl } from "@/lib/site";

/** Bouton "Enregistrer sur Pinterest" (simple lien, sans script externe). */
export function PinterestButton({ slug, title }: { slug: string; title: string }) {
  const href =
    "https://www.pinterest.com/pin/create/button/?" +
    new URLSearchParams({
      url: absoluteUrl(`/tenues/${slug}`),
      media: absoluteUrl(`/visuels/${slug}`),
      description: `${title} — tenue complète à copier`,
    }).toString();

  return (
    <a href={href} target="_blank" rel="noopener" className="btn-secondary w-full">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.5-4.4-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1-1 2.2-1.4 3 1 .3 2.1.5 3.2.5 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
      Enregistrer sur Pinterest
    </a>
  );
}
