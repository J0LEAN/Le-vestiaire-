import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-center font-serif text-3xl">Le Vestiaire — Admin</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-8 border border-danger bg-paper p-4 text-sm">
          L&apos;admin est désactivé : la variable d&apos;environnement <code>ADMIN_PASSWORD</code> n&apos;est pas
          définie. Ajoute-la (voir le README), puis redémarre le site.
        </p>
      )}
    </div>
  );
}
