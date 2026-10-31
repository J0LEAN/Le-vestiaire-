# Le Vestiaire

**Des tenues complètes, prêtes à copier.** Le Vestiaire est un magazine en ligne de tenues : chaque tenue est composée de plusieurs articles (haut, bas, chaussures, accessoires…), avec un lien pour acheter chacun d'eux, un conseil « pourquoi ça marche » et un visuel généré automatiquement à partir des photos des produits.

- Site public : accueil avec tenues à la une et bouton « Surprenez-moi », filtres (occasion, style, saison, budget), pages tenues avec progression « Je l'ai déjà ? » et barre « Tout acheter », collections par style, **Mon portant** (tenues mises de côté), pages légales, newsletter.
- Design « verre liquide, rose & cerise », avec les tenues suspendues sur des cintres (maquettes de Claude Design dans le dossier [`design/`](design/)).
- Espace admin (`/admin`) : créer et modifier des tenues, **importer des tenues en lot** (JSON ou CSV), vérifier les liens, gérer les liens affiliés, exporter la newsletter.

Technologies : Next.js 16, TypeScript, Tailwind CSS, Prisma et SQLite. Le site est prévu pour être hébergé sur **Railway**.

---

## Sommaire

1. [Lancer le site sur votre ordinateur](#1-lancer-le-site-sur-votre-ordinateur)
2. [Ajouter des tenues : l'import en lot](#2-ajouter-des-tenues--limport-en-lot)
3. [Vérifier les liens](#3-vérifier-les-liens)
4. [Gérer les liens affiliés](#4-gérer-les-liens-affiliés)
5. [Mettre le site en ligne sur Railway](#5-mettre-le-site-en-ligne-sur-railway)
6. [Avant d'ouvrir le site au public](#6-avant-douvrir-le-site-au-public)
7. [Personnaliser le site](#7-personnaliser-le-site)
8. [Aide-mémoire](#8-aide-mémoire)

---

## 1. Lancer le site sur votre ordinateur

### Ce qu'il faut installer (une seule fois)

- **Node.js** version 20 ou plus récente : téléchargez la version « LTS » sur [nodejs.org](https://nodejs.org/fr) et installez-la comme n'importe quel logiciel.
- **Git** : [git-scm.com](https://git-scm.com/downloads) (souvent déjà installé sur Mac).

Pour vérifier, ouvrez un **terminal** (sur Mac : application « Terminal » ; sur Windows : « PowerShell »), puis tapez :

```bash
node --version
```

Le terminal doit afficher un numéro qui commence par `v20` ou plus.

### Installer le projet (une seule fois)

Tapez ces commandes une par une dans le terminal.

1. Télécharger le projet :

```bash
git clone https://github.com/J0LEAN/Buy-my-dress.git
```

2. Entrer dans le dossier du projet :

```bash
cd Buy-my-dress
```

3. Installer les bibliothèques dont le site a besoin (1 à 2 minutes) :

```bash
npm install
```

4. Créer votre fichier de réglages à partir du modèle :

```bash
cp .env.example .env
```

Ouvrez ensuite le fichier `.env` avec un éditeur de texte et remplacez `change-moi` par le mot de passe de votre choix pour l'admin.

5. Créer la base de données :

```bash
npx prisma migrate dev
```

6. (Facultatif) Ajouter les 6 tenues d'exemple :

```bash
npm run db:seed
```

### Démarrer le site

```bash
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur. L'admin se trouve sur [http://localhost:3000/admin](http://localhost:3000/admin), avec le mot de passe choisi dans `.env`.

Pour arrêter le site, revenez dans le terminal et appuyez sur `Ctrl` + `C`.

---

## 2. Ajouter des tenues : l'import en lot

C'est la façon normale d'alimenter le site.

1. **Faites composer les tenues par Claude.** Le fichier [`IMPORT.md`](IMPORT.md) contient, tout en bas, un texte prêt à copier au début de votre conversation : il explique à Claude le format exact attendu. Demandez-lui par exemple « 5 tenues pour un mariage en été, budget 150 à 250 € ».
2. **Enregistrez sa réponse** dans un fichier texte que vous nommez, par exemple, `tenues-mariage.json`.
3. Dans l'admin, ouvrez **Import en lot** et choisissez le fichier.
4. Le site affiche :
   - soit un **aperçu** des tenues trouvées : vérifiez-le, puis cliquez sur **« Importer en brouillon »** ;
   - soit une **liste d'erreurs** en français (par exemple « Tenue n°2, article n°3 : le lien n'est pas une adresse valide ») : corrigez le fichier, ou demandez à Claude de le corriger en lui collant les erreurs, puis recommencez. Rien n'est enregistré tant qu'il reste une erreur.
5. Les tenues importées arrivent en **brouillon** : elles ne sont pas encore visibles par les visiteurs. Dans **Tenues**, relisez chacune d'elles (bouton « Modifier »), puis cliquez sur **« Publier »**.

Le site vous prévient si une tenue du fichier porte le même titre qu'une tenue existante, pour éviter les doublons.

Le format complet (JSON et CSV, champs obligatoires, valeurs autorisées) est décrit dans [`IMPORT.md`](IMPORT.md). Les fichiers modèles `exemple-import.json` et `exemple-import.csv` sont dans le dossier `public/`, et vous pouvez aussi les télécharger depuis la page d'import.

**Images.** Si une tenue n'a pas d'« image principale », le site crée automatiquement un **collage** des photos de ses articles. Les photos de produits sur fond blanc donnent le meilleur résultat. Une version de ce collage est aussi générée pour Pinterest et pour les aperçus sur les réseaux sociaux. 

**Copies des photos.** Les produits, surtout en édition limitée, disparaissent vite des boutiques, et leur photo avec eux. Le site garde donc **sa propre copie** de chaque photo d'article (et de chaque image principale), automatiquement, à l'import et à l'enregistrement d'une tenue. Certaines boutiques bloquent ces copies : la page **Admin › Images** liste alors les photos concernées. Enregistrez l'image sur votre ordinateur (clic droit › « Enregistrer l'image ») puis envoyez-la depuis cette page.

**Liens affiliés facultatifs.** Un article peut avoir un lien normal : cochez « affilié » seulement si c'en est un, et la mention « Lien affilié » s'affichera.

---

## 3. Vérifier les liens

Les boutiques retirent souvent des produits. Dans l'admin, ouvrez **Vérifier les liens**, puis cliquez sur **« Vérifier les liens »**. L'opération prend une à deux minutes selon le nombre d'articles.

Chaque lien est ensuite classé :

| Statut | Signification | Que faire ? |
|---|---|---|
| **OK** | La page existe. | Rien. |
| **Cassé** | La page n'existe plus (erreur 404) ou le site est introuvable. | Remplacer le lien, ou retirer l'article de la tenue. |
| **À vérifier** | Le site a refusé la vérification automatique. C'est fréquent chez les grandes enseignes, qui bloquent les robots. | Cliquer sur le lien pour vérifier vous-même. |

La page affiche la liste des liens à corriger, avec un raccourci vers la tenue concernée. Dans la liste des tenues, une étiquette rouge signale aussi celles qui ont des liens à corriger. Pensez à lancer une vérification **une fois par semaine**.

---

## 4. Gérer les liens affiliés

Quand vous rejoignez un programme d'affiliation (Awin, Effiliation, Amazon Partenaires…), il vous fournit des liens spéciaux qui vous rapportent une commission. Pour les mettre en place :

1. Dans l'admin, ouvrez **Liens affiliés** : un tableau liste tous les articles.
2. Collez le lien affilié dans la colonne « Lien » et cochez **« Affilié »**. Les lignes modifiées sont surlignées.
3. Cliquez sur **« Enregistrer »** : toutes les modifications sont enregistrées d'un coup.

Sur le site, les liens affiliés affichent automatiquement la mention **« Lien affilié »**. Ils portent aussi l'attribut technique `rel="sponsored nofollow noopener"`, qui signale aux moteurs de recherche qu'il s'agit d'un lien commercial, comme Google le demande.

---

## 5. Mettre le site en ligne sur Railway

[Railway](https://railway.com) héberge le site et garde la base de données sur un **disque permanent** (un « volume »). Comptez environ 5 $ par mois.

### Étape 1 : créer le projet

1. Créez un compte sur [railway.com](https://railway.com) en vous connectant avec votre compte GitHub.
2. Cliquez sur **New Project**, puis **Deploy from GitHub repo**, et choisissez le dépôt `Buy-my-dress`.
3. Railway lance une première construction du site. Elle échouera ou le site ne fonctionnera pas encore : c'est normal, il manque les réglages des étapes suivantes.

### Étape 2 : ajouter le disque permanent (volume)

1. Dans votre projet Railway, faites un clic droit sur le service du site (ou passez par la palette de commandes avec `Ctrl` + `K` / `⌘` + `K`), puis choisissez **Attach Volume** (ou « Add Volume »).
2. Pour le chemin de montage (**Mount path**), indiquez : `/data`

> ⚠️ Sans volume, la base de données serait effacée à chaque mise à jour du site.

### Étape 3 : obtenir une adresse web

Ouvrez le service, puis **Settings → Networking → Generate Domain**. Railway vous donne une adresse du type `https://buy-my-dress-production.up.railway.app`. Vous pourrez plus tard brancher votre propre nom de domaine au même endroit (**Custom Domain**).

### Étape 4 : les variables d'environnement

Dans l'onglet **Variables** du service, ajoutez :

| Variable | Valeur | Explication |
|---|---|---|
| `DATABASE_URL` | `file:/data/vestiaire.db` | Emplacement de la base, sur le volume. |
| `ADMIN_PASSWORD` | un long mot de passe | Le mot de passe de `/admin`. Choisissez-en un vrai, qui ne sert nulle part ailleurs. |
| `SITE_URL` | l'adresse de l'étape 3 (sans `/` à la fin) | Sert au sitemap, à Pinterest et aux aperçus de partage. |
| `IMAGES_DIR` | *(rien à faire)* | Les copies des photos vont automatiquement dans `/data/images`, sur le volume. Ne remplissez cette variable que pour choisir un autre dossier. |
| `SEED_EXEMPLES` | `oui` *(facultatif)* | Ajoute les 6 tenues d'exemple **si la base est vide**. Vous pourrez les supprimer depuis l'admin. |

Railway redéploie automatiquement le site après chaque changement de variable.

### Comment se passe un déploiement

Le fichier [`railway.json`](railway.json) indique à Railway quoi faire :
- **Construction** : `npm run build`.
- **Démarrage** : `npm run start:railway`. Cette commande met à jour la structure de la base si besoin (migrations), ajoute les exemples si `SEED_EXEMPLES=oui` et que la base est vide, puis démarre le site.

À chaque fois que vous (ou Claude) envoyez du code sur la branche principale de GitHub, Railway met le site à jour tout seul. Vos tenues et les copies de leurs photos sont conservées, car elles sont sur le volume.

### Sauvegardes

Toutes vos tenues sont dans le fichier `/data/vestiaire.db`, et les copies des photos dans le dossier `/data/images`. Activez les **sauvegardes du volume** dans Railway (onglet du volume → **Backups**), surtout une fois que vous aurez publié beaucoup de tenues.

> Avec SQLite, gardez **une seule instance** du site (le réglage par défaut de Railway). Si un jour le site a beaucoup de trafic, il pourra passer à PostgreSQL (voir la section 7).

---

## 6. Avant d'ouvrir le site au public

- [ ] Compléter les **pages légales**. Les passages à remplir sont surlignés en jaune avec la mention `[À COMPLÉTER]` :
  - `src/app/(site)/mentions-legales/page.tsx`
  - `src/app/(site)/confidentialite/page.tsx`
  - `src/app/(site)/liens-affilies/page.tsx`

  Ces textes sont des modèles : faites-les relire si vous avez un doute, notamment pour l'affiliation.
- [ ] Choisir un vrai mot de passe admin (`ADMIN_PASSWORD`).
- [ ] Renseigner `SITE_URL` avec l'adresse définitive du site.
- [ ] Supprimer les tenues d'exemple (ou les garder en brouillon).
- [ ] Déclarer le site dans la [Google Search Console](https://search.google.com/search-console) et y indiquer le sitemap : `https://votre-site/sitemap.xml`.

---

## 7. Personnaliser le site

| Je veux changer… | Fichier |
|---|---|
| Le nom du site, le slogan, la description | `src/lib/site.ts` |
| Les couleurs, arrondis et effets de verre | `src/app/globals.css` (bloc `@theme`) |
| Les animations | `src/app/animations.css` (elles se coupent seules si l'appareil demande moins de mouvement) |
| Les messages du bandeau défilant | `src/components/SiteHeader.tsx` |
| Les polices | `src/app/layout.tsx` |
| Les styles, occasions, saisons, catégories, tranches de budget | `src/lib/constants.ts` |
| Les textes de la page d'accueil | `src/app/(site)/page.tsx` |

**Mon portant** : sans comptes utilisateurs, les tenues mises de côté sont gardées dans le navigateur de chaque visiteuse (elles ne suivent pas d'un téléphone à l'autre). Quand les comptes arriveront (phase 2), il suffira de remplacer `src/components/portant/store.ts` par un enregistrement en base.

**L'application mobile** est annoncée « bientôt disponible » (en-tête et encart rose du pied de page), sans lien. Quand elle existera, ajoutez les liens App Store et Google Play dans `src/components/SiteFooter.tsx` et `src/components/SiteHeader.tsx`.

**Passer à PostgreSQL plus tard** : dans `prisma/schema.prisma`, remplacez `provider = "sqlite"` par `provider = "postgresql"`, ajoutez une base PostgreSQL dans Railway, mettez son adresse dans `DATABASE_URL`, puis recréez les migrations. C'est une opération à faire avec l'aide d'un développeur ou de Claude.

---

## 8. Aide-mémoire

| Commande | À quoi elle sert |
|---|---|
| `npm run dev` | Lancer le site en local, sur http://localhost:3000 |
| `npm run db:seed` | Ajouter les tenues d'exemple (seulement si la base est vide) |
| `npm run db:seed -- --force` | ⚠️ Effacer **toutes** les tenues et recharger les exemples |
| `npx prisma studio` | Ouvrir un tableau pour voir et modifier la base de données directement |
| `npm run build` | Vérifier que le site se construit correctement (comme Railway) |
| `npm run lint` et `npm run typecheck` | Vérifications automatiques du code |

### Organisation du projet

```
prisma/
  schema.prisma          ← description de la base de données (tenues, articles, abonnés)
  migrations/            ← historique des changements de structure de la base
  seed.ts                ← script qui charge les tenues d'exemple
  donnees-exemple.json   ← les 6 tenues d'exemple
public/
  exemple-import.json    ← modèles de fichiers d'import
  exemple-import.csv
  exemples/              ← illustrations des tenues d'exemple
src/
  app/(site)/            ← pages publiques (accueil, tenues, collections, légal)
  app/admin/             ← espace admin
  app/visuels/           ← génération des images PNG (Pinterest, réseaux sociaux)
  app/sitemap.ts, robots.ts
  actions/               ← actions envoyées par les formulaires (enregistrer, importer…)
  components/            ← briques d'affichage (carte de tenue, collage, filtres…)
  lib/                   ← logique : import, vérification des liens, connexion admin…
IMPORT.md                ← format des fichiers d'import et texte pour Claude
railway.json             ← configuration de l'hébergement Railway
```
