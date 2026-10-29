"use client";

import { useMemo, useState, useTransition } from "react";
import { updateLinks } from "@/actions/links";

type Row = {
  id: number;
  name: string;
  brand: string | null;
  outfitTitle: string;
  url: string;
  isAffiliate: boolean;
  linkStatus: string;
};

export function AffiliateTable({ rows }: { rows: Row[] }) {
  // Modifications en cours, par identifiant d'article
  const [edits, setEdits] = useState<Record<number, { url: string; isAffiliate: boolean }>>({});
  const [search, setSearch] = useState("");
  const [onlyNonAffiliate, setOnlyNonAffiliate] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const value = (r: Row) => edits[r.id] ?? { url: r.url, isAffiliate: r.isAffiliate };
  const changed = rows.filter((r) => edits[r.id] && (edits[r.id].url !== r.url || edits[r.id].isAffiliate !== r.isAffiliate));

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        (!onlyNonAffiliate || !r.isAffiliate) &&
        (!q || `${r.name} ${r.brand ?? ""} ${r.outfitTitle} ${r.url}`.toLowerCase().includes(q)),
    );
  }, [rows, search, onlyNonAffiliate]);

  function edit(r: Row, patch: Partial<{ url: string; isAffiliate: boolean }>) {
    setEdits((e) => ({ ...e, [r.id]: { ...value(r), ...patch } }));
  }

  function save() {
    startTransition(async () => {
      const res = await updateLinks(changed.map((r) => ({ id: r.id, ...edits[r.id] })));
      setMessage(res);
      if (res.ok) setEdits({});
    });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <input className="field max-w-xs" placeholder="Rechercher (article, marque, tenue…)" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyNonAffiliate} onChange={(e) => setOnlyNonAffiliate(e.target.checked)} />
          Seulement les liens non affiliés
        </label>
      </div>

      {message && (
        <p className={`mt-4 border-l-4 bg-paper p-3 text-sm ${message.ok ? "border-success" : "border-danger text-danger"}`}>{message.message}</p>
      )}

      <div className="mt-4 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="p-3">Article</th>
              <th className="p-3">Lien</th>
              <th className="p-3 text-center">Affilié</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const v = value(r);
              const isChanged = v.url !== r.url || v.isAffiliate !== r.isAffiliate;
              return (
                <tr key={r.id} className={`border-b border-line align-top ${isChanged ? "bg-yellow-50" : ""}`}>
                  <td className="w-1/3 p-3">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted">
                      {r.brand && `${r.brand} · `}
                      {r.outfitTitle}
                      {r.linkStatus === "casse" && <span className="ml-1 text-danger">· lien cassé</span>}
                    </p>
                  </td>
                  <td className="p-3">
                    <input className="field" value={v.url} onChange={(e) => edit(r, { url: e.target.value })} aria-label={`Lien de ${r.name}`} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={v.isAffiliate} onChange={(e) => edit(r, { isAffiliate: e.target.checked })} aria-label={`${r.name} : lien affilié`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 mt-4 flex items-center gap-4 border-t border-line bg-mist py-4">
        <button type="button" onClick={save} disabled={pending || changed.length === 0} className="btn-primary">
          {pending ? "Enregistrement…" : `Enregistrer ${changed.length} modification${changed.length > 1 ? "s" : ""}`}
        </button>
        {changed.length > 0 && (
          <button type="button" onClick={() => setEdits({})} className="text-sm underline">Annuler les modifications</button>
        )}
      </div>
    </div>
  );
}
