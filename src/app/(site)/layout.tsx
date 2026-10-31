import { SiteShell } from "@/components/SiteShell";

// Mise en page commune à toutes les pages publiques (pas à l'admin).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
