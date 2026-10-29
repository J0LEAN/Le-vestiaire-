"use client";

import { useState } from "react";

type Props = { links: { name: string; url: string }[] };

/**
 * Ouvre le lien de chaque article dans un nouvel onglet.
 * Les navigateurs bloquent parfois l'ouverture de plusieurs onglets d'un coup :
 * on le détecte et on explique quoi faire.
 */
export function BuyAllButton({ links }: Props) {
  const [blocked, setBlocked] = useState(false);

  function openAll() {
    let failures = 0;
    for (const link of links) {
      const win = window.open(link.url, "_blank");
      if (win) win.opener = null; // sécurité : le site ouvert ne peut pas contrôler celui-ci
      else failures++;
    }
    setBlocked(failures > 0);
  }

  return (
    <div>
      <button type="button" onClick={openAll} className="btn-primary w-full">
        Acheter toute la tenue ({links.length} pièces)
      </button>
      {blocked && (
        <p className="mt-3 border border-ink bg-mist p-3 text-sm" role="alert">
          Votre navigateur a bloqué l&apos;ouverture de certains onglets. Autorisez les fenêtres pop-up pour ce site
          (icône dans la barre d&apos;adresse), ou utilisez les boutons « Voir l&apos;article » ci-dessous.
        </p>
      )}
    </div>
  );
}
