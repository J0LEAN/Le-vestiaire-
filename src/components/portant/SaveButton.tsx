"use client";

import { HangerIcon } from "@/components/icons";
import { usePortant } from "./PortantProvider";

// 12 particules en couronne pour l'« explosion » à l'ajout
const COLORS = ["#D11F5A", "#FF9BC4", "#FFB48A", "#B9A0FF", "#E9B949"];
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const r = 36 + (i % 3) * 10;
  const a = (i * 30 * Math.PI) / 180;
  return { dx: `${Math.round(Math.cos(a) * r)}px`, dy: `${Math.round(Math.sin(a) * r)}px`, color: COLORS[i % 5], size: `${6 + (i % 3) * 2}px` };
});

type Props = {
  slug: string;
  title: string;
  /** "card" : petit bouton rond en verre ; "hero" : bouton cerise de la page tenue. */
  variant?: "card" | "hero";
};

/** Bouton cintre « Ajouter à mon portant » (bascule). */
export function SaveButton({ slug, title, variant = "card" }: Props) {
  const { isSaved, toggle, last, tick } = usePortant();
  const on = isSaved(slug);
  const burst = on && last === slug ? `lv-burst${tick % 2 ? "B" : "A"}` : "";

  const look =
    variant === "hero"
      ? `h-12 w-12 shadow-[0_8px_18px_rgba(209,31,90,0.3)] text-on-ink ${on ? "bg-ink lv-btn" : "bg-accent lv-pop"}`
      : `h-[46px] w-[46px] border border-white/90 backdrop-blur-md lv-btn ${on ? "bg-accent text-on-ink" : "bg-white/70 text-ink"}`;

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? `Retirer de mon portant : ${title}` : `Ajouter à mon portant : ${title}`}
      className={`lv-save relative flex shrink-0 cursor-pointer items-center justify-center rounded-full ${look}`}
    >
      <HangerIcon className={variant === "hero" ? "h-5 w-6" : "h-[17px] w-[22px]"} strokeWidth={2.6} />
      <span key={tick} className={`pointer-events-none absolute inset-0 ${burst}`} aria-hidden="true">
        {burst &&
          PARTICLES.map((p, i) => (
            <span
              key={i}
              className="lv-p"
              style={{ "--dx": p.dx, "--dy": p.dy, width: p.size, height: p.size, background: p.color } as React.CSSProperties}
            />
          ))}
      </span>
    </button>
  );
}
