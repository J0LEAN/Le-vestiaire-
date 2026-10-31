import { readImage } from "@/lib/images";

// Sert les copies d'images enregistrées par le site : /images/<empreinte>.jpg
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const data = await readImage(file);
  if (!data) return new Response("Image introuvable", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/jpeg",
      // Le nom dépend du contenu : l'image ne change jamais, le navigateur peut la garder.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
