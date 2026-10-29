import type { NextConfig } from "next";

// Configuration de Next.js.
// On garde volontairement le fonctionnement "classique" (sans Cache Components) :
// chaque page lit la base de données à chaque visite, ce qui est simple
// et largement assez rapide pour un magazine de tenues.
const nextConfig: NextConfig = {
  // Permet d'envoyer des fichiers d'import jusqu'à 5 Mo depuis l'admin.
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
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
