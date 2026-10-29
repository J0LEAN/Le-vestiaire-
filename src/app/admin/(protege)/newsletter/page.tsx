import { deleteSubscriber } from "@/actions/newsletter";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function NewsletterPage() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl">Newsletter ({subscribers.length} inscrit{subscribers.length > 1 ? "s" : ""})</h1>
        {/* Lien classique (pas de navigation Next.js) pour déclencher le téléchargement */}
        <a href="/admin/newsletter/export" className="btn-primary">Exporter en CSV</a>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le fichier CSV s&apos;ouvre dans Excel et s&apos;importe dans les outils d&apos;envoi d&apos;emails (Brevo, Mailchimp…).
        Si quelqu&apos;un vous demande de supprimer ses données, utilisez le bouton « Supprimer ».
      </p>
      {subscribers.length === 0 ? (
        <p className="mt-6 border border-line bg-paper p-6 text-sm">Personne n&apos;est encore inscrit.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line bg-paper">
          {subscribers.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 p-3 text-sm">
              <span className="break-all">{s.email}</span>
              <span className="flex shrink-0 items-center gap-4 text-muted">
                {formatDate(s.createdAt)}
                <form action={deleteSubscriber}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message={`Supprimer ${s.email} ?`} className="text-danger underline">Supprimer</ConfirmButton>
                </form>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
