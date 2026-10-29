import Link from "next/link";
import { CheckLinksButton } from "@/components/admin/CheckLinksButton";
import { db } from "@/lib/db";

const STATUS = {
  casse: { label: "Cassé", className: "bg-danger text-paper" },
  erreur: { label: "À vérifier", className: "border border-danger text-danger" },
} as const;

export default async function LinksPage() {
  const items = await db.item.findMany({ include: { outfit: { select: { id: true, title: true } } }, orderBy: { outfitId: "asc" } });
  const problems = items.filter((i) => i.linkStatus === "casse" || i.linkStatus === "erreur");
  const count = (s: string) => items.filter((i) => i.linkStatus === s).length;
  const lastCheck = items.reduce<Date | null>((d, i) => (i.linkCheckedAt && (!d || i.linkCheckedAt > d) ? i.linkCheckedAt : d), null);

  return (
    <div>
      <h1 className="font-serif text-3xl">Vérifier les liens</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le site visite chaque lien d&apos;article. « Cassé » : la page n&apos;existe plus, il faut remplacer le lien.
        « À vérifier » : le site marchand a bloqué la vérification automatique (fréquent chez les grandes enseignes) ;
        cliquez sur le lien pour vérifier vous-même.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Liens", items.length],
          ["OK", count("ok")],
          ["Cassés", count("casse")],
          ["À vérifier", count("erreur")],
        ].map(([label, n]) => (
          <div key={label} className="border border-line bg-paper p-4">
            <p className="text-2xl font-semibold">{n}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        {lastCheck ? `Dernière vérification : ${lastCheck.toLocaleString("fr-FR")}` : "Aucune vérification pour le moment."}
        {count("inconnu") > 0 && ` · ${count("inconnu")} lien(s) jamais vérifié(s).`}
      </p>

      <div className="mt-6">
        <CheckLinksButton total={items.length} />
      </div>

      <h2 className="mt-10 font-serif text-2xl">Liens à corriger ({problems.length})</h2>
      {problems.length === 0 ? (
        <p className="mt-4 border border-line bg-paper p-6 text-sm">Aucun problème détecté. 🎉</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {problems.map((i) => {
            const s = STATUS[i.linkStatus as keyof typeof STATUS];
            return (
              <li key={i.id} className="border border-line bg-paper p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs ${s.className}`}>{s.label}</span>
                  <strong>{i.name}</strong>
                  <span className="text-muted">dans « {i.outfit.title} »</span>
                </div>
                <p className="mt-1 text-muted">{i.linkError}</p>
                <p className="mt-1 break-all">
                  <a href={i.url} target="_blank" rel="noopener noreferrer" className="underline">{i.url}</a>
                </p>
                <div className="mt-2 flex gap-3">
                  <Link href={`/admin/tenues/${i.outfit.id}`} className="underline">Modifier la tenue</Link>
                  <Link href="/admin/affiliation" className="underline">Remplacer dans le tableau des liens</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
