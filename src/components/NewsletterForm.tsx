"use client";

import { useActionState } from "react";
import Link from "next/link";
import { subscribe } from "@/actions/newsletter";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);

  if (state?.ok) return <p className="text-lg font-bold">{state.message}</p>;

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="newsletter-email" className="text-[15px] font-bold">Votre adresse e-mail</label>
      <div className="flex flex-wrap gap-2 rounded-[28px] border border-line bg-white/75 p-1.5">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="vous@exemple.fr"
          className="min-h-12 min-w-0 flex-[1_1_200px] rounded-full bg-transparent px-4 text-base outline-offset-2"
        />
        {/* Piège à robots, invisible pour les humains */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={pending} className="lv-btn lv-shine btn-primary min-h-12 flex-[1_0_auto] text-[15px] sm:flex-none font-extrabold">
          {pending ? "…" : "Je m'inscris"}
        </button>
      </div>
      {state && !state.ok && <p className="text-sm font-bold text-danger">{state.message}</p>}
      <p className="text-sm text-ink-soft">
        Une fois par semaine au plus. Désinscription en un clic —{" "}
        <Link href="/confidentialite" className="underline">confidentialité</Link>.
      </p>
    </form>
  );
}
