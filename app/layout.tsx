import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zenfy | Transformando sua empresa",
  description: "Zenfy é uma empresa da Companhia A & P focada em gestão de tráfego, sites, landing pages, sistemas e soluções digitais.",
  icons: {
    icon: [
      { url: "/brand/zenfy/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/zenfy/icon-64.png", sizes: "64x64", type: "image/png" }
    ],
    shortcut: "/brand/zenfy/icon-32.png",
    apple: "/brand/zenfy/icone-zenfy.png"
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
  return <html lang="pt-BR"><body><Header /><PageTransition>{children}</PageTransition><Footer /></body></html>;
}
