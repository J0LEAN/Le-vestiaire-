// Mise en page commune aux pages légales.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl pt-12">
      <span className="pill">Informations</span>
      <h1 className="mt-4 font-serif text-[40px] leading-none tracking-[-0.02em] md:text-[56px]">{title}</h1>
      <p className="mt-3 text-sm text-ink-soft">Dernière mise à jour : {updated}</p>
      <div className="glass mt-8 rounded-[32px] p-6 text-[16px] leading-relaxed sm:p-10 [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-[26px] [&_h2:first-child]:mt-0 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_ul]:mb-4">
        {children}
      </div>
    </article>
  );
}

/** Passage à compléter, bien visible. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-yellow-100 px-1">[À COMPLÉTER : {children}]</mark>;
}
