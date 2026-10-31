# Format d'import des tenues

L'admin du site (**Admin → Import en lot**) accepte deux formats : **JSON** (recommandé) et **CSV** (pratique avec Excel ou Google Sheets).
Les tenues importées arrivent toujours en **brouillon** : relisez-les, puis cliquez sur « Publier ».

Fichiers modèles : [`public/exemple-import.json`](public/exemple-import.json) et [`public/exemple-import.csv`](public/exemple-import.csv). Vous pouvez aussi les télécharger depuis la page d'import.

---

## Format JSON (recommandé)

```json
{
  "tenues": [
    {
      "titre": "Afterwork en jupe midi",
      "description": "Une tenue qui passe du bureau au bar sans détour par la maison.",
      "pourquoi_ca_marche": "La jupe midi est féminine sans être trop habillée…",
      "style": "chic",
      "occasion": "travail",
      "saison": "automne",
      "budget": 180,
      "image": "",
      "a_la_une": false,
      "articles": [
        {
          "nom": "Jupe midi plissée noire",
          "categorie": "bas",
          "marque": "Marque B",
          "prix": 49.0,
          "image": "https://boutique.fr/images/jupe.jpg",
          "lien": "https://boutique.fr/jupe-midi",
          "affilie": true
        }
      ]
    }
  ]
}
```

### Champs d'une tenue

| Champ | Obligatoire | Description |
|---|---|---|
| `titre` | oui | Titre de la tenue. L'adresse de la page en est tirée automatiquement. |
| `description` | oui | 2 ou 3 phrases de présentation. |
| `pourquoi_ca_marche` | oui | Le conseil de style : pourquoi ces pièces vont bien ensemble. |
| `style` | oui | Une des valeurs de la liste ci-dessous. |
| `occasion` | oui | Une des valeurs de la liste ci-dessous. |
| `saison` | oui | Une des valeurs de la liste ci-dessous. |
| `budget` | non | Budget indicatif en euros (nombre entier). Si vide, le site additionne les prix des articles. |
| `image` | non | Adresse d'une image principale. Si vide, un **collage automatique** des articles est créé. |
| `a_la_une` | non | `true` pour afficher la tenue dans « À la une » sur l'accueil. |
| `articles` | oui | Liste d'au moins un article (voir ci-dessous). |

### Champs d'un article

| Champ | Obligatoire | Description |
|---|---|---|
| `nom` | oui | Nom de l'article. |
| `categorie` | oui | Une des valeurs de la liste ci-dessous. |
| `marque` | non | Marque. |
| `prix` | non | Prix en euros : `49.9`, `"49,90"` ou `"49,90 €"` sont acceptés. |
| `image` | non | Adresse **de la photo elle-même** (pas de la page produit), de préférence sur fond blanc. Le site en garde une copie : la photo reste visible même si le produit disparaît de la boutique. JPG, PNG, WebP et AVIF acceptés. |
| `lien` | oui | Lien d'achat, commençant par `https://`. |
| `affilie` | non | `true` (ou `"oui"`) seulement si c'est un lien affilié. Un lien normal convient très bien : par défaut, le lien n'est pas affilié. |

### Valeurs autorisées

On peut écrire la valeur (`soiree`) ou le libellé (`Soirée`) : les accents et majuscules ne comptent pas.

- **style** : `classique`, `chic`, `casual`, `minimaliste`, `boheme`, `streetwear`, `sportswear`, `romantique`
- **occasion** : `quotidien`, `travail`, `entretien`, `soiree`, `mariage`, `week-end`, `vacances`, `rendez-vous`
- **saison** : `printemps`, `ete`, `automne`, `hiver`, `toutes`
- **categorie** : `haut`, `bas`, `robe`, `manteau`, `chaussures`, `sac`, `accessoire`, `bijou`

> Pour ajouter une valeur (par ex. un nouveau style), modifiez `src/lib/constants.ts`.

---

## Format CSV

**Une ligne par article.** Les lignes qui ont le **même titre** forment une seule tenue. Les informations de la tenue (description, style…) peuvent n'être écrites que sur la première ligne de chaque tenue.

Séparateur : point-virgule `;` (format Excel français) ou virgule `,`, détecté automatiquement. Encodage : UTF-8.

Colonnes :

```
titre;description;pourquoi_ca_marche;style;occasion;saison;budget;image_tenue;a_la_une;nom_article;categorie;marque;prix;image_article;lien;affilie
```

Si un texte contient le séparateur (`;`), entourez-le de guillemets : `"Un texte; avec un point-virgule"`.

---

## Texte à donner à Claude pour composer des tenues

Copiez ce texte au début de votre conversation avec Claude :

```text
Tu es styliste pour mon site « Le Vestiaire », un magazine de tenues complètes
destiné aux personnes qui ne savent pas s'habiller. Compose des tenues complètes
(haut, bas ou robe, chaussures, et 1 à 3 accessoires) avec de vrais articles
actuellement en vente sur des sites français, et rends-les UNIQUEMENT sous forme
d'un fichier JSON valide respectant exactement ce format :

{ "tenues": [ {
  "titre": "...", "description": "2-3 phrases", "pourquoi_ca_marche": "le conseil de style, 2-4 phrases",
  "style": "...", "occasion": "...", "saison": "...", "budget": 150,
  "articles": [ { "nom": "...", "categorie": "...", "marque": "...", "prix": 49.9,
                  "image": "https://... (adresse directe de la photo)", "lien": "https://... (page produit)", "affilie": false } ]
} ] }

Valeurs autorisées :
- style : classique, chic, casual, minimaliste, boheme, streetwear, sportswear, romantique
- occasion : quotidien, travail, entretien, soiree, mariage, week-end, vacances, rendez-vous
- saison : printemps, ete, automne, hiver, toutes
- categorie : haut, bas, robe, manteau, chaussures, sac, accessoire, bijou

Règles : textes en français, ton bienveillant et pédagogique, « pourquoi ça marche »
explique concrètement les couleurs, les coupes et les proportions. Les liens doivent
pointer vers la page exacte du produit. "image" doit être l'adresse directe de la photo
du produit (clic droit sur la photo › « Copier l'adresse de l'image »), qui se termine
souvent par .jpg, .png ou .webp. Pas de commentaire en dehors du JSON.
```
