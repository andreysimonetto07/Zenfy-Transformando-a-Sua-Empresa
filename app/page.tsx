import Link from "next/link";
import BrandShowcase from "@/components/BrandShowcase";
import PublicPreviewShowcase from "@/components/PublicPreviewShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getPublishedTestimonials } from "@/lib/portfolio";

export const revalidate = 300;

const pillars=[
  {
    n:"01",
    title:"Tráfego Pago",
    text:"Campanhas com acompanhamento claro de investimento, leads, custo por lead e evolução dos resultados.",
    href:"/servicos",
    action:"Entender o tráfego",
  },
  {
    n:"02",
    title:"Sites & Landing Pages",
    text:"Páginas profissionais para apresentar sua empresa, receber campanhas e transformar interesse em contato.",
    href:"/portfolio",
    action:"Ver projetos",
  },
  {
    n:"03",
    title:"Sistemas & Automação",
    text:"Soluções digitais sob medida para organizar processos, atendimento e operação da empresa.",
    href:"/servicos",
    action:"Conhecer soluções",
  },
];

const steps=[
  ["01","Entendemos","A Zenfy analisa sua empresa, seu objetivo e o que já existe hoje."],
  ["02","Construímos","Organizamos a estratégia, campanhas, páginas ou sistema necessário."],
  ["03","Acompanhamos","Você acompanha o que está sendo feito e os principais resultados no portal."],
];

export default async function Home(){
  const testimonials=await getPublishedTestimonials();

  return <main>
    <section className="zenfy-dark-art relative isolate overflow-hidden text-white">
      <div className="ambient-dot ambient-dot-a"/>
      <div className="ambient-dot ambient-dot-b"/>
      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
        <div>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.16em] text-cyan-50 backdrop-blur-md">
            Tráfego · Sites · Sistemas
          </span>
          <h1 className="mt-6 max-w-3xl text-[2.7rem] font-black leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Estrutura digital para sua empresa <span className="text-cyan-200">crescer com mais clareza.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-50/85 sm:text-lg">
            A Zenfy conecta campanhas, páginas e tecnologia para sua empresa atrair oportunidades, passar mais confiança e acompanhar o que realmente está acontecendo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/solicitar-orcamento" className="header-cta w-full sm:w-auto"><span>Solicitar análise gratuita</span><span className="header-cta-arrow">→</span></Link>
            <Link href="/portfolio" className="btn btn-dark">Ver projetos criados</Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-blue-50/70">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Meta Ads</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Landing Pages</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Sites</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Portal do cliente</span>
          </div>
        </div>
        <div className="pb-4 pt-2 lg:pb-0"><BrandShowcase/></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">O que a Zenfy resolve</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl lg:text-5xl">Menos improviso. Mais estrutura para vender e crescer.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-600">Você não precisa entender todos os termos técnicos. A Zenfy organiza a solução de acordo com o objetivo da sua empresa.</p>
        </div>
        <Link href="/servicos" className="btn btn-ghost w-full sm:w-fit">Ver todos os serviços →</Link>
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-3">
        {pillars.map(item=><article key={item.title} className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
          <span className="brand-text text-sm font-black">{item.n}</span>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#09113f]">{item.title}</h3>
          <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-zinc-600">{item.text}</p>
          <Link href={item.href} className="mt-5 inline-flex font-black text-brand transition-transform group-hover:translate-x-1">{item.action} →</Link>
        </article>)}
      </div>
    </section>

    <PublicPreviewShowcase/>

    <section id="como-funciona" className="zenfy-light-art relative scroll-mt-24 overflow-hidden border-y border-blue-100/70">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Um processo simples para você saber o que está acontecendo.</h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {steps.map(([n,title,text])=><article key={n} className="rounded-[1.5rem] border border-white bg-white/90 p-6 shadow-xl shadow-blue-950/5">
            <span className="brand-text text-2xl font-black">{n}</span>
            <h3 className="mt-3 text-xl font-black text-[#09113f]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
          </article>)}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/sobre" className="btn btn-ghost">Conhecer a Zenfy</Link>
          <Link href="/solicitar-orcamento" className="btn btn-primary">Quero analisar minha empresa</Link>
        </div>
      </div>
    </section>

    <TestimonialsSection testimonials={testimonials.filter(item=>item.featured)}/>

    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="zenfy-dark-art relative overflow-hidden rounded-[2rem] p-7 text-white shadow-2xl sm:p-10 lg:p-14">
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Próximo passo</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Quer entender o que faria mais sentido para sua empresa hoje?</h2>
            <p className="mt-4 max-w-xl text-blue-50/80">Conte como sua empresa vende atualmente. A Zenfy analisa o cenário e indica uma direção inicial, sem complicar.</p>
          </div>
          <Link href="/solicitar-orcamento" className="header-cta w-full lg:w-auto"><span>Solicitar análise</span><span className="header-cta-arrow">→</span></Link>
        </div>
      </div>
    </section>
  </main>;
}
