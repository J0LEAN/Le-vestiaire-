"use client";

import { useState, useTransition } from "react";
import { checkAllLinks } from "@/actions/links";

export function CheckLinksButton({ total }: { total: number }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        disabled={pending || total === 0}
        className="btn-primary"
        onClick={() =>
          startTransition(async () => {
            setResult(null);
            const r = await checkAllLinks();
            setResult(`${r.checked} lien(s) vérifié(s), ${r.problems} problème(s) trouvé(s).`);
          })
        }
      >
        {pending ? "Vérification en cours…" : "Vérifier les liens"}
      </button>
      {pending && <span className="text-sm text-muted">Cela peut prendre une minute ou deux, ne fermez pas la page.</span>}
      {result && <span className="text-sm">{result}</span>}
    </div>
  );
}
