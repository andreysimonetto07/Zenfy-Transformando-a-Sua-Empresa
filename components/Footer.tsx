import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const col = (title: string, items: [string,string][]) => (
  <div><h3 className="mb-4 text-sm font-bold text-white">{title}</h3><ul className="space-y-2.5 text-sm text-blue-100/55">{items.map(([href,label]) => <li key={label}><Link href={href} className="transition hover:text-white">{label}</Link></li>)}</ul></div>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#03072a] text-zinc-400">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(25,211,231,.12),transparent_25rem),radial-gradient(circle_at_90%_80%,rgba(217,70,239,.1),transparent_25rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0"><BrandLogo light /><p className="mt-5 max-w-xs text-sm leading-relaxed text-blue-50/65">Sites, landing pages, sistemas e soluções digitais para empresas que querem crescer com mais presença e profissionalismo.</p><Link href="/contato" className="mt-4 inline-block text-sm font-semibold text-blue-100/80 transition hover:text-white">Fale com a Zenfy</Link><p className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">Uma empresa da Companhia A &amp; P</p></div>
        {col("Navegação", [["/","Início"],["/servicos","Serviços"],["/portfolio","Portfólio"],["/sobre","Sobre"],["/contato","Contato"]])}
        {col("Acesso", [["/login","Entrar"],["/cadastro","Criar conta"],["/recuperar-senha","Recuperar senha"],["/solicitar-orcamento","Pedir orçamento"]])}
        {col("Soluções", [["/servicos","Sites"],["/servicos","Landing Pages"],["/servicos","Sistemas"],["/servicos","Automação"]])}
      </div>
      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-blue-100/40">© {new Date().getFullYear()} Zenfy · Companhia A &amp; P.</div>
    </footer>
  );
}
