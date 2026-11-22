import { getPublishedOutfits } from "@/lib/queries";
import { renderVisuel } from "@/lib/visuel";

// Image fabriquée à l'avance pour chaque tenue publiée (nécessaire pour un site figé).
export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getPublishedOutfits()).map((o) => ({ slug: o.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderVisuel(slug, true);
}
