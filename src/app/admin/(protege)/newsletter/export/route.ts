import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Téléchargement de la liste des abonnés au format CSV (compatible Excel).
export async function GET() {
  if (!(await isAdmin())) return new Response("Accès refusé", { status: 401 });

  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "asc" } });
  const lines = [
    "email;date_inscription",
    // (un email commençant par = + - @ est neutralisé pour qu'Excel ne l'exécute pas comme une formule)
    ...subscribers.map((s) => `${/^[=+\-@]/.test(s.email) ? "'" : ""}${s.email};${s.createdAt.toISOString().slice(0, 10)}`),
  ];
  // Le caractère ﻿ indique à Excel que le fichier est en UTF-8 (accents corrects).
  const csv = "﻿" + lines.join("\r\n") + "\r\n";
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
