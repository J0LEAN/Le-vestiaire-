import { ImportForm } from "@/components/admin/ImportForm";

export default function ImportPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">Import en lot</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Envoyez un fichier <strong>.json</strong> ou <strong>.csv</strong> contenant plusieurs tenues et leurs articles. Vous
        verrez un aperçu avant de valider. Les tenues importées arrivent en <strong>brouillon</strong> : relisez-les puis
        publiez-les depuis la liste des tenues.
      </p>
      <p className="mt-3 text-sm">
        Modèles à télécharger :{" "}
        <a href="/exemple-import.json" download className="underline">exemple-import.json</a> ·{" "}
        <a href="/exemple-import.csv" download className="underline">exemple-import.csv</a>. Le format complet est décrit
        dans le fichier <code>IMPORT.md</code> du projet.
      </p>
      <ImportForm />
    </div>
  );
}
