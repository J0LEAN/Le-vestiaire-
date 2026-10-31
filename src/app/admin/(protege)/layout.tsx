import Link from "next/link";
import { logout } from "@/actions/admin";
import { requireAdmin } from "@/lib/auth";

const NAV = [
  ["/admin", "Tenues"],
  ["/admin/tenues/nouvelle", "+ Nouvelle tenue"],
  ["/admin/import", "Import en lot"],
  ["/admin/liens", "Vérifier les liens"],
  ["/admin/images", "Images"],
  ["/admin/affiliation", "Liens affiliés"],
  ["/admin/newsletter", "Newsletter"],
];

// Toutes les pages de ce dossier sont réservées à l'admin connecté.
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
          <Link href="/admin" className="font-serif text-lg tracking-widest uppercase">Admin</Link>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="hover:underline underline-offset-4">{label}</Link>
          ))}
          <span className="ml-auto flex gap-4">
            <Link href="/" target="_blank" className="text-muted hover:underline">Voir le site ↗</Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:underline">Déconnexion</button>
            </form>
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
