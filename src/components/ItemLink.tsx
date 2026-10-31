// Liens vers les articles marchands.
// Les liens affiliés portent rel="sponsored nofollow noopener", comme le
// demandent Google et la loi (transparence sur la publicité).

export function itemRel(isAffiliate: boolean) {
  return isAffiliate ? "sponsored nofollow noopener" : "nofollow noopener";
}

/** Petite mention visible à côté des liens affiliés. */
export function AffiliateBadge() {
  return (
    <span className="inline-block rounded-full border border-ink/30 px-2.5 py-0.5 text-[11px] font-bold">Lien affilié</span>
  );
}
