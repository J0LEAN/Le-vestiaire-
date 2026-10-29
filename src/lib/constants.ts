// Listes de référence du site.
// `value` est ce qui est stocké en base et utilisé dans les fichiers d'import ;
// `label` est ce qui est affiché aux visiteurs.
// Pour ajouter un style ou une occasion, il suffit d'ajouter une ligne ici.

export type Option = { value: string; label: string; description?: string };

export const STYLES: Option[] = [
  { value: "classique", label: "Classique", description: "Des pièces intemporelles qui ne se démodent jamais." },
  { value: "chic", label: "Chic", description: "Élégant et soigné, pour faire bonne impression." },
  { value: "casual", label: "Casual", description: "Décontracté mais réfléchi, pour tous les jours." },
  { value: "minimaliste", label: "Minimaliste", description: "Peu de pièces, des lignes nettes, des couleurs sobres." },
  { value: "boheme", label: "Bohème", description: "Matières fluides, imprimés et touches naturelles." },
  { value: "streetwear", label: "Streetwear", description: "Inspiré de la rue : baskets, sweats et coupes amples." },
  { value: "sportswear", label: "Sportswear", description: "Confortable et dynamique, pensé pour bouger." },
  { value: "romantique", label: "Romantique", description: "Douceur, dentelle, fleurs et volants." },
];

export const OCCASIONS: Option[] = [
  { value: "quotidien", label: "Quotidien" },
  { value: "travail", label: "Travail" },
  { value: "entretien", label: "Entretien" },
  { value: "soiree", label: "Soirée" },
  { value: "mariage", label: "Mariage" },
  { value: "week-end", label: "Week-end" },
  { value: "vacances", label: "Vacances" },
  { value: "rendez-vous", label: "Rendez-vous" },
];

export const SEASONS: Option[] = [
  { value: "printemps", label: "Printemps" },
  { value: "ete", label: "Été" },
  { value: "automne", label: "Automne" },
  { value: "hiver", label: "Hiver" },
  { value: "toutes", label: "Toutes saisons" },
];

export const CATEGORIES: Option[] = [
  { value: "haut", label: "Haut" },
  { value: "bas", label: "Bas" },
  { value: "robe", label: "Robe / combinaison" },
  { value: "manteau", label: "Manteau / veste" },
  { value: "chaussures", label: "Chaussures" },
  { value: "sac", label: "Sac" },
  { value: "accessoire", label: "Accessoire" },
  { value: "bijou", label: "Bijou" },
];

// Tranches de budget pour le filtre (en euros, total de la tenue).
export const BUDGETS: (Option & { min: number; max: number | null })[] = [
  { value: "moins-100", label: "Moins de 100 €", min: 0, max: 100 },
  { value: "100-200", label: "100 à 200 €", min: 100, max: 200 },
  { value: "200-400", label: "200 à 400 €", min: 200, max: 400 },
  { value: "plus-400", label: "Plus de 400 €", min: 400, max: null },
];

export const OUTFIT_STATUSES: Option[] = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publiee", label: "Publiée" },
];

/** Retrouve le libellé lisible d'une valeur (ex. "soiree" → "Soirée"). */
export function labelOf(list: Option[], value: string | null | undefined): string {
  return list.find((o) => o.value === value)?.label ?? value ?? "";
}
