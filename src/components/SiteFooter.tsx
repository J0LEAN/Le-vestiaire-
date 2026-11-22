import Link from "next/link";
import { HangerIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

const LINKS = [
  ["/collections", "Collections"],
  ["/mentions-legales", "Mentions légales"],
  ["/confidentialite", "Confidentialité"],
  ["/liens-affilies", "Liens affiliés"],
];

/** Encart application (bientôt) et pied de page. */
export function SiteFooter() {
  return (
    <footer className="mt-24">
      <section className="flex flex-wrap gap-6">
        <div className="lv-reveal glass flex min-w-0 flex-[999_1_480px] flex-col justify-center gap-4 rounded-[40px] p-7 sm:p-10">
          <h2 className="font-serif text-[32px] leading-[1.05] sm:text-[40px]">
            Une nouvelle tenue, <em>à copier en un clic.</em>
          </h2>
          <p className="max-w-xl text-base leading-normal text-ink-soft">
            Chaque tenue est composée de vraies pièces, avec le lien pour acheter chacune d&apos;elles et le conseil de style qui explique pourquoi ça marche.
          </p>
        </div>
        <div className="lv-reveal flex flex-[1_1_300px] flex-col justify-between gap-3.5 rounded-[40px] bg-accent p-7 text-on-ink sm:p-10">
          <HangerIcon className="h-[42px] w-14" strokeWidth={2} />
          <h2 className="font-serif text-[34px] leading-[1.05]">Votre portant, dans la poche.</h2>
          <p className="text-base leading-normal">
            L&apos;application du Vestiaire arrive bientôt. En attendant, votre portant est gardé sur ce navigateur.
          </p>
          {/* Pas encore d'application : mentions sans lien */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-on-ink px-[18px] py-3 text-sm font-extrabold text-ink">App Store</span>
            <span className="rounded-full border border-white/40 bg-white/20 px-[18px] py-3 text-sm font-extrabold">Google Play</span>
            <span className="text-sm font-bold">Bientôt disponible</span>
          </div>
        </div>
      </section>

      <div className="lv-reveal mt-16 flex flex-wrap items-end justify-between gap-10">
        <span className="font-serif text-[clamp(56px,10vw,150px)] leading-[0.85] tracking-[-0.04em]" aria-hidden="true">
          {SITE.name}
        </span>
        <nav aria-label="Pied de page" className="flex flex-wrap gap-2 text-sm font-bold">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full bg-white/50 px-3.5 py-2.5 hover:bg-white/80">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-8 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {SITE.name} — {SITE.tagline}
      </p>
    </footer>
  );
}
