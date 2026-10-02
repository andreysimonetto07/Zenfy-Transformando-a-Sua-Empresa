import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PublicChrome from "@/components/PublicChrome";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zenfy | Transformando sua empresa",
  description: "Zenfy é uma empresa da Companhia A & P focada em gestão de tráfego, sites, landing pages, sistemas e soluções digitais.",
  icons: {
    icon: [
      { url: "/brand/zenfy/icone-zenfy-transparente.png", type: "image/png" }
    ],
    shortcut: "/brand/zenfy/icone-zenfy-transparente.png",
    apple: "/brand/zenfy/icone-zenfy-transparente.png"
  },
  twitter: { card: "summary_large_image", title: "Zenfy | Transformando sua empresa", images: ["/brand/zenfy/Zenfy-BackGround1.webp"] },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zenfy | Transformando sua empresa",
    description: "Gestão de tráfego, sites, landing pages, sistemas e soluções digitais para empresas.",
    type: "website",
    locale: "pt_BR",
    siteName: "Zenfy",
    images: [{ url: "/brand/zenfy/Zenfy-BackGround1.webp", width: 1672, height: 941, alt: "Zenfy" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <PublicChrome><Header /></PublicChrome>
        <PageTransition>{children}</PageTransition>
        <PublicChrome><Footer /></PublicChrome>
      </body>
    </html>
  );
}
