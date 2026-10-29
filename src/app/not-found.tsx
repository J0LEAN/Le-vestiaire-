import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

// Page affichée pour toute adresse inconnue ou tenue introuvable.

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl flex-1 px-4 py-24 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-3 font-serif text-4xl">Cette page n&apos;existe pas</h1>
      <p className="mt-4 text-muted">La tenue a peut-être été retirée, ou l&apos;adresse contient une faute de frappe.</p>
      <Link href="/" className="btn-primary mt-8">Voir toutes les tenues</Link>
      </main>
      <SiteFooter />
    </>
  );
}
