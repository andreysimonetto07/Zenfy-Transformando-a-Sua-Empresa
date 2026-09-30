import Image from "next/image";
import Link from "next/link";

const services = [
  ["Desenvolvimento de Sites", "Sites profissionais, rápidos e responsivos para apresentar sua empresa com credibilidade."],
  ["Landing Pages", "Páginas estratégicas para campanhas, captação de leads e conversão."],
  ["Desenvolvimento Web", "Sistemas, painéis e aplicações sob medida para organizar processos e operações."],
  ["Tráfego Pago", "Campanhas digitais planejadas para levar sua oferta até as pessoas certas."],
  ["Automação", "Integrações e fluxos que reduzem tarefas repetitivas e aceleram o atendimento."],
  ["Copy & Criativos", "Comunicação e materiais visuais pensados para apresentar sua oferta com clareza."],
];
const steps = [
  ["Análise", "Entendemos sua empresa, mercado, público e objetivos."],
  ["Estratégia", "Definimos prioridades e uma solução adequada ao momento do negócio."],
  ["Desenvolvimento", "Construímos com tecnologia, design e foco na experiência do cliente."],
  ["Publicação", "Configuramos, validamos e colocamos toda a estrutura no ar."],
  ["Evolução", "Acompanhamos o projeto e identificamos novas oportunidades de melhoria."],
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[690px] overflow-hidden bg-[#06114f] text-white">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#040a32]/95 via-[#06114f]/82 to-[#06114f]/20" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-[1.1fr_.9fr] md:py-32">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100 backdrop-blur">Uma empresa da Companhia A &amp; P</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] md:text-7xl">Transformando sua empresa no digital.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-blue-50/85 md:text-xl">A Zenfy cria sites, landing pages, sistemas e estruturas digitais que ajudam empresas a transmitir confiança, organizar processos e gerar novas oportunidades.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/solicitar-orcamento" className="btn btn-primary shadow-lg shadow-blue-950/20">Solicitar análise gratuita</Link>
              <Link href="/servicos" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">Conhecer serviços</Link>
            </div>
          </div>
          <div className="hidden justify-self-end md:block">
            <div className="w-[390px] rounded-[2rem] border border-white/15 bg-white/95 p-7 shadow-2xl shadow-blue-950/35 backdrop-blur">
              <Image src="/brand/zenfy/logo-primary.webp" alt="Zenfy" width={1254} height={1254} priority className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">O que fazemos</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Estrutura digital para empresas que querem crescer com mais profissionalismo.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([t, d], i) => (
            <article key={t} className="group rounded-2xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
              <span className="text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-blue-100/70 bg-[#f7fbff]">
        <Image src="/brand/zenfy/bg-light.webp" alt="" fill sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-white/45" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="max-w-2xl rounded-3xl border border-white/80 bg-white/80 p-7 shadow-xl shadow-blue-950/5 backdrop-blur-md md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Nosso processo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Da ideia à publicação, com clareza em cada etapa.</h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {steps.map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
                <span className="text-sm font-extrabold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-24">
        <div className="grid overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-blue-950/5 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[360px] bg-zinc-50 p-8">
            <Image src="/brand/zenfy/logo-growth.webp" alt="Identidade visual Zenfy" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-contain p-8" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Companhia A &amp; P</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Zenfy é a frente digital de uma estrutura pensada para criar novos negócios.</h2>
            <p className="mt-5 leading-relaxed text-zinc-600">A Zenfy integra a Companhia A &amp; P. Essa estrutura permite que, no futuro, a companhia reúna novas empresas, produtos e SaaS sob a mesma visão de tecnologia e crescimento.</p>
            <Link href="/sobre" className="mt-7 font-semibold text-brand hover:underline">Conheça a Zenfy e a Companhia A &amp; P →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-10 text-white md:p-14">
          <Image src="/brand/zenfy/bg-dark.webp" alt="" fill sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06114f] via-[#06114f]/85 to-transparent" />
          <div className="relative">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">Vamos analisar como sua empresa pode se apresentar melhor no digital?</h2>
            <p className="mt-4 max-w-xl text-blue-50/80">Conte sobre seu negócio. A Zenfy identifica oportunidades e mostra um caminho inicial para fortalecer sua presença digital.</p>
            <Link href="/solicitar-orcamento" className="btn btn-primary mt-8">Solicitar análise gratuita</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
