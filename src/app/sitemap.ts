import type { MetadataRoute } from "next";
import { STYLES } from "@/lib/constants";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

// Plan du site pour Google : /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const outfits = await db.outfit.findMany({
    where: { status: "publiee" },
    select: { slug: true, style: true, updatedAt: true },
  });
  const usedStyles = new Set(outfits.map((o) => o.style));

  return [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/collections`, changeFrequency: "weekly", priority: 0.8 },
    ...STYLES.filter((s) => usedStyles.has(s.value)).map((s) => ({
      url: `${SITE.url}/collections/${s.value}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...outfits.map((o) => ({
      url: `${SITE.url}/tenues/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...["mentions-legales", "confidentialite", "liens-affilies"].map((p) => ({
      url: `${SITE.url}/${p}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
