/** Bandeau de message (succès ou erreur) dans l'admin. */
export function Notice({ type = "ok", children }: { type?: "ok" | "error"; children: React.ReactNode }) {
  const color = type === "ok" ? "border-success text-success" : "border-danger text-danger";
  return <div className={`mb-6 border-l-4 bg-paper p-4 text-sm ${color}`} role="status">{children}</div>;
}
