"use client";

import { ShareIcon } from "@/components/icons";
import { usePortant } from "@/components/portant/PortantProvider";

/** Partage la page (menu de partage du téléphone, sinon copie du lien). */
export function ShareButton({ title }: { title: string }) {
  const { notify } = usePortant();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // partage annulé : rien à faire
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      notify("Lien de la tenue copié");
    } catch {
      notify("Copiez l'adresse de la page pour la partager");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Partager cette tenue"
      className="lv-btn glass flex h-12 w-12 cursor-pointer items-center justify-center rounded-full"
    >
      <ShareIcon />
    </button>
  );
}
