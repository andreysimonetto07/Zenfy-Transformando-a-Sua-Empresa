import type { Metadata } from "next";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Zenfy";
export const COMPANY_NAME = "Companhia A & P";

export function pageMeta(title: string, description: string, path: string): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title: full,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: full,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: "website",
      locale: "pt_BR",
      images: [{ url: "/brand/zenfy/bg-dark.webp", width: 1920, height: 1080, alt: "Zenfy" }],
    },
    twitter: { card: "summary_large_image", title: full, description, images: ["/brand/zenfy/bg-dark.webp"] },
  };
}
