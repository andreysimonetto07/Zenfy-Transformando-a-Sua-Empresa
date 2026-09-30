import PageHero from "@/components/PageHero";
import PortfolioCard from "@/components/PortfolioCard";
import CtaBanner from "@/components/CtaBanner";
import { getPublishedProjects } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
export const revalidate=300;
export const metadata=pageMeta("Portfólio","Projetos desenvolvidos pela Zenfy.","/portfolio");
export default async function Portfolio(){const projects=await getPublishedProjects();return <main><PageHero title="Projetos construídos para representar negócios de verdade." text="Aqui entram os projetos publicados pela equipe Zenfy diretamente pelo banco de dados."/><section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">{projects.length===0?<div className="surface mx-auto max-w-2xl p-10 text-center"><p className="eyebrow">Portfólio em construção</p><h2 className="mt-3 text-2xl font-black text-[#09113f]">Os próximos projetos vão aparecer aqui.</h2><p className="mt-3 text-zinc-600">Assim que a equipe publicar um projeto no painel, esta página será atualizada automaticamente.</p></div>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map(p=><PortfolioCard key={p.id} p={p}/>)}</div>}</section><CtaBanner/></main>}
