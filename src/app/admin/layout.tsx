import type { Metadata } from "next";

// L'admin ne doit jamais apparaître dans Google.
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 bg-mist">{children}</div>;
}
