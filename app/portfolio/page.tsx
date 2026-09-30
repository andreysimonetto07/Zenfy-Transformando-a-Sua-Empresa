import PageHero from "@/components/PageHero";
import PortfolioCard from "@/components/PortfolioCard";
import CtaBanner from "@/components/CtaBanner";
import { getPublishedProjects } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMeta("Portfólio", "Projetos desenvolvidos pela Zenfy.", "/portfolio");

export default async function Portfolio() {
  const projects = await getPublishedProjects();
  return (
    <main>
      <PageHero title="Portfólio" text="Projetos desenvolvidos pela Zenfy." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-mist p-12 text-center text-zinc-600">Novos projetos serão apresentados aqui em breve.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.map((p) => <PortfolioCard key={p.id} p={p} />)}</div>
        )}
      </section>
      <CtaBanner />
    </main>
  );
}
