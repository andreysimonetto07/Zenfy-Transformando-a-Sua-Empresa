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
      <PageHero title="Trabalhos, cases e resultados construídos pela Zenfy." text="Sites, landing pages, sistemas, edições, criativos e cases reais publicados pela equipe." />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        {projects.length ? (
          <PortfolioFilters projects={projects} />
        ) : (
          <div className="surface mx-auto max-w-2xl p-10 text-center">
            <p className="eyebrow">Portfólio em construção</p>
            <h2 className="mt-3 text-2xl font-black text-[#09113f]">Os próximos projetos vão aparecer aqui.</h2>
            <p className="mt-3 text-zinc-600">A equipe publica apenas trabalhos e resultados reais.</p>
          </div>
        )}
      </section>

      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner />
    </main>
  );
}
