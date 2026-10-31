"use client";

import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from "react";
import { HangerIcon } from "@/components/icons";
import { getSaved, getServerSaved, setSaved, subscribe } from "./store";

type Portant = {
  saved: string[];
  isSaved: (slug: string) => boolean;
  toggle: (slug: string) => void;
  /** Affiche un message en bas de l'écran. */
  notify: (text: string) => void;
  /** Dernière tenue ajoutée et compteur d'actions (pour relancer les animations). */
  last: string | null;
  tick: number;
};

const PortantContext = createContext<Portant | null>(null);

/** Donne accès au portant (favoris) dans tout le site public. */
export function usePortant(): Portant {
  const ctx = useContext(PortantContext);
  if (!ctx) throw new Error("usePortant doit être utilisé dans <PortantProvider>");
  return ctx;
}

export function PortantProvider({ children }: { children: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribe, getSaved, getServerSaved);
  const [last, setLast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((text: string) => {
    setToast((t) => ({ text, id: (t?.id ?? 0) + 1 }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      const current = getSaved();
      const was = current.includes(slug);
      const next = was ? current.filter((s) => s !== slug) : [...current, slug];
      setSaved(next);
      setLast(was ? null : slug);
      setTick((n) => n + 1);
      notify(was ? "Retirée de votre portant" : `Ajoutée à votre portant · ${next.length} tenue${next.length > 1 ? "s" : ""}`);
    },
    [notify],
  );

  const value: Portant = { saved, isSaved: (slug) => saved.includes(slug), toggle, notify, last, tick };

  return (
    <PortantContext.Provider value={value}>
      {children}
      {/* Message de confirmation (lu par les lecteurs d'écran) */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] z-50 md:bottom-10">
        {toast && (
          <div
            key={toast.id}
            className={`lv-toast${toast.id % 2 ? "A" : "B"} absolute bottom-0 left-1/2 flex max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-full bg-ink py-2.5 pr-5 pl-2.5 text-[15px] font-extrabold text-on-ink shadow-[0_18px_40px_rgba(70,20,55,0.35)]`}
          >
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-accent">
              <HangerIcon className="h-4 w-5" strokeWidth={2.6} />
            </span>
            {toast.text}
          </div>
        )}
      </div>
    </PortantContext.Provider>
  );
}

/** Pastille cerise avec le nombre de tenues sur le portant (rebondit à chaque changement). */
export function PortantCount({ className = "" }: { className?: string }) {
  const { saved, tick } = usePortant();
  if (saved.length === 0) return null;
  return (
    <span
      key={tick}
      className={`lv-bump${tick % 2 ? "B" : "A"} inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-extrabold text-on-ink ${className}`}
      aria-label={`${saved.length} tenue${saved.length > 1 ? "s" : ""}`}
    >
      {saved.length}
    </span>
  );
}
