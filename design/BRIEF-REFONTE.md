# Le Vestiaire — refonte du design (brief pour Claude Code)

## Ta mission

Appliquer la nouvelle direction visuelle du dossier `design/` au site Next.js du Vestiaire : **verre liquide, formes arrondies, palette rose & cerise, tenues présentées sur des cintres, micro-interactions « dopamine »**. Le fond du site (données, admin, routes, Prisma, affiliation) ne change pas : c'est une refonte de l'interface publique.

Travaille par petites étapes, en vérifiant à chaque fois `npm run typecheck` et `npm run lint`, et compare le rendu aux captures de `design/captures/`.

## Contenu de ce dossier

| Chemin | Rôle |
|---|---|
| `design/maquettes/*.html` | Maquettes statiques à ouvrir dans un navigateur : `accueil-ordinateur.html`, `app-accueil.html`, `app-tenue.html`. **Référence visuelle principale.** |
| `design/captures/*.png` | Captures pleine page des maquettes. `design/captures/avant/` = le site actuel, avant refonte. |
| `design/source/*.dc.html` | Sources des maquettes (format Claude Design) : le HTML/CSS exact, et dans le bloc `<script type="text/x-dc">`, la logique des interactions (portant, toast, progression, « Surprenez-moi »…). À lire pour les détails de comportement. |
| `design/design-tokens.css` | Bloc `@theme` Tailwind 4 (couleurs, arrondis, polices, utilitaires `glass`, `rail`, `btn-primary`, `btn-secondary`). |
| `design/animations.css` | Toutes les animations et micro-interactions (classes `lv-*`). |
| `design/donnees/` | Les 6 tenues d'exemple et un exemple d'import. |
| `public/exemples/` | Les illustrations SVG des tenues d'exemple (chemins `/exemples/…` dans les données). |
| `code-actuel/` | Le code de l'interface tel qu'il est aujourd'hui (Next.js 16, React 19, Tailwind 4, Prisma). |

> Si tu travailles dans le vrai dépôt du site : copie `CLAUDE.md`, `design/` et `public/exemples/` à sa racine, et ignore `code-actuel/` (c'est une copie). Si seul ce dossier est disponible, travaille dans `code-actuel/` ; il manque alors les fichiers de configuration du projet (`next.config.ts`, `tsconfig.json`, `postcss`, `.env`, seed Prisma) : demande-les à l'utilisatrice avant d'en recréer.

## Contraintes à respecter absolument

1. **Interface 100 % en français**, ton bienveillant et sans jargon.
2. **Aucune photo portée** : uniquement des collages d'images produits, cadre vertical **4:5**, images fondues avec `mix-blend-mode: multiply`. Le fond des collages passe de `#F4F4F4` à **`#FBF4F7`** (à changer aussi dans la génération PNG de `src/app/visuels/[slug]/route.tsx` et dans `src/lib/collage.ts` si la couleur y est codée).
3. **Mention « Lien affilié »** toujours visible à côté d'un lien affilié (loi française sur l'influence commerciale).
4. **Bouton « Enregistrer sur Pinterest »** sur chaque tenue (il reste présent, sous le bouton cintre).
5. **Mobile d'abord** : tout doit fonctionner à 390 px de large. Cibles tactiles ≥ 44 px.
6. **Admin inchangé** dans sa logique ; tu peux lui appliquer les nouvelles couleurs et polices, sans plus.
7. **Accessibilité** : vrais `<button>` / `<a>`, `aria-label` sur les boutons-icônes, `aria-pressed` sur les boutons bascule, `role="status"` sur le toast, contraste texte ≥ 4.5:1. **Respecter `prefers-reduced-motion`** (déjà géré dans `animations.css`).
8. **Pas de nouvelle dépendance** sans raison forte : tout est faisable en CSS + React (pas besoin de Framer Motion ni de librairie de confettis).

## Système visuel

**Couleurs** (voir `design/design-tokens.css`)
- Fond `#F6EEF3` (rose nacré) · texte `#26121F` (aubergine) · secondaire `#5F4558` · libellés `#6A4C62`
- Accent cerise `#D11F5A` : boutons d'achat, mots en italique des titres, compteurs
- Texte sur fond sombre / accent : `#FFF5FA`
- Halos flous d'ambiance derrière le verre : `#FF9BC4`, `#B9A0FF`, `#FFB48A`, `#F06AA0`
- Fond des collages : `#FBF4F7`

**Typographie** — remplacer Playfair Display + Inter (dans `src/app/layout.tsx`, via `next/font/google`) par :
- **Fraunces** (titres), axes `opsz` et `SOFT`, réglage `font-variation-settings: "SOFT" 100` ; mots clés en italique cerise.
- **Nunito** (texte et interface), graisses 400 à 800.
- Mettre à jour `--font-serif` / `--font-sans` et `themeColor` du viewport (`#F6EEF3`).

**Formes et matières**
- Pilules (`rounded-full`) pour boutons, filtres, étiquettes ; cartes arrondies 24 à 36 px.
- Verre : fond blanc translucide, `backdrop-filter: blur(20px) saturate(150%)`, liseré blanc, reflet intérieur (utilitaire `glass`).
- **Motif signature : la tringle et les cintres.** Une tringle en verre (utilitaire `rail`) et des cintres SVG en trait arrondi auxquels pendent les tenues, légèrement inclinées. Le cintre sert aussi de logo et d'icône « Mon portant ». SVG du cintre (viewBox `0 0 34 26`) :
  `<path d="M17 9.5V7.5c0-1.4 2.6-1.8 2.6-3.6A2.6 2.6 0 0 0 14.4 3.6"/><path d="M17 9.5 3 21.5c-.8.7-.3 1.5.6 1.5h26.8c.9 0 1.4-.8.6-1.5L17 9.5Z"/>`

## Pages à refaire (site public)

Correspondance maquette → code actuel :

| Maquette | Fichiers à modifier |
|---|---|
| En-tête verre flottant + bandeau défilant | `components/SiteHeader.tsx` |
| Accueil : hero, 3 étapes, « Sur le portant cette semaine », « Toutes les tenues » + filtres en pilules, encart « Pourquoi ça marche », newsletter + encart app | `app/(site)/page.tsx`, `components/FilterBar.tsx`, `components/NewsletterForm.tsx` |
| Carte tenue (collage + bouton cintre + Pinterest) | `components/OutfitCard.tsx`, `components/OutfitVisual.tsx`, `components/PinterestButton.tsx` |
| Page tenue : collage sur cintre, étiquettes, « Pourquoi ça marche » sombre, liste des pièces en cartes verre, progression « Je l'ai déjà », barre flottante « Tout acheter » | `app/(site)/tenues/[slug]/page.tsx`, `components/ItemLink.tsx`, `components/BuyAllButton.tsx` |
| Collections, pages légales, 404 | `app/(site)/collections/**`, `components/LegalPage.tsx`, `app/not-found.tsx` : appliquer le même langage visuel |
| Pied de page | `components/SiteFooter.tsx` |

Les filtres « Style · Saison · Budget » gardent leur logique actuelle ; seule leur apparence change (pilules dans une barre en verre).

## Animations et micro-interactions

Importer `design/animations.css` (dans `globals.css` ou en module) et poser la classe `lv-on` sur le conteneur racine du site public. Toutes les classes `lv-*` sont décrites ci-dessous ; la logique de référence est dans les `*.dc.html`.

**Ambiance (CSS seul)**
- `lv-halo` : halos flous qui dérivent lentement derrière le verre.
- `lv-swing` (+ `d1`, `d2` pour décaler) : cintres qui se balancent ; plus vite au survol.
- `lv-up` (+ `s1`…`s4` pour échelonner) : apparition au chargement.
- `lv-reveal` : apparition au défilement via `animation-timeline: view()` (Chrome/Edge ; ailleurs le contenu s'affiche normalement).
- `lv-card` : carte qui se soulève au survol, collage qui zoome légèrement.
- `lv-btn`, `lv-chip`, `lv-shine` (reflet qui balaie le bouton), `lv-glow` (lueur cerise pulsée sur les boutons d'achat), `lv-pop` (pulsation du bouton « Ajouter à mon portant »), `lv-bar` (barres flottantes qui montent au chargement), `lv-marquee` (bandeau défilant), `lv-spin` (badge rond « Copiez-la ✦ en 1 clic »).

**Interactions (composants client, `"use client"`)**
1. **Mon portant (favoris)** — bouton cintre sur chaque carte et sur la page tenue.
   - Bascule enregistrée / non enregistrée (`aria-pressed`). Enregistrée : fond cerise, icône claire.
   - À l'ajout : explosion de 12 particules colorées (`lv-burstA`/`lv-burstB` en alternance pour relancer l'animation).
   - Toast en bas : « Ajoutée à votre portant · N tenues » / « Retirée de votre portant », disparaît après 2,6 s.
   - Compteur cerise sur « Mon portant » (en-tête du site, onglet de l'app) qui rebondit (`lv-bumpA`/`lv-bumpB`).
   - **Stockage : `localStorage`** pour l'instant (pas encore de comptes), via un petit contexte React partagé (ex. `PortantProvider` + hook `usePortant`). Prévoir que ce soit remplaçable plus tard par une table Prisma quand les comptes arriveront. Gérer l'absence de `localStorage` (try/catch) et l'hydratation (pas d'écart serveur/client).
   - Créer une page `/portant` qui liste les tenues enregistrées (état vide sympathique si aucune).
2. **« Surprenez-moi »** (hero de l'accueil) — change la tenue vedette au hasard parmi les tenues publiées, avec l'animation `lv-swapA`/`lv-swapB`.
3. **Progression « Je l'ai déjà ? »** (page tenue) — un bouton par pièce. Une barre de progression « Plus que N pièces à trouver » se remplit ; la barre « Tout acheter » affiche le nombre de pièces restantes et le prix total de ce qui manque ; à 100 % : confettis (`lv-confetti`) et « Tenue complète ✓ ». État local à la page (pas besoin de le sauvegarder).
4. **Interrupteur d'animations** : `lv-on` / `lv-off` sur la racine ; `prefers-reduced-motion` coupe tout automatiquement.

## Ordre de travail conseillé

1. Polices + `design-tokens.css` dans `globals.css`, `animations.css`, couleur de fond des collages.
2. `SiteHeader`, `SiteFooter`, fond à halos dans le layout public `app/(site)/layout.tsx`.
3. `OutfitVisual` + `OutfitCard` (verre, cintre, boutons), puis l'accueil.
4. Page tenue (cartes de pièces, mention affiliée, barre d'achat flottante).
5. `PortantProvider`, bouton cintre, toast, compteur, page `/portant`.
6. « Surprenez-moi », progression « Je l'ai déjà ? », confettis.
7. Collections, pages légales, 404, puis un passage léger sur l'admin (couleurs/polices).
8. Vérifs : `npm run typecheck`, `npm run lint`, rendu à 390 px et 1440 px, navigation au clavier, `prefers-reduced-motion`.

## À ne pas faire

- Ne pas inventer de chiffres (« 128 personnes ont copié… ») ni de faux avis.
- Ne pas retirer la mention « Lien affilié » ni le bouton Pinterest.
- Ne pas mettre de photos de personnes.
- Ne pas casser l'admin, l'import CSV/JSON, la vérification des liens ni la newsletter.
