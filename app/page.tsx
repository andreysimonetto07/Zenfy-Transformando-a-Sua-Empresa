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
      <section className="relative isolate overflow-hidden bg-[#06114f] text-white">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020624]/92 via-[#06114f]/55 to-[#06114f]/5" />
        <div className="mx-auto grid min-h-[720px] max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.08fr_.92fr] md:py-28">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-50 shadow-sm backdrop-blur-md">Uma empresa da Companhia A &amp; P</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] drop-shadow-sm md:text-7xl">Transformando sua empresa no digital.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-blue-50/90 md:text-xl">A Zenfy cria sites, landing pages, sistemas e estruturas digitais que ajudam empresas a transmitir confiança, organizar processos e gerar novas oportunidades.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/solicitar-orcamento" className="btn btn-primary shadow-lg shadow-blue-950/20">Solicitar análise gratuita</Link>
              <Link href="/servicos" className="btn border border-white/25 bg-white/10 text-white hover:bg-white/15">Conhecer serviços</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px] md:mx-0 md:justify-self-end">
            <div className="rounded-[2rem] border border-white/25 bg-white/95 p-5 shadow-2xl shadow-blue-950/40 backdrop-blur">
              <Image src="/brand/zenfy/logo-primary.webp" alt="Logo principal Zenfy" width={1254} height={1254} priority className="h-auto w-full rounded-2xl" />
            </div>
            <div className="absolute -bottom-7 -right-2 w-[44%] rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl shadow-blue-950/30 sm:-right-8">
              <Image src="/brand/zenfy/logo-growth.webp" alt="Logo alternativa Zenfy" width={1254} height={1254} className="h-auto w-full rounded-xl" />
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

      <section className="relative overflow-hidden border-y border-blue-100 bg-[#eef8ff]">
        <Image src="/brand/zenfy/bg-light.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-95" />
        <div className="absolute inset-0 bg-white/15" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="max-w-2xl rounded-3xl border border-white/90 bg-white/80 p-7 shadow-xl shadow-blue-950/10 backdrop-blur-lg md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Nosso processo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Da ideia à publicação, com clareza em cada etapa.</h2>
            <p className="mt-4 text-zinc-600">O background claro faz parte da identidade Zenfy e separa visualmente o processo sem perder leveza.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {steps.map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-white/90 bg-white/88 p-6 shadow-lg shadow-blue-950/5 backdrop-blur-md">
                <span className="text-sm font-extrabold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-blue-950/5">
          <div className="grid md:grid-cols-[1fr_1.05fr]">
            <div className="relative min-h-[420px] overflow-hidden bg-[#f5fbff] p-6">
              <Image src="/brand/zenfy/bg-light.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-75" />
              <div className="absolute inset-0 bg-white/25" />
              <div className="relative grid h-full grid-cols-2 items-center gap-4">
                <div className="rounded-2xl border border-white bg-white/95 p-3 shadow-xl">
                  <Image src="/brand/zenfy/logo-primary.webp" alt="Logo Zenfy em Z" width={1254} height={1254} className="h-auto w-full rounded-xl" />
                </div>
                <div className="translate-y-8 rounded-2xl border border-white bg-white/95 p-3 shadow-xl">
                  <Image src="/brand/zenfy/logo-growth.webp" alt="Logo Zenfy com seta de crescimento" width={1254} height={1254} className="h-auto w-full rounded-xl" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Companhia A &amp; P</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Duas assinaturas visuais, uma única marca.</h2>
              <p className="mt-5 leading-relaxed text-zinc-600">A Zenfy integra a Companhia A &amp; P. As duas versões da identidade aparecem no site de forma complementar: uma reforça a marca e a outra representa movimento, crescimento e evolução.</p>
              <p className="mt-4 leading-relaxed text-zinc-600">Essa estrutura também deixa a Companhia A &amp; P preparada para reunir novos produtos, empresas e SaaS no futuro.</p>
              <Link href="/sobre" className="mt-7 font-semibold text-brand hover:underline">Conheça a Zenfy e a Companhia A &amp; P →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-10 text-white shadow-2xl shadow-blue-950/15 md:p-14">
          <Image src="/brand/zenfy/bg-dark.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020624]/95 via-[#06114f]/68 to-transparent" />
          <div className="relative">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">Vamos analisar como sua empresa pode se apresentar melhor no digital?</h2>
            <p className="mt-4 max-w-xl text-blue-50/90">Conte sobre seu negócio. A Zenfy identifica oportunidades e mostra um caminho inicial para fortalecer sua presença digital.</p>
            <Link href="/solicitar-orcamento" className="btn btn-primary mt-8">Solicitar análise gratuita</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
