import Link from "next/link";
import { deleteOutfit, setOutfitStatus, toggleFeatured } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice } from "@/components/admin/Notice";
import { OutfitVisual } from "@/components/OutfitVisual";
import { OCCASIONS, STYLES, labelOf } from "@/lib/constants";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

const TABS = [
  ["", "Toutes"],
  ["brouillon", "Brouillons"],
  ["publiee", "Publiées"],
];

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const status = typeof sp.statut === "string" ? sp.statut : "";
  const ok = typeof sp.ok === "string" ? sp.ok : null;

  const outfits = await db.outfit.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      {ok && <Notice>{ok}</Notice>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl">Tenues ({outfits.length})</h1>
        <nav className="flex gap-2 text-sm">
          {TABS.map(([value, label]) => (
            <Link
              key={value}
              href={value ? `/admin?statut=${value}` : "/admin"}
              className={`border px-3 py-1 ${status === value ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {outfits.length === 0 && (
        <p className="mt-8 border border-line bg-paper p-8 text-center text-sm">
          Aucune tenue ici. <Link href="/admin/tenues/nouvelle" className="underline">Créer une tenue</Link> ou{" "}
          <Link href="/admin/import" className="underline">importer un fichier</Link>.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {outfits.map((o) => {
          const broken = o.items.filter((i) => i.linkStatus === "casse" || i.linkStatus === "erreur").length;
          const published = o.status === "publiee";
          return (
            <li key={o.id} id={`tenue-${o.id}`} className="flex flex-col gap-4 border border-line bg-paper p-4 sm:flex-row">
              <div className="w-24 shrink-0">
                <OutfitVisual outfit={o} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs ${published ? "bg-ink text-paper" : "border border-ink"}`}>
                    {published ? "Publiée" : "Brouillon"}
                  </span>
                  {o.featured && <span className="border border-ink px-2 py-0.5 text-xs">★ À la une</span>}
                  {broken > 0 && (
                    <Link href="/admin/liens" className="border border-danger px-2 py-0.5 text-xs text-danger">
                      {broken} lien{broken > 1 ? "s" : ""} à corriger
                    </Link>
                  )}
                </div>
                <h2 className="mt-2 font-serif text-xl">{o.title}</h2>
                <p className="text-xs text-muted">
                  {labelOf(STYLES, o.style)} · {labelOf(OCCASIONS, o.occasion)} · {o.items.length} articles · créée le{" "}
                  {formatDate(o.createdAt)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link href={`/admin/tenues/${o.id}`} className="btn-primary px-3 py-1.5">Modifier</Link>
                  <form action={setOutfitStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value={published ? "brouillon" : "publiee"} />
                    <button type="submit" className="btn-secondary px-3 py-1.5">{published ? "Dépublier" : "Publier"}</button>
                  </form>
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={o.id} />
                    <button type="submit" className="btn-secondary px-3 py-1.5">{o.featured ? "Retirer de la une" : "Mettre à la une"}</button>
                  </form>
                  {published && (
                    <Link href={`/tenues/${o.slug}`} target="_blank" className="btn-secondary px-3 py-1.5">Voir ↗</Link>
                  )}
                  <form action={deleteOutfit}>
                    <input type="hidden" name="id" value={o.id} />
                    <ConfirmButton
                      message={`Supprimer définitivement « ${o.title} » et ses articles ?`}
                      className="btn px-3 py-1.5 border-danger text-danger hover:bg-danger hover:text-paper"
                    >
                      Supprimer
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
