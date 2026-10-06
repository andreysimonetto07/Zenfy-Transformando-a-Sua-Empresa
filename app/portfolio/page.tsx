import PublicPreviewShowcase from "@/components/PublicPreviewShowcase";
import PageHero from "@/components/PageHero";
import PortfolioFilters from "@/components/PortfolioFilters";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import { getPublishedProjects, getPublishedTestimonials } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMeta("Portfólio", "Sites, landing pages, sistemas, vídeos, criativos e cases desenvolvidos pela Zenfy.", "/portfolio");

export default async function Portfolio() {
  const [projects, testimonials] = await Promise.all([getPublishedProjects(), getPublishedTestimonials()]);

  return (
    <main>
      <PageHero title="Ideias que ganham forma. Projetos para inspirar sua empresa." text="Explore nossas demonstrações de sites e landing pages. Escolha referências e converse com a Zenfy sobre um projeto feito para seu negócio." />

      <PublicPreviewShowcase />
      {projects.length > 0 && <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow mb-6">Projetos publicados</p>
        <PortfolioFilters projects={projects} />
      </section>}

      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner />
    </main>
  );
}
