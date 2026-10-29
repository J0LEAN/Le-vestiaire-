// Mise en page commune aux pages légales.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 pt-12 text-[15px] leading-relaxed [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_ul]:mb-4 [&_a]:underline">
      <h1 className="font-serif text-4xl">{title}</h1>
      <p className="mt-2 mb-8 text-sm text-muted">Dernière mise à jour : {updated}</p>
      {children}
    </article>
  );
}

/** Passage à compléter, bien visible. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="bg-yellow-100 px-1">[À COMPLÉTER : {children}]</mark>;
}
