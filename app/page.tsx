import Link from "next/link";
import BrandShowcase from "@/components/BrandShowcase";
import TrafficShowcase from "@/components/TrafficShowcase";
import VslSection from "@/components/VslSection";
import PortfolioCard from "@/components/PortfolioCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getFeaturedProjects, getPublishedTestimonials } from "@/lib/portfolio";

const services = [
  ["Gestão de tráfego pago", "Planejamento, acompanhamento e otimização de campanhas para gerar oportunidades com mais controle."],
  ["Landing pages", "Páginas focadas em campanhas, captação de leads e conversão."],
  ["Sites profissionais", "Presença digital sólida, responsiva e pensada para passar confiança."],
  ["Sistemas web", "Painéis, portais e soluções sob medida para organizar sua operação."],
  ["Automação", "Fluxos e integrações para reduzir tarefas repetitivas e ganhar velocidade."],
  ["Criativos & copy", "Comunicação visual e textual mais clara, moderna e persuasiva."],
];

const steps = [
  ["01", "Análise", "Entendemos sua empresa, sua oferta e como as pessoas chegam até você."],
  ["02", "Estratégia", "Definimos páginas, campanhas, públicos e prioridades de acordo com o objetivo."],
  ["03", "Criação", "Construímos landing pages, sites, criativos e estrutura de acompanhamento."],
  ["04", "Campanhas", "Publicamos, acompanhamos os indicadores e registramos o desempenho."],
  ["05", "Otimização", "Usamos os dados para ajustar campanhas e melhorar o processo comercial."],
];

export default async function Home() {
  const [featuredProjects, testimonials] = await Promise.all([getFeaturedProjects(), getPublishedTestimonials()]);
  return (
    <main>
      <section className="zenfy-dark-art relative isolate overflow-hidden text-white">
        <div className="ambient-dot ambient-dot-a" />
        <div className="ambient-dot ambient-dot-b" />

        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-cyan-50 shadow-sm backdrop-blur-md">
              Gestão de tráfego pago · Sites · Sistemas
            </span>
            <h1 className="mt-6 max-w-3xl text-[2.75rem] font-black leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Mais estrutura para <span className="text-cyan-200">atrair, medir e converter.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg lg:text-xl">
              A Zenfy une gestão de tráfego pago, landing pages, sites e soluções web para ajudar sua empresa a gerar oportunidades e acompanhar o que realmente está acontecendo.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar-orcamento" className="btn btn-primary">Solicitar análise gratuita</Link>
              <Link href="/servicos" className="btn btn-dark">Conhecer soluções</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-blue-50/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Meta Ads</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Google Ads</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Landing Pages</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Relatórios</span>
            </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-0">
            <BrandShowcase />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="eyebrow">Gestão de tráfego + estrutura digital</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl lg:text-5xl">
              Não basta anunciar. É preciso saber para onde o clique vai e o que ele gera.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-zinc-600">
              Por isso a Zenfy trabalha campanhas junto com landing pages, sites e acompanhamento de métricas. O cliente pode visualizar investimento, cliques, leads, CPL e faturamento atribuído no próprio portal.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["Campanhas acompanhadas", "Relatórios organizados por período e plataforma."],
                ["Landing pages", "Estrutura preparada para receber o tráfego das campanhas."],
                ["Leads e CPL", "Indicadores claros para acompanhar geração de oportunidades."],
                ["Portal do cliente", "Mensagens, suporte, sites, projetos e faturamento em um só lugar."],
              ].map(([title,text]) => <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"><p className="font-black text-[#09113f]">{title}</p><p className="mt-1 text-sm leading-relaxed text-zinc-500">{text}</p></div>)}
            </div>
          </div>
          <TrafficShowcase />
        </div>
      </section>

      <VslSection />

      <section className="border-y border-zinc-100 bg-[#f8fbff]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">O que a Zenfy constrói</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl lg:text-5xl">
              Tudo conectado ao objetivo comercial da empresa.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([title,text],index) => (
              <article key={title} className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl brand-gradient text-xs font-black text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                  {String(index+1).padStart(2,"0")}
                </span>
                <h3 className="mt-5 text-xl font-black tracking-tight text-[#09113f]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="zenfy-light-art relative overflow-hidden border-b border-blue-100/80">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="surface max-w-3xl p-7 sm:p-10">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">
              Da estratégia aos dados da campanha.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(([n,title,text]) => (
              <article key={n} className="rounded-[1.5rem] border border-white bg-white p-5 shadow-xl shadow-blue-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <span className="brand-text text-xl font-black">{n}</span>
                <h3 className="mt-3 font-black text-[#09113f]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="surface overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="zenfy-light-art relative flex min-h-[390px] items-center justify-center p-7 sm:min-h-[470px] sm:p-10">
              <BrandShowcase compact />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="eyebrow">Companhia A &amp; P</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">
                Zenfy hoje. Mais vendas amanhã.
              </h2>
              <p className="mt-5 leading-relaxed text-zinc-600">
                A Zenfy é uma empresa da Companhia A &amp; P e combina mídia paga, páginas, sistemas e atendimento para transformar presença digital em uma operação mais organizada.
              </p>
              <Link href="/sobre" className="btn btn-ghost mt-7 w-full sm:w-fit">Conhecer a estrutura →</Link>
            </div>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Projetos e cases</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Trabalhos reais publicados pela equipe Zenfy.</h2>
            </div>
            <Link href="/portfolio" className="btn btn-ghost">Ver portfólio completo →</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project)=><PortfolioCard key={project.id} p={project} />)}
          </div>
        </section>
      )}

      <TestimonialsSection testimonials={testimonials.filter((item)=>item.featured)} />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="zenfy-dark-art relative overflow-hidden rounded-[2rem] p-7 text-white shadow-2xl sm:p-10 lg:p-14">
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Próximo passo</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Quer anunciar com uma estrutura que permita acompanhar os resultados?
            </h2>
            <p className="mt-4 max-w-xl text-blue-50/90">Conte sobre sua empresa, sua oferta e como você vende hoje. A Zenfy analisa o cenário e indica um caminho inicial.</p>
            <Link href="/solicitar-orcamento" className="btn btn-primary mt-7 w-full sm:w-auto">Solicitar análise gratuita</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
