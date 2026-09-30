import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/servicos", "/sobre", "/portfolio", "/contato", "/solicitar-orcamento", "/login"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date() }));
}
