import Link from "next/link";
import BrandShowcase from "@/components/BrandShowcase";

const services = [
  ["Sites profissionais", "Presença digital sólida, responsiva e pensada para passar confiança."],
  ["Landing pages", "Páginas focadas em campanhas, captação de leads e conversão."],
  ["Sistemas web", "Painéis, portais e soluções sob medida para organizar sua operação."],
  ["Automação", "Fluxos e integrações para reduzir tarefas repetitivas e ganhar velocidade."],
  ["Tráfego pago", "Campanhas para colocar sua oferta na frente das pessoas certas."],
  ["Criativos & copy", "Comunicação visual e textual mais clara, moderna e persuasiva."],
];

const steps = [
  ["01", "Análise", "Entendemos sua empresa e o que realmente precisa melhorar."],
  ["02", "Estratégia", "Definimos uma direção clara antes de começar a construir."],
  ["03", "Criação", "Design, tecnologia e conteúdo trabalhando juntos."],
  ["04", "Publicação", "Validamos e colocamos sua estrutura digital no ar."],
  ["05", "Evolução", "Acompanhamos e abrimos espaço para próximos produtos e melhorias."],
];

export default function Home() {
  return (
    <main>
      <section className="zenfy-dark-art relative isolate overflow-hidden text-white">
        <div className="ambient-dot ambient-dot-a" />
        <div className="ambient-dot ambient-dot-b" />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-cyan-50 shadow-sm backdrop-blur-md">Uma empresa da Companhia A &amp; P</span>
            <h1 className="mt-6 max-w-3xl text-[2.75rem] font-black leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Transformando sua empresa <span className="text-cyan-200">no digital.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg lg:text-xl">A Zenfy cria sites, landing pages, sistemas e soluções digitais para empresas que querem transmitir mais confiança, organizar processos e crescer com estrutura.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar-orcamento" className="btn btn-primary">Solicitar análise gratuita</Link>
              <Link href="/servicos" className="btn btn-dark">Conhecer soluções</Link>
            </div>
          </div>
          <div className="pb-8 pt-2 lg:pb-0"><BrandShowcase /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">O que a Zenfy constrói</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl lg:text-5xl">Estrutura digital bonita por fora e funcional por dentro.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-600">Não é só “ter um site”. A ideia é criar uma presença que faça sentido para o negócio e possa evoluir junto com ele.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title,text],index) => (
            <article key={title} className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl brand-gradient text-xs font-black text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-105">{String(index+1).padStart(2,"0")}</span>
              <h3 className="mt-5 text-xl font-black tracking-tight text-[#09113f]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="zenfy-light-art relative overflow-hidden border-y border-blue-100/80">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="surface max-w-3xl p-7 sm:p-10">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Do primeiro contato ao projeto publicado.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(([n,title,text]) => <article key={n} className="rounded-[1.5rem] border border-white/90 bg-white/88 p-5 shadow-xl shadow-blue-950/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"><span className="brand-text text-xl font-black">{n}</span><h3 className="mt-3 font-black text-[#09113f]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="surface overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="zenfy-light-art relative flex min-h-[390px] items-center justify-center p-7 sm:min-h-[470px] sm:p-10"><BrandShowcase compact /></div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="eyebrow">Companhia A &amp; P</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Zenfy hoje. Novos produtos amanhã.</h2>
              <p className="mt-5 leading-relaxed text-zinc-600">A Zenfy é uma empresa da Companhia A &amp; P. Essa estrutura deixa espaço para novos negócios, produtos digitais e SaaS sem misturar tudo em uma única marca.</p>
              <Link href="/sobre" className="btn btn-ghost mt-7 w-full sm:w-fit">Conhecer a estrutura →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="zenfy-dark-art relative overflow-hidden rounded-[2rem] p-7 text-white shadow-2xl sm:p-10 lg:p-14">
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Próximo passo</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Quer ver como sua empresa pode ficar mais profissional no digital?</h2>
            <p className="mt-4 max-w-xl text-blue-50/90">Conte sobre seu negócio e a Zenfy identifica um caminho inicial.</p>
            <Link href="/solicitar-orcamento" className="btn btn-primary mt-7 w-full sm:w-auto">Solicitar análise gratuita</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
