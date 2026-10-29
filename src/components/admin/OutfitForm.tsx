"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveOutfit } from "@/actions/admin";
import { CATEGORIES, OCCASIONS, SEASONS, STYLES, type Option } from "@/lib/constants";

// Données d'un article dans le formulaire (mêmes noms que le format d'import).
type ItemDraft = {
  id?: number;
  nom: string;
  categorie: string;
  marque: string;
  prix: string;
  image: string;
  lien: string;
  affilie: boolean;
};

export type OutfitDraft = {
  id?: number;
  titre: string;
  description: string;
  pourquoi_ca_marche: string;
  style: string;
  occasion: string;
  saison: string;
  budget: string;
  image: string;
  a_la_une: boolean;
  status: string;
  articles: ItemDraft[];
};

const emptyItem = (): ItemDraft => ({ nom: "", categorie: "haut", marque: "", prix: "", image: "", lien: "", affilie: false });

const emptyOutfit = (): OutfitDraft => ({
  titre: "",
  description: "",
  pourquoi_ca_marche: "",
  style: STYLES[0].value,
  occasion: OCCASIONS[0].value,
  saison: SEASONS[0].value,
  budget: "",
  image: "",
  a_la_une: false,
  status: "brouillon",
  articles: [emptyItem()],
});

/** Formulaire de tenue : vide pour une création, pré-rempli (`initial`) pour une modification. */
export function OutfitForm({ initial }: { initial?: OutfitDraft }) {
  const [draft, setDraft] = useState(() => initial ?? emptyOutfit());
  const [state, action, pending] = useActionState(saveOutfit, null);

  const set = (patch: Partial<OutfitDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setItem = (index: number, patch: Partial<ItemDraft>) =>
    setDraft((d) => ({ ...d, articles: d.articles.map((it, i) => (i === index ? { ...it, ...patch } : it)) }));
  const moveItem = (index: number, delta: number) =>
    setDraft((d) => {
      const list = [...d.articles];
      const target = index + delta;
      if (target < 0 || target >= list.length) return d;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...d, articles: list };
    });

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="id" value={draft.id ?? ""} />
      <input type="hidden" name="data" value={JSON.stringify(draft)} />

      {state?.errors && (
        <div className="border-l-4 border-danger bg-paper p-4 text-sm text-danger" role="alert">
          <p className="font-semibold">La tenue n&apos;a pas été enregistrée :</p>
          <ul className="mt-2 list-disc pl-5">
            {state.errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <fieldset className="space-y-4 border border-line bg-paper p-5">
        <legend className="px-1 font-serif text-xl">La tenue</legend>
        <Field label="Titre *">
          <input className="field" value={draft.titre} onChange={(e) => set({ titre: e.target.value })} required />
        </Field>
        <Field label="Description *" hint="2 ou 3 phrases pour donner envie.">
          <textarea className="field" rows={3} value={draft.description} onChange={(e) => set({ description: e.target.value })} required />
        </Field>
        <Field label="Pourquoi ça marche *" hint="Le conseil de style : pourquoi ces pièces vont bien ensemble.">
          <textarea className="field" rows={4} value={draft.pourquoi_ca_marche} onChange={(e) => set({ pourquoi_ca_marche: e.target.value })} required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Style *" value={draft.style} options={STYLES} onChange={(v) => set({ style: v })} />
          <Select label="Occasion *" value={draft.occasion} options={OCCASIONS} onChange={(v) => set({ occasion: v })} />
          <Select label="Saison *" value={draft.saison} options={SEASONS} onChange={(v) => set({ saison: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget indicatif (€)" hint="Laisser vide pour additionner les prix des articles.">
            <input className="field" inputMode="numeric" value={draft.budget} onChange={(e) => set({ budget: e.target.value })} />
          </Field>
          <Field label="Image principale (adresse)" hint="Facultatif : sinon un collage des articles est créé.">
            <input className="field" placeholder="https://…" value={draft.image} onChange={(e) => set({ image: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.a_la_une} onChange={(e) => set({ a_la_une: e.target.checked })} />
          Mettre cette tenue à la une sur l&apos;accueil
        </label>
      </fieldset>

      <fieldset className="space-y-4 border border-line bg-paper p-5">
        <legend className="px-1 font-serif text-xl">Les articles ({draft.articles.length})</legend>
        {draft.articles.map((item, i) => (
          <div key={i} className="border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Article {i + 1}</p>
              <div className="flex gap-1 text-xs">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="border border-line px-2 py-1 disabled:opacity-30" aria-label="Monter">↑</button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === draft.articles.length - 1} className="border border-line px-2 py-1 disabled:opacity-30" aria-label="Descendre">↓</button>
                <button
                  type="button"
                  onClick={() => set({ articles: draft.articles.filter((_, j) => j !== i) })}
                  className="border border-danger px-2 py-1 text-danger"
                >
                  Retirer
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nom *"><input className="field" value={item.nom} onChange={(e) => setItem(i, { nom: e.target.value })} /></Field>
              <Select label="Catégorie *" value={item.categorie} options={CATEGORIES} onChange={(v) => setItem(i, { categorie: v })} />
              <Field label="Marque"><input className="field" value={item.marque} onChange={(e) => setItem(i, { marque: e.target.value })} /></Field>
              <Field label="Prix (€)"><input className="field" inputMode="decimal" value={item.prix} onChange={(e) => setItem(i, { prix: e.target.value })} /></Field>
              <Field label="Lien d'achat *"><input className="field" placeholder="https://…" value={item.lien} onChange={(e) => setItem(i, { lien: e.target.value })} /></Field>
              <Field label="Image (adresse)"><input className="field" placeholder="https://…" value={item.image} onChange={(e) => setItem(i, { image: e.target.value })} /></Field>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={item.affilie} onChange={(e) => setItem(i, { affilie: e.target.checked })} />
              C&apos;est un lien affilié
            </label>
          </div>
        ))}
        <button type="button" onClick={() => set({ articles: [...draft.articles, emptyItem()] })} className="btn-secondary">
          + Ajouter un article
        </button>
      </fieldset>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-mist py-4">
        <button type="submit" disabled={pending} name="status" value="brouillon" className="btn-secondary">
          Enregistrer en brouillon
        </button>
        <button type="submit" disabled={pending} name="status" value="publiee" className="btn-primary">
          Enregistrer et publier
        </button>
        <Link href="/admin" className="text-sm underline">Annuler</Link>
        {pending && <span className="text-sm text-muted">Enregistrement…</span>}
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Option[]; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}
