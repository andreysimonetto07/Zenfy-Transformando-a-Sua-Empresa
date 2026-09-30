import Image from "next/image";
import Link from "next/link";

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
      <section className="relative isolate overflow-hidden bg-[#06114f] text-white">
        <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('/brand/zenfy/Zenfy-BackGround1.webp')" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020624]/95 via-[#06114f]/65 to-[#06114f]/15" />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-cyan-50 backdrop-blur-md">Uma empresa da Companhia A &amp; P</span>
            <h1 className="mt-6 max-w-3xl text-[2.75rem] font-black leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Transformando sua empresa <span className="text-cyan-200">no digital.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg lg:text-xl">A Zenfy cria sites, landing pages, sistemas e soluções digitais para empresas que querem transmitir mais confiança, organizar processos e crescer com estrutura.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar-orcamento" className="btn btn-primary">Solicitar análise gratuita</Link>
              <Link href="/servicos" className="btn btn-dark">Conhecer soluções</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px] lg:justify-self-end">
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/20 bg-white/95 p-3 shadow-2xl shadow-blue-950/45 sm:p-5">
              <Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy" width={1254} height={1254} priority className="h-auto w-full rounded-[1.4rem]" />
            </div>
            <div className="absolute -bottom-5 right-1 w-[42%] rounded-2xl border border-white/25 bg-white/95 p-2 shadow-2xl sm:-right-5 sm:-bottom-8">
              <Image src="/brand/zenfy/Zenfy-logo2.webp" alt="Zenfy crescimento" width={1254} height={1254} className="h-auto w-full rounded-xl" />
            </div>
          </div>
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
            <article key={title} className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl brand-gradient text-xs font-black text-white shadow-lg">{String(index+1).padStart(2,"0")}</span>
              <h3 className="mt-5 text-xl font-black tracking-tight text-[#09113f]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-blue-100/80">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/brand/zenfy/Zenfy-BackGround2.webp')" }} />
        <div className="absolute inset-0 bg-white/18" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="surface max-w-3xl p-7 sm:p-10">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Do primeiro contato ao projeto publicado.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(([n,title,text]) => <article key={n} className="rounded-[1.5rem] border border-white/90 bg-white/88 p-5 shadow-xl shadow-blue-950/5 backdrop-blur-md"><span className="brand-text text-xl font-black">{n}</span><h3 className="mt-3 font-black text-[#09113f]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="surface overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[450px]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/brand/zenfy/Zenfy-BackGround2.webp')" }} />
              <div className="absolute inset-0 bg-white/25" />
              <div className="relative flex h-full items-center justify-center gap-3 p-5 sm:gap-5 sm:p-10">
                <div className="w-[48%] rounded-2xl border border-white bg-white/95 p-2 shadow-2xl sm:p-3"><Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy logo 1" width={1254} height={1254} className="h-auto w-full rounded-xl" /></div>
                <div className="mt-12 w-[48%] rounded-2xl border border-white bg-white/95 p-2 shadow-2xl sm:p-3"><Image src="/brand/zenfy/Zenfy-logo2.webp" alt="Zenfy logo 2" width={1254} height={1254} className="h-auto w-full rounded-xl" /></div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="eyebrow">Companhia A &amp; P</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Zenfy hoje. Novos produtos amanhã.</h2>
              <p className="mt-5 leading-relaxed text-zinc-600">A Zenfy é uma empresa da Companhia A &amp; P. Essa estrutura deixa espaço para novos negócios, produtos digitais e SaaS sem misturar tudo em uma única marca.</p>
              <Link href="/sobre" className="btn btn-ghost mt-7 w-full sm:w-fit">Conhecer a estrutura →</Link>
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </main>
  );
}

function Cta() {
  return <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24"><div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-7 text-white shadow-2xl sm:p-10 lg:p-14"><div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/brand/zenfy/Zenfy-BackGround1.webp')"}}/><div className="absolute inset-0 bg-gradient-to-r from-[#020624]/96 via-[#06114f]/76 to-transparent"/><div className="relative"><p className="eyebrow !text-cyan-100">Próximo passo</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Quer ver como sua empresa pode ficar mais profissional no digital?</h2><p className="mt-4 max-w-xl text-blue-50/90">Conte sobre seu negócio e a Zenfy identifica um caminho inicial.</p><Link href="/solicitar-orcamento" className="btn btn-primary mt-7 w-full sm:w-auto">Solicitar análise gratuita</Link></div></div></section>;
}
