"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HangerIcon, HomeIcon } from "@/components/icons";
import { PortantCount } from "@/components/portant/PortantProvider";

const TABS = [
  { href: "/", label: "Accueil", icon: <HomeIcon className="h-5 w-5" /> },
  { href: "/collections", label: "Collections", icon: <GridIcon className="h-5 w-5" /> },
  { href: "/portant", label: "Mon portant", icon: <HangerIcon className="h-[18px] w-6" strokeWidth={2.2} /> },
];

/** Barre d'onglets en bas de l'écran, sur téléphone uniquement. */
export function MobileTabBar() {
  const pathname = usePathname();
  // Sur une page tenue, la barre « Tout acheter » prend sa place.
  if (pathname.startsWith("/tenues/")) return null;

  return (
    <nav
      aria-label="Navigation"
      className="glass fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom,0px))] z-40 flex justify-between rounded-full p-1.5 md:hidden"
    >
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full text-xs font-extrabold ${active ? "bg-ink text-on-ink" : "text-ink"}`}
          >
            {t.icon}
            {t.label}
            {t.href === "/portant" && <PortantCount className="absolute top-0.5 right-[18%] h-5 min-w-5 text-[11px]" />}
          </Link>
        );
      })}
    </nav>
  );
}
