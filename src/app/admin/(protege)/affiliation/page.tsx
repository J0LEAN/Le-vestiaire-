import { AffiliateTable } from "@/components/admin/AffiliateTable";
import { db } from "@/lib/db";

export default async function AffiliationPage() {
  const items = await db.item.findMany({
    include: { outfit: { select: { title: true, status: true } } },
    orderBy: [{ outfitId: "desc" }, { position: "asc" }],
  });

  return (
    <div>
      <h1 className="font-serif text-3xl">Liens affiliés</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Collez vos liens affiliés dans la colonne « Lien », cochez « Affilié », puis cliquez sur « Enregistrer » : toutes les
        modifications sont enregistrées d&apos;un coup. Les lignes modifiées sont surlignées.
      </p>
      <AffiliateTable
        rows={items.map((i) => ({
          id: i.id,
          name: i.name,
          brand: i.brand,
          outfitTitle: i.outfit.title,
          url: i.url,
          isAffiliate: i.isAffiliate,
          linkStatus: i.linkStatus,
        }))}
      />
    </div>
  );
}
