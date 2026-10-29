"use server";

import { db } from "@/lib/db";

export type NewsletterState = { ok: boolean; message: string } | null;

/** Inscription à la newsletter (appelée par le formulaire du pied de page). */
export async function subscribe(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  // Champ piège invisible : les robots le remplissent, les humains non.
  if (formData.get("website")) return { ok: true, message: "Merci !" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return { ok: false, message: "Cette adresse email ne semble pas valide." };
  }
  await db.subscriber.upsert({ where: { email }, update: {}, create: { email } });
  return { ok: true, message: "Merci, c'est noté ! À bientôt dans votre boîte mail." };
}
