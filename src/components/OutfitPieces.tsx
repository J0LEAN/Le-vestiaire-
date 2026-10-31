"use client";
/* eslint-disable @next/next/no-img-element -- images de sites marchands variés */

import { createContext, useContext, useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { AffiliateBadge, itemRel } from "@/components/ItemLink";
import { usePortant } from "@/components/portant/PortantProvider";
import { formatPrice } from "@/lib/format";

export type Piece = {
  id: number;
  name: string;
  category: string; // libellé (ex. « Chaussures »)
  brand: string | null;
  price: number | null;
  imageUrl: string | null;
  url: string;
  isAffiliate: boolean;
};

// État partagé entre la liste des pièces et la barre « Tout acheter » :
// les pièces que la personne possède déjà (non sauvegardé, propre à la page).
type Checklist = { pieces: Piece[]; has: Set<number>; toggle: (id: number) => void; budget: number };
const ChecklistContext = createContext<Checklist | null>(null);
const useChecklist = () => useContext(ChecklistContext)!;

export function ChecklistProvider({ pieces, budget, children }: { pieces: Piece[]; budget: number; children: React.ReactNode }) {
  const [has, setHas] = useState<Set<number>>(new Set());
  const toggle = (id: number) =>
    setHas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return <ChecklistContext.Provider value={{ pieces, has, toggle, budget }}>{children}</ChecklistContext.Provider>;
}

const CONFETTI_COLORS = ["#D11F5A", "#FF9BC4", "#FFB48A", "#B9A0FF", "#E9B949", "#26121F"];

/** Progression « Je l'ai déjà ? » et liste des pièces. */
export function PiecesList() {
  const { pieces, has, toggle } = useChecklist();
  const haveN = pieces.filter((p) => has.has(p.id)).length;
  const left = pieces.length - haveN;
  const complete = left === 0;
  const label = complete
    ? "Tenue complète ! Vous avez tout."
    : haveN === 0
      ? "Vous avez déjà certaines pièces ?"
      : `Plus que ${left} pièce${left > 1 ? "s" : ""} à trouver`;

  return (
    <>
      <div className="glass relative mb-3.5 rounded-[24px] px-[18px] py-4">
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="text-[15px] font-extrabold" aria-live="polite">{label}</span>
          <span className="font-serif text-[22px] text-accent">{haveN}/{pieces.length}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-label="Pièces déjà en votre possession" aria-valuemin={0} aria-valuemax={pieces.length} aria-valuenow={haveN}>
          <div className="lv-progress h-full rounded-full bg-accent" style={{ width: `${Math.round((haveN / pieces.length) * 100)}%` }} />
        </div>
        {complete && (
          <span className="pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                className="lv-confetti"
                style={{ left: `${(4 + i * 5.3).toFixed(1)}%`, background: CONFETTI_COLORS[i % 6], animationDelay: `${(i % 6) * 0.07}s`, width: `${6 + (i % 3) * 2}px` }}
              />
            ))}
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-2.5">
        {pieces.map((p) => {
          const own = has.has(p.id);
          return (
            <li key={p.id} className="lv-card glass flex items-center gap-3 rounded-[26px] py-2 pr-3 pl-2">
              <div className="h-24 w-[84px] flex-none rounded-[20px] bg-mist p-3">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-bold text-ink-muted">
                  {p.category}
                  {p.brand && ` · ${p.brand}`}
                </span>
                <span className="text-[15px] leading-[1.3] font-extrabold">{p.name}</span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {p.price != null && <span className="text-[15px] font-extrabold">{formatPrice(p.price)}</span>}
                  {p.isAffiliate && <AffiliateBadge />}
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-pressed={own}
                  className={`lv-chip mt-1.5 min-h-8 cursor-pointer self-start rounded-full border border-ink/20 px-3 text-xs font-extrabold ${own ? "bg-ink text-on-ink" : "bg-white/70"}`}
                >
                  {own ? "✓ Je l'ai déjà" : "Je l'ai déjà ?"}
                </button>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel={itemRel(p.isAffiliate)}
                aria-label={`Voir l'article : ${p.name}${p.isAffiliate ? " (lien affilié)" : ""}`}
                className="lv-btn flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-on-ink"
              >
                <ArrowUpRightIcon className="h-[18px] w-[18px]" />
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Barre flottante « Tout acheter » : ouvre les pièces qui manquent encore. */
export function BuyBar() {
  const { pieces, has, budget } = useChecklist();
  const { notify } = usePortant();
  const missing = pieces.filter((p) => !has.has(p.id));
  const haveN = pieces.length - missing.length;
  const total = haveN === 0 ? budget : Math.round(missing.reduce((sum, p) => sum + (p.price ?? 0), 0));

  function buyAll() {
    let blocked = 0;
    for (const p of missing) {
      const win = window.open(p.url, "_blank");
      if (win) win.opener = null; // le site ouvert ne peut pas contrôler celui-ci
      else blocked++;
    }
    if (blocked) notify("Onglets bloqués : autorisez les pop-up, ou utilisez les flèches");
  }

  return (
    <div className="lv-bar glass sticky bottom-[max(20px,env(safe-area-inset-bottom,0px))] z-30 mt-10 flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_16px_40px_rgba(70,20,55,0.22)]">
      <span className="flex flex-col">
        <span className="text-xs font-bold text-ink-soft">
          {missing.length === 0 ? "Il ne vous manque rien" : haveN ? "Ce qu'il vous manque" : "Toute la tenue"}
        </span>
        {missing.length > 0 && <span className="font-serif text-2xl leading-none">≈ {formatPrice(total)}</span>}
      </span>
      {missing.length > 0 ? (
        <button type="button" onClick={buyAll} className="lv-btn lv-shine lv-glow btn-primary min-h-14 cursor-pointer px-6 text-base font-extrabold">
          Tout acheter ({missing.length})
        </button>
      ) : (
        <span className="lv-bumpA flex min-h-14 items-center rounded-full bg-ink px-[22px] text-base font-extrabold text-on-ink">Tenue complète ✓</span>
      )}
    </div>
  );
}
