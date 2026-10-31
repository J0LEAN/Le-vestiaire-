import Link from "next/link";
import { HangerIcon } from "@/components/icons";
import { PortantCount } from "@/components/portant/PortantProvider";
import { SITE } from "@/lib/site";

// Messages du bandeau défilant (sans promesse chiffrée)
const TICKER = [
  "Copiez-la en 1 clic",
  "Toutes les pièces, tous les liens",
  "Enregistrez vos favorites sur votre portant",
  "Des conseils de style sans jargon",
  "Des tenues pour chaque occasion",
];

const navLink = "rounded-full px-[18px] py-3 transition-colors hover:bg-white/75";

/** En-tête en verre flottant, suivi du bandeau défilant. */
export function SiteHeader() {
  return (
    <>
      <header className="lv-up glass top-[max(12px,env(safe-area-inset-top,0px))] z-40 md:sticky flex items-center justify-between gap-4 rounded-full py-2.5 pr-2.5 pl-5">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label={`${SITE.name}, accueil`}>
          <HangerIcon className="h-[26px] w-[34px]" strokeWidth={2.2} />
          <span className="font-serif text-[22px] font-medium tracking-[-0.01em] sm:text-[26px]">{SITE.name}</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1.5 text-[15px] font-bold md:flex">
          <Link href="/#tenues" className={navLink}>Tenues</Link>
          <Link href="/collections" className={navLink}>Collections</Link>
          <Link href="/portant" className={`${navLink} inline-flex items-center gap-2`}>
            Mon portant
            <PortantCount />
          </Link>
          {/* L'application n'existe pas encore : simple mention, sans lien */}
          <span className="rounded-full bg-ink px-[22px] py-3 text-on-ink">
            L&apos;app · <span className="font-semibold opacity-80">bientôt</span>
          </span>
        </nav>
      </header>

      <div className="lv-up s1 mt-3.5 overflow-hidden rounded-full bg-ink py-[11px] text-on-ink" aria-hidden="true">
        <div className="lv-marquee text-sm font-extrabold whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex">
              <span className="px-4">{t}</span>
              <span className="text-halo-rose">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
