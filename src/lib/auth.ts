// Protection de l'espace admin par un mot de passe unique (variable ADMIN_PASSWORD).
// Une fois connecté, le navigateur garde un cookie signé valable 30 jours.
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "vestiaire_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

/** Le mot de passe est-il configuré ? */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// Jeton dérivé du mot de passe : si le mot de passe change, les anciens cookies ne marchent plus.
function token(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update("le-vestiaire-admin").digest("hex");
}

function sameText(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(password: string): boolean {
  return adminConfigured() && sameText(password, process.env.ADMIN_PASSWORD!);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && sameText(value!, token());
}

/** À appeler au début de chaque page ou action admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function startSession(): Promise<void> {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
