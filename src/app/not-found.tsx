import Link from "next/link";
import { BigHanger } from "@/components/icons";
import { SiteShell } from "@/components/SiteShell";

// Page affichée pour toute adresse inconnue ou tenue introuvable.
export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="rail w-56" aria-hidden="true" />
        <BigHanger className="lv-swing -mt-2.5 block h-[54px] w-[140px] text-ink" />
        <p className="pill mt-8">Erreur 404</p>
        <h1 className="mt-4 font-serif text-5xl leading-none">
          Ce cintre est <em>vide</em>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          La tenue a peut-être été retirée, ou l&apos;adresse contient une faute de frappe.
        </p>
        <Link href="/" className="lv-btn btn-primary mt-8">Voir toutes les tenues</Link>
      </div>
    </SiteShell>
  );
}
