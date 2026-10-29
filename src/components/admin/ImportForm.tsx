"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { confirmImport, previewImport, type PreviewResult } from "@/actions/import";
import { CATEGORIES, OCCASIONS, SEASONS, STYLES, labelOf } from "@/lib/constants";
import { formatPrice, outfitBudget } from "@/lib/format";

export function ImportForm() {
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [done, setDone] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  // 1) Lecture du fichier choisi, puis aperçu automatique
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreview(null);
    setDone(null);
    if (!f) return setFile(null);
    const text = await f.text();
    setFile({ name: f.name, text });
    startTransition(async () => setPreview(await previewImport(text, f.name)));
  }

  // 2) Validation de l'import
  function onConfirm() {
    if (!file) return;
    startTransition(async () => {
      setDone(await confirmImport(file.text, file.name));
      setPreview(null);
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <label className="block border-2 border-dashed border-ink bg-paper p-8 text-center">
        <span className="block font-medium">Choisir un fichier .json ou .csv</span>
        <span className="mt-1 block text-xs text-muted">{file ? `Fichier : ${file.name}` : "Cliquez ici pour parcourir"}</span>
        <input type="file" accept=".json,.csv,application/json,text/csv" onChange={onFile} className="sr-only" />
      </label>

      {pending && <p className="text-sm">Analyse en cours…</p>}

      {done && (
        <div className={`border-l-4 bg-paper p-4 text-sm ${done.ok ? "border-success" : "border-danger text-danger"}`}>
          {done.message}{" "}
          {done.ok && <Link href="/admin?statut=brouillon" className="underline">Voir les brouillons →</Link>}
        </div>
      )}

      {preview && !preview.ok && (
        <div className="border-l-4 border-danger bg-paper p-4 text-sm" role="alert">
          <p className="font-semibold text-danger">Le fichier ne peut pas être importé. Voici ce qu&apos;il faut corriger :</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {preview.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          <p className="mt-3 text-muted">Corrigez le fichier, puis choisissez-le à nouveau. Rien n&apos;a été enregistré.</p>
        </div>
      )}

      {preview?.ok && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-ink bg-paper p-4">
            <p className="text-sm">
              <strong>{preview.outfits.length} tenue{preview.outfits.length > 1 ? "s" : ""}</strong> et{" "}
              {preview.outfits.reduce((n, o) => n + o.items.length, 0)} articles prêts à être importés.
            </p>
            <button type="button" onClick={onConfirm} disabled={pending} className="btn-primary">
              Importer en brouillon
            </button>
          </div>
          {preview.duplicates.length > 0 && (
            <p className="border-l-4 border-danger bg-paper p-4 text-sm">
              Attention : {preview.duplicates.length} titre(s) existent déjà sur le site ({preview.duplicates.join(", ")}).
              Ils seront importés en double si vous continuez.
            </p>
          )}
          {preview.outfits.map((o, i) => (
            <details key={i} className="border border-line bg-paper p-4" open={i === 0}>
              <summary className="cursor-pointer">
                <span className="font-serif text-lg">{o.title}</span>{" "}
                <span className="text-xs text-muted">
                  {labelOf(STYLES, o.style)} · {labelOf(OCCASIONS, o.occasion)} · {labelOf(SEASONS, o.season)} ·{" "}
                  {o.items.length} articles · env. {formatPrice(outfitBudget(o))}
                  {o.featured && " · ★ à la une"}
                </span>
              </summary>
              <p className="mt-3 text-sm">{o.description}</p>
              <p className="mt-2 text-sm italic">{o.whyItWorks}</p>
              <table className="mt-3 w-full text-left text-xs">
                <thead className="text-muted">
                  <tr><th className="py-1">Article</th><th>Catégorie</th><th>Marque</th><th>Prix</th><th>Lien</th></tr>
                </thead>
                <tbody>
                  {o.items.map((it, j) => (
                    <tr key={j} className="border-t border-line">
                      <td className="py-1 pr-2">{it.name}</td>
                      <td className="pr-2">{labelOf(CATEGORIES, it.category)}</td>
                      <td className="pr-2">{it.brand}</td>
                      <td className="pr-2">{formatPrice(it.price)}</td>
                      <td className="max-w-48 truncate">
                        {it.isAffiliate && "(affilié) "}
                        {it.url}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
