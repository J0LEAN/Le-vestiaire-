import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Calculé au démarrage du site (l'adresse SITE_URL peut changer sans reconstruire).
export const dynamic = "force-dynamic";

// Consignes pour les robots des moteurs de recherche : /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
