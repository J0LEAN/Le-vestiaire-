#!/usr/bin/env bash
# Construit la version « figée » du site (sans serveur), pour GitHub Pages.
# Résultat : le dossier `out/`, prêt à être publié.
#
# Variables utiles (toutes facultatives en local) :
#   SITE_URL   adresse complète du site, sous-dossier compris
#              ex. https://mon-compte.github.io/Buy-my-dress
#   BASE_PATH  sous-dossier du site, ex. /Buy-my-dress (vide si le site est à la racine)
#
# ⚠️ Ce script SUPPRIME dans le dossier courant les parties qui ont besoin d'un
# serveur (espace admin, import, etc.). À lancer sur une copie propre du projet
# (c'est ce que fait GitHub Actions), jamais sur votre dossier de travail.
set -euo pipefail

if [ "${CONFIRME_COPIE_JETABLE:-}" != "oui" ] && [ -z "${GITHUB_ACTIONS:-}" ]; then
  echo "Ce script modifie le dossier courant. Relancez avec CONFIRME_COPIE_JETABLE=oui sur une copie du projet." >&2
  exit 1
fi

echo "1/5 Retrait des parties qui ont besoin d'un serveur"
rm -rf src/app/admin "src/app/images" src/actions src/components/admin src/components/NewsletterForm.tsx src/lib/auth.ts
# Les pages sont fabriquées une fois pour toutes (et non à chaque visite)
{ grep -rl 'export const dynamic = "force-dynamic";' src/app || true; } | xargs -r sed -i 's/export const dynamic = "force-dynamic";/export const dynamic = "force-static";/'

echo "2/5 Base de données de construction (jetable) avec les tenues d'exemple"
export DATABASE_URL="file:$PWD/construction.db"
rm -f construction.db
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts --force

echo "3/5 Construction du site figé"
export STATIC_EXPORT=1
npx next build

echo "4/5 Fichiers pour GitHub Pages"
touch out/.nojekyll

echo "5/5 Terminé : le site est dans le dossier out/"
