"use client";

import { useActionState } from "react";
import { login } from "@/actions/admin";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 space-y-4 border border-line bg-paper p-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Mot de passe</span>
        <input name="password" type="password" required autoFocus className="field" autoComplete="current-password" />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
