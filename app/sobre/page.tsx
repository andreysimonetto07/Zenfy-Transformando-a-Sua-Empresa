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

      <section className="relative overflow-hidden">
        <Image src="/brand/zenfy/bg-light.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-80" />
        <div className="absolute inset-0 -z-10 bg-white/35" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <div className="rounded-3xl border border-white/90 bg-white/85 p-8 shadow-xl shadow-blue-950/5 backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Nossa estrutura</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Zenfy, uma empresa da Companhia A &amp; P.</h2>
            <p className="mt-5 leading-relaxed text-zinc-600">A Companhia A &amp; P funciona como a estrutura institucional que pode reunir diferentes empresas e produtos. A Zenfy é sua operação focada em soluções digitais para empresas.</p>
            <p className="mt-4 leading-relaxed text-zinc-600">Essa organização permite que novos projetos — como plataformas, produtos digitais e SaaS — possam nascer dentro da companhia sem limitar a Zenfy ao papel de uma única marca.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white bg-white/95 p-4 shadow-xl">
              <Image src="/brand/zenfy/logo-primary.webp" alt="Logo principal Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl" />
              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Identidade principal</p>
            </div>
            <div className="translate-y-8 rounded-3xl border border-white bg-white/95 p-4 shadow-xl">
              <Image src="/brand/zenfy/logo-growth.webp" alt="Logo Zenfy crescimento" width={1254} height={1254} className="h-auto w-full rounded-2xl" />
              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Crescimento</p>
            </div>
          </div>
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
