"use client";

import { useActionState, useState, useTransition } from "react";
import { archiveAllImages, uploadImage } from "@/actions/images";

/** Bouton « Copier les images manquantes ». */
export function ArchiveButton({ pending: todo }: { pending: number }) {
  const [running, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        disabled={running || todo === 0}
        className="btn-primary"
        onClick={() =>
          startTransition(async () => {
            setResult(null);
            const r = await archiveAllImages();
            setResult(`${r.saved} image(s) copiée(s), ${r.failed} échec(s).`);
          })
        }
      >
        {running ? "Copie en cours…" : "Copier les images manquantes"}
      </button>
      {running && <span className="text-sm text-muted">Cela peut prendre une minute, ne fermez pas la page.</span>}
      {result && <span className="text-sm">{result}</span>}
    </div>
  );
}

/** Envoi d'une photo depuis l'ordinateur (quand la boutique bloque la copie). */
export function UploadForm({ id, kind }: { id: number; kind: "item" | "outfit" }) {
  const [error, action, pending] = useActionState(uploadImage, null);
  return (
    <form action={action} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="kind" value={kind} />
      <label className="text-sm">
        <span className="sr-only">Photo à envoyer</span>
        <input type="file" name="image" accept="image/*" required className="text-sm file:mr-2 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-on-ink" />
      </label>
      <button type="submit" disabled={pending} className="btn-secondary px-4 py-1.5">
        {pending ? "Envoi…" : "Enregistrer cette photo"}
      </button>
      {error && <span className="text-sm text-danger">{error}</span>}
    </form>
  );
}
