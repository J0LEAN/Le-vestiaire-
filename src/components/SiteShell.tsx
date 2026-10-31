import { MobileTabBar } from "@/components/MobileTabBar";
import { PortantProvider } from "@/components/portant/PortantProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

// Habillage commun aux pages publiques et à la page 404 (pas à l'admin).
// La classe lv-on active les animations (coupées si l'appareil demande moins de mouvement).
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <PortantProvider>
      <div className="lv-on relative flex flex-1 flex-col overflow-x-clip">
        {/* Halos de lumière flous, derrière le verre */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <span className="lv-halo absolute -top-32 -left-[8%] h-[620px] w-[620px] rounded-full bg-halo-rose opacity-75 blur-[110px]" />
          <span className="lv-halo absolute top-[30%] -right-[6%] h-[560px] w-[560px] rounded-full bg-halo-lilas opacity-60 blur-[120px]" />
          <span className="lv-halo absolute -bottom-40 left-[30%] h-[600px] w-[600px] rounded-full bg-halo-peche opacity-50 blur-[130px]" />
          <span className="lv-halo absolute right-[4%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-halo-fuchsia opacity-35 blur-[120px]" />
        </div>
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-4 pt-4 pb-32 sm:px-8 sm:pt-6 md:pb-10">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <MobileTabBar />
      </div>
    </PortantProvider>
  );
}
