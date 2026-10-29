import type { NextConfig } from "next";

// Configuration de Next.js.
// On garde volontairement le fonctionnement "classique" (sans Cache Components) :
// chaque page lit la base de données à chaque visite, ce qui est simple
// et largement assez rapide pour un magazine de tenues.
const nextConfig: NextConfig = {
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
