import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zenfy | Transformando sua empresa",
  description: "Zenfy é uma empresa da Companhia A & P focada em sites, landing pages, sistemas e soluções digitais para transformar empresas.",
  twitter: { card: "summary_large_image", title: "Zenfy | Transformando sua empresa", images: ["/brand/zenfy/Zenfy-BackGround1.webp"] },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zenfy | Transformando sua empresa",
    description: "Sites, landing pages, sistemas e soluções digitais para empresas.",
    type: "website",
    locale: "pt_BR",
    siteName: "Zenfy",
    images: [{ url: "/brand/zenfy/Zenfy-BackGround1.webp", width: 1672, height: 941, alt: "Zenfy" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><Header /><PageTransition>{children}</PageTransition><Footer /></body></html>;
}
