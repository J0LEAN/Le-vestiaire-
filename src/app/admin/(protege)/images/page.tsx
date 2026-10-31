import Link from "next/link";
import { ArchiveButton, UploadForm } from "@/components/admin/ImageTools";
import { db } from "@/lib/db";

const remote = { startsWith: "http" };

export default async function ImagesPage() {
  const [items, outfits] = await Promise.all([
    db.item.findMany({ where: { imageUrl: remote }, include: { outfit: { select: { id: true, title: true } } }, orderBy: { outfitId: "asc" } }),
    db.outfit.findMany({ where: { mainImage: remote } }),
  ]);
  const total = items.length + outfits.length;
  const copied = items.filter((i) => i.imageFile).length + outfits.filter((o) => o.mainImageFile).length;
  const failedItems = items.filter((i) => !i.imageFile && i.imageError);
  const failedOutfits = outfits.filter((o) => !o.mainImageFile && o.mainImageError);
  const failed = failedItems.length + failedOutfits.length;
  const waiting = total - copied - failed;

  return (
    <div>
      <h1 className="font-serif text-3xl">Images</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le site garde une copie de chaque photo d&apos;article : si un produit (en édition limitée par exemple) disparaît de la
        boutique, sa photo reste visible sur Le Vestiaire. Les copies sont faites automatiquement à l&apos;import et à
        l&apos;enregistrement d&apos;une tenue. Quand une boutique bloque la copie, enregistrez l&apos;image sur votre
        ordinateur (clic droit › « Enregistrer l&apos;image ») puis envoyez-la ci-dessous.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Images", total],
          ["Copiées", copied],
          ["À copier", waiting],
          ["Échecs", failed],
        ].map(([label, n]) => (
          <div key={label} className="border border-line bg-paper p-4">
            <p className="text-2xl font-semibold">{n}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ArchiveButton pending={waiting + failed} />
      </div>

      <h2 className="mt-10 font-serif text-2xl">Images à envoyer à la main ({failed})</h2>
      {failed === 0 ? (
        <p className="mt-4 border border-line bg-paper p-6 text-sm">Aucune image en attente. 🎉</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {failedOutfits.map((o) => (
            <li key={`o${o.id}`} className="border border-line bg-paper p-4 text-sm">
              <strong>Image principale</strong> de « {o.title} »
              <p className="mt-1 text-danger">{o.mainImageError}</p>
              <p className="mt-1 break-all">
                <a href={o.mainImage!} target="_blank" rel="noopener noreferrer" className="underline">{o.mainImage}</a>
              </p>
              <UploadForm id={o.id} kind="outfit" />
            </li>
          ))}
          {failedItems.map((i) => (
            <li key={`i${i.id}`} className="border border-line bg-paper p-4 text-sm">
              <strong>{i.name}</strong> <span className="text-muted">dans « {i.outfit.title} »</span>
              <p className="mt-1 text-danger">{i.imageError}</p>
              <p className="mt-1 break-all">
                Photo d&apos;origine : <a href={i.imageUrl!} target="_blank" rel="noopener noreferrer" className="underline">{i.imageUrl}</a>
                {" · "}
                <a href={i.url} target="_blank" rel="noopener noreferrer" className="underline">page du produit</a>
              </p>
              <UploadForm id={i.id} kind="item" />
              <Link href={`/admin/tenues/${i.outfit.id}`} className="mt-2 inline-block underline">Modifier la tenue</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
