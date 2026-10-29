import Link from "next/link";
import { STYLES } from "@/lib/constants";
import { SITE } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <p className="font-serif text-2xl">La newsletter</p>
          <p className="mt-2 text-sm text-muted">Les nouvelles tenues dans votre boîte mail, une fois par semaine au plus.</p>
          <NewsletterForm />
        </div>
        <div>
          <p className="eyebrow">Collections</p>
          <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            {STYLES.map((s) => (
              <li key={s.value}>
                <Link href={`/collections/${s.value}`} className="hover:underline underline-offset-4">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Informations</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/mentions-legales" className="hover:underline underline-offset-4">Mentions légales</Link></li>
            <li><Link href="/confidentialite" className="hover:underline underline-offset-4">Politique de confidentialité</Link></li>
            <li><Link href="/liens-affilies" className="hover:underline underline-offset-4">Liens affiliés</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.name} — {SITE.tagline}
      </p>
    </footer>
  );
}
