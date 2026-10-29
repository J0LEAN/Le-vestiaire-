"use client";

import { useRouter } from "next/navigation";
import { BUDGETS, OCCASIONS, SEASONS, STYLES, type Option } from "@/lib/constants";
import type { Filters } from "@/lib/queries";

type Props = {
  /** Adresse de la page (ex. "/" ou "/collections/chic"). */
  basePath: string;
  current: Filters;
  /** Masque le filtre de style (déjà fixé sur une page collection). */
  hideStyle?: boolean;
  /** Ancre vers laquelle revenir après filtrage. */
  anchor?: string;
};

/** Barre de filtres : chaque changement met à jour l'adresse de la page. */
export function FilterBar({ basePath, current, hideStyle, anchor = "" }: Props) {
  const router = useRouter();

  const fields: { key: string; urlKey: string; label: string; options: Option[] }[] = [
    ...(hideStyle ? [] : [{ key: "style", urlKey: "style", label: "Style", options: STYLES }]),
    { key: "occasion", urlKey: "occasion", label: "Occasion", options: OCCASIONS },
    { key: "season", urlKey: "saison", label: "Saison", options: SEASONS.filter((s) => s.value !== "toutes") },
    { key: "budget", urlKey: "budget", label: "Budget", options: BUDGETS },
  ];

  function update(urlKey: string, value: string) {
    const params = new URLSearchParams();
    for (const f of fields) {
      const v = f.urlKey === urlKey ? value : current[f.key as keyof Filters];
      if (v) params.set(f.urlKey, v);
    }
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}${anchor}`, { scroll: false });
  }

  const active = fields.some((f) => current[f.key as keyof Filters]);

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 md:flex md:items-end">
      {fields.map((f) => (
        <label key={f.key} className="block md:w-44">
          <span className="eyebrow mb-1 block text-muted">{f.label}</span>
          <select
            className="field cursor-pointer"
            value={current[f.key as keyof Filters] ?? ""}
            onChange={(e) => update(f.urlKey, e.target.value)}
          >
            <option value="">Tous</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {active && (
        <button
          type="button"
          onClick={() => router.push(`${basePath}${anchor}`, { scroll: false })}
          className="col-span-2 text-left text-sm underline underline-offset-4 md:ml-2 md:pb-2"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}
