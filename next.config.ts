import type { NextConfig } from "next";

// Configuration de Next.js.
// On garde volontairement le fonctionnement "classique" (sans Cache Components) :
// chaque page lit la base de données à chaque visite, ce qui est simple
// et largement assez rapide pour un magazine de tenues.
//
// Deux façons de construire le site :
//  - avec un serveur (Railway…) : comportement normal ;
//  - « figé » (GitHub Pages), quand STATIC_EXPORT=1 : toutes les pages sont fabriquées
//    à l'avance dans le dossier `out/`, sans serveur (voir scripts/construire-statique.sh).
const figé = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(figé
    ? {
        output: "export" as const,
        // Sous-dossier du site sur GitHub Pages (ex. "/Buy-my-dress")
        basePath: process.env.BASE_PATH || undefined,
        images: { unoptimized: true },
        // /tenues/x/ au lieu de /tenues/x : navigation fluide sur GitHub Pages
        trailingSlash: true,
      }
    : {}),
  // Permet d'envoyer des fichiers d'import et des images jusqu'à 15 Mo depuis l'admin.
  experimental: { serverActions: { bodySizeLimit: "15mb" } },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
