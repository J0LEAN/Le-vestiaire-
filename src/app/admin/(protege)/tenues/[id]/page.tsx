import { notFound } from "next/navigation";
import { OutfitForm } from "@/components/admin/OutfitForm";
import { db } from "@/lib/db";

export default async function EditOutfitPage({ params }: PageProps<"/admin/tenues/[id]">) {
  const { id } = await params;
  const o = await db.outfit.findUnique({ where: { id: Number(id) || 0 }, include: { items: { orderBy: { position: "asc" } } } });
  if (!o) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Modifier « {o.title} »</h1>
      <OutfitForm
        initial={{
          id: o.id,
          titre: o.title,
          description: o.description,
          pourquoi_ca_marche: o.whyItWorks,
          style: o.style,
          occasion: o.occasion,
          saison: o.season,
          budget: o.budget?.toString() ?? "",
          image: o.mainImage ?? "",
          a_la_une: o.featured,
          status: o.status,
          articles: o.items.map((i) => ({
            id: i.id,
            nom: i.name,
            categorie: i.category,
            marque: i.brand ?? "",
            prix: i.price?.toString() ?? "",
            image: i.imageUrl ?? "",
            lien: i.url,
            affilie: i.isAffiliate,
          })),
        }}
      />
    </div>
  );
}
