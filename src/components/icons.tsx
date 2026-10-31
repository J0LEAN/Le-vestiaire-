// Icônes du site (traits arrondis). Toutes décoratives : aria-hidden.

type IconProps = { className?: string; strokeWidth?: number };

/** Le cintre : logo du site et icône « Mon portant ». */
export function HangerIcon({ className = "h-[17px] w-[22px]", strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 34 26" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M17 9.5V7.5c0-1.4 2.6-1.8 2.6-3.6A2.6 2.6 0 0 0 14.4 3.6" />
      <path d="M17 9.5 3 21.5c-.8.7-.3 1.5.6 1.5h26.8c.9 0 1.4-.8.6-1.5L17 9.5Z" />
    </svg>
  );
}

/** Grand cintre posé sur la tringle, au-dessus d'une tenue. */
export function BigHanger({ className = "block h-[54px] w-[140px] text-ink" }: IconProps) {
  return (
    <svg viewBox="0 0 140 54" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M70 24v-5c0-2.4 4.5-3.2 4.5-7.5a5.5 5.5 0 0 0-11-.8" />
      <path d="M70 24 10 49c-2 .9-1.4 3 .8 3h118.4c2.2 0 2.8-2.1.8-3L70 24Z" />
    </svg>
  );
}

function Svg({ className = "h-5 w-5", strokeWidth = 2, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

export const ArrowUpRightIcon = (p: IconProps) => <Svg strokeWidth={2.2} {...p}><path d="M7 17 17 7M9 7h8v8" /></Svg>;
export const BackIcon = (p: IconProps) => <Svg strokeWidth={2.2} {...p}><path d="M15 5l-7 7 7 7" /></Svg>;
export const ShareIcon = (p: IconProps) => <Svg {...p}><path d="M12 4v11M7.5 8.5 12 4l4.5 4.5" /><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></Svg>;
export const PinIcon = (p: IconProps) => <Svg {...p}><path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 16.5l-6.5 4V5A1.5 1.5 0 0 1 7 3.5Z" /></Svg>;
export const ShuffleIcon = (p: IconProps) => <Svg strokeWidth={2.2} {...p}><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></Svg>;
export const HomeIcon = (p: IconProps) => <Svg {...p}><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" /></Svg>;
export const GridIcon = (p: IconProps) => <Svg {...p}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></Svg>;
export const SlidersIcon = (p: IconProps) => <Svg {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></Svg>;
