import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Sobre", "Conheça a Zenfy, empresa da Companhia A & P, e seus fundadores Andrey Simoneto e Pedro Henrique.", "/sobre");

const founders = [
  { name: "Andrey Simoneto", role: "Desenvolvimento Web & Estratégia Digital", text: "Responsável por desenvolvimento de sites, landing pages, sistemas, integrações e soluções digitais." },
  { name: "Pedro Henrique", role: "Estratégia, Marketing & Desenvolvimento de Negócios", text: "Responsável por estratégia comercial, comunicação, marketing e desenvolvimento de oportunidades." },
];

export default function Sobre() {
  return <main>
    <PageHero title="A Zenfy nasceu para transformar presença digital em estrutura de negócio." text="Somos uma empresa da Companhia A & P. Unimos desenvolvimento, estratégia e comunicação para ajudar empresas a crescer com mais presença e organização." />
    <section className="relative overflow-hidden"><div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/brand/zenfy/Zenfy-BackGround2.webp')"}}/><div className="absolute inset-0 bg-white/25"/><div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
      <div className="surface p-7 sm:p-9"><p className="eyebrow">Nossa estrutura</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Zenfy, uma empresa da Companhia A &amp; P.</h2><p className="mt-5 leading-relaxed text-zinc-600">A Companhia A &amp; P funciona como a estrutura institucional que pode reunir diferentes empresas, produtos e projetos. A Zenfy é sua operação voltada a soluções digitais.</p><p className="mt-4 leading-relaxed text-zinc-600">Isso permite que produtos futuros, inclusive SaaS, tenham identidade própria sem perder a ligação com a companhia.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5"><div className="rounded-3xl border border-white bg-white/95 p-2 shadow-2xl sm:p-4"><Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy logo 1" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div><div className="mt-10 rounded-3xl border border-white bg-white/95 p-2 shadow-2xl sm:p-4"><Image src="/brand/zenfy/Zenfy-logo2.webp" alt="Zenfy logo 2" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div></div>
    </div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"><p className="eyebrow">Fundadores</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">Quem está por trás da Zenfy</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{founders.map((f)=><article key={f.name} className="surface p-6 sm:p-8"><div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 text-sm font-semibold text-zinc-400">Foto de {f.name}</div><h3 className="mt-5 text-2xl font-black tracking-tight text-[#09113f]">{f.name}</h3><p className="mt-1 text-sm font-bold text-brand">{f.role}</p><p className="mt-3 leading-relaxed text-zinc-600">{f.text}</p></article>)}</div></section>
    <CtaBanner />
  </main>;
}
