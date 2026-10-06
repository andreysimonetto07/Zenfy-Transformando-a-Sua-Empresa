import Link from "next/link";

const simpleLinks = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/portfolio", label: "Projetos & Cases" },
  { href: "/sobre", label: "A Zenfy" },
];

export default function DesktopNavigation() {
  return (
    <nav className="hidden items-center lg:flex" aria-label="Navegação principal">
      <div className="flex items-center gap-1 rounded-2xl border border-zinc-200/80 bg-white/85 p-1.5 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl">
        <div className="group relative">
          <Link
            href="/servicos"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-[#09113f] transition duration-200 hover:bg-blue-50 hover:text-brand"
          >
            Soluções
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="invisible absolute left-1/2 top-[calc(100%+12px)] z-[80] w-[560px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-white p-3 shadow-[0_24px_80px_rgba(2,6,36,.18)]">
              <div className="grid grid-cols-3 gap-2">
                <SolutionCard href="/servicos" eyebrow="Aquisição" title="Tráfego Pago" text="Campanhas, acompanhamento e métricas para gerar oportunidades." />
                <SolutionCard href="/servicos" eyebrow="Conversão" title="Sites & Landing Pages" text="Páginas rápidas, profissionais e preparadas para receber tráfego." />
                <SolutionCard href="/servicos" eyebrow="Estrutura" title="Sistemas & Automação" text="Portais, integrações e processos digitais sob medida." />
              </div>
              <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#06114f] px-4 py-3 text-white">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.14em] text-cyan-100">Estrutura completa</p>
                  <p className="mt-0.5 text-sm font-semibold text-blue-50/80">Tráfego, página e acompanhamento trabalhando juntos.</p>
                </div>
                <Link href="/solicitar-orcamento" className="rounded-xl bg-white px-3 py-2 text-xs font-black text-[#09113f] transition hover:-translate-y-0.5">
                  Pedir orçamento →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {simpleLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-600 transition duration-200 hover:bg-blue-50 hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SolutionCard({ href, eyebrow, title, text }: { href: string; eyebrow: string; title: string; text: string }) {
  return (
    <Link href={href} className="group/card rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70">
      <span className="text-[10px] font-black uppercase tracking-[.14em] text-brand">{eyebrow}</span>
      <p className="mt-1.5 font-black text-[#09113f]">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{text}</p>
      <span className="mt-3 inline-block text-xs font-black text-brand transition-transform duration-200 group-hover/card:translate-x-1">Explorar →</span>
    </Link>
  );
}
