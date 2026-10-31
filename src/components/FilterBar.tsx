"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersIcon } from "@/components/icons";
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

// Correspondance entre les filtres et les paramètres de l'adresse (?occasion=…&saison=…)
const URL_KEYS: Record<keyof Filters, string> = { style: "style", occasion: "occasion", season: "saison", budget: "budget" };

/**
 * Filtres : les occasions en pilules, et un panneau « Style · Saison · Budget ».
 * Chaque choix met à jour l'adresse de la page (la liste est filtrée côté serveur).
 */
export function FilterBar({ basePath, current, hideStyle, anchor = "" }: Props) {
  const router = useRouter();
  const more: { key: keyof Filters; label: string; options: Option[] }[] = [
    ...(hideStyle ? [] : [{ key: "style" as const, label: "Style", options: STYLES }]),
    { key: "season", label: "Saison", options: SEASONS.filter((s) => s.value !== "toutes") },
    { key: "budget", label: "Budget", options: BUDGETS },
  ];
  const moreActive = more.filter((f) => current[f.key]).length;
  const [open, setOpen] = useState(moreActive > 0);

  /** Adresse de la page avec un filtre modifié. */
  function hrefWith(key: keyof Filters, value: string | undefined) {
    const params = new URLSearchParams();
    for (const k of Object.keys(URL_KEYS) as (keyof Filters)[]) {
      if (hideStyle && k === "style") continue;
      const v = k === key ? value : current[k];
      if (v) params.set(URL_KEYS[k], v);
    }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}${anchor}`;
  }

  const chip = (on: boolean) =>
    `lv-chip flex min-h-11 shrink-0 items-center rounded-full px-[18px] text-[15px] font-bold whitespace-nowrap ${on ? "bg-ink text-on-ink" : "hover:bg-white/70"}`;

  return (
    <div className="lv-reveal mt-5 mb-9">
      <div className="glass flex flex-col gap-1.5 rounded-[28px] p-2 md:flex-row md:items-center md:rounded-full">
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 md:flex-wrap" role="group" aria-label="Filtrer par occasion">
          <Link href={hrefWith("occasion", undefined)} scroll={false} aria-current={!current.occasion ? "true" : undefined} className={chip(!current.occasion)}>
            Toutes
          </Link>
          {OCCASIONS.map((o) => (
            <Link
              key={o.value}
              href={hrefWith("occasion", o.value)}
              scroll={false}
              aria-current={current.occasion === o.value ? "true" : undefined}
              className={chip(current.occasion === o.value)}
            >
              {o.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="filtres-plus"
          className="lv-chip flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/60 px-[18px] text-[15px] font-bold md:ml-auto"
        >
          <SlidersIcon className="h-[18px] w-[18px]" />
          {more.map((f) => f.label).join(" · ")}
          {moreActive > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-extrabold text-on-ink">
              {moreActive}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div id="filtres-plus" className="glass mt-3 flex flex-wrap items-end gap-3 rounded-[28px] p-4">
          {more.map((f) => (
            <label key={f.key} className="block min-w-40 flex-1 md:max-w-56">
              <span className="mb-1 block text-[13px] font-bold text-ink-muted">{f.label}</span>
              <select
                className="field min-h-11 cursor-pointer rounded-full"
                value={current[f.key] ?? ""}
                onChange={(e) => router.push(hrefWith(f.key, e.target.value || undefined), { scroll: false })}
              >
                <option value="">Tous</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          ))}
          {(moreActive > 0 || current.occasion) && (
            <Link href={`${basePath}${anchor}`} scroll={false} className="flex min-h-11 items-center px-2 text-sm font-bold underline underline-offset-4">
              Effacer les filtres
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
