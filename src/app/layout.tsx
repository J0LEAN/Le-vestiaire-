import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { OG_DEFAULTS, SITE } from "@/lib/site";
import "./globals.css";

// Toutes les pages lisent la base de données à chaque visite
// (le contenu publié depuis l'admin apparaît donc immédiatement).
export const dynamic = "force-dynamic";

// Fraunces (titres, axe « SOFT » pour des formes douces) et Nunito (texte et interface)
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "opsz"], style: ["normal", "italic"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

// Balises SEO par défaut (chaque page peut les compléter).
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { ...OG_DEFAULTS, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f6eef3" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
