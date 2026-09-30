import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Sobre", "Conheça a Zenfy, empresa da Companhia A & P, e seus fundadores Andrey Simoneto e Pedro Henrique.", "/sobre");

const founders = [
  { name: "Andrey Simoneto", role: "Desenvolvimento Web & Estratégia Digital", text: "Responsável pelo desenvolvimento de sites, landing pages, sistemas, integrações e soluções digitais." },
  { name: "Pedro Henrique", role: "Estratégia, Marketing & Desenvolvimento de Negócios", text: "Responsável pela estratégia comercial, marketing, comunicação e desenvolvimento de oportunidades para os clientes." },
];

export default function Sobre() {
  return (
    <main>
      <PageHero title="A Zenfy nasceu para transformar presença digital em estrutura de negócio." text="Somos uma empresa da Companhia A & P. Unimos desenvolvimento, estratégia e comunicação para ajudar empresas a se apresentarem melhor, organizarem sua operação digital e criarem novas oportunidades." />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Nossa estrutura</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Zenfy, uma empresa da Companhia A &amp; P.</h2>
          <p className="mt-5 leading-relaxed text-zinc-600">A Companhia A &amp; P funciona como a estrutura institucional que pode reunir diferentes empresas e produtos. A Zenfy é sua operação focada em soluções digitais para empresas.</p>
          <p className="mt-4 leading-relaxed text-zinc-600">Essa organização permite que novos projetos — como plataformas, produtos digitais e SaaS — possam nascer dentro da companhia sem limitar a Zenfy ao papel de uma única marca.</p>
        </div>
        <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-blue-950/5">
          <Image src="/brand/zenfy/logo-growth.webp" alt="Zenfy" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-8" />
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-mist/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Fundadores</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Quem está por trás da Zenfy</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {founders.map((f) => (
              <article key={f.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-gradient-to-br from-blue-50 to-violet-50 text-sm text-zinc-500">Foto de {f.name}</div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight">{f.name}</h3>
                <p className="text-sm font-semibold text-brand">{f.role}</p>
                <p className="mt-3 text-zinc-600">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </main>
  );
}
