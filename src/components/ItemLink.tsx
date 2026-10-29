// Lien vers un article marchand.
// Les liens affiliés portent rel="sponsored nofollow noopener", comme le
// demandent Google et la loi (transparence sur la publicité).

type Props = {
  url: string;
  isAffiliate: boolean;
  className?: string;
  children: React.ReactNode;
};

export function itemRel(isAffiliate: boolean) {
  return isAffiliate ? "sponsored nofollow noopener" : "nofollow noopener";
}

export function ItemLink({ url, isAffiliate, className, children }: Props) {
  return (
    <a href={url} target="_blank" rel={itemRel(isAffiliate)} className={className}>
      {children}
    </a>
  );
}

/** Petite mention visible à côté des liens affiliés. */
export function AffiliateBadge() {
  return (
    <span className="inline-block border border-ink px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase">
      Lien affilié
    </span>
  );
}
