import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] uppercase sm:text-2xl">
          {SITE.name}
        </Link>
        <nav className="flex gap-5 text-sm">
          <Link href="/#tenues" className="hover:underline underline-offset-4">
            Tenues
          </Link>
          <Link href="/collections" className="hover:underline underline-offset-4">
            Collections
          </Link>
        </nav>
      </div>
    </header>
  );
}
