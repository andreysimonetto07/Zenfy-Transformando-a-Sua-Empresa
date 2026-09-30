import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const col = (title: string, items: [string, string][]) => (
  <div>
    <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
    <ul className="space-y-2 text-sm text-zinc-400">
      {items.map(([href, label]) => <li key={label}><Link href={href} className="transition-colors hover:text-white">{label}</Link></li>)}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#050b2d] text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <BrandLogo light />
          <p className="mt-4 text-sm text-zinc-300">Transformando sua empresa com presença digital, estratégia e tecnologia.</p>
          <p className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">Uma empresa da Companhia A &amp; P</p>
        </div>
        {col("Navegação", [["/", "Início"], ["/servicos", "Serviços"], ["/portfolio", "Portfólio"], ["/sobre", "Sobre"], ["/contato", "Contato"], ["/login", "Área do Cliente"]])}
        {col("Serviços", [["/servicos", "Sites"], ["/servicos", "Landing Pages"], ["/servicos", "Desenvolvimento Web"], ["/servicos", "Tráfego Pago"], ["/servicos", "Automação"], ["/servicos", "Copywriting"]])}
        {col("Contato", [["/contato", "WhatsApp"], ["/contato", "E-mail"], ["/contato", "Instagram"]])}
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Zenfy. Uma empresa da Companhia A &amp; P. Todos os direitos reservados.</div>
    </footer>
  );
}
