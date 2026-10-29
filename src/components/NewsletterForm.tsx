"use client";

import { useActionState } from "react";
import Link from "next/link";
import { subscribe } from "@/actions/newsletter";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);

  if (state?.ok) return <p className="mt-4 text-sm">{state.message}</p>;

  return (
    <form action={action} className="mt-4">
      <div className="flex">
        <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="votre@email.fr"
          className="field min-w-0 flex-1 border-ink"
        />
        {/* Piège à robots, invisible pour les humains */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={pending} className="btn-primary py-2">
          {pending ? "…" : "S'inscrire"}
        </button>
      </div>
      {state && !state.ok && <p className="mt-2 text-sm text-danger">{state.message}</p>}
      <p className="mt-2 text-xs text-muted">
        Désinscription possible à tout moment. Voir la{" "}
        <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
      </p>
    </form>
  );
}
