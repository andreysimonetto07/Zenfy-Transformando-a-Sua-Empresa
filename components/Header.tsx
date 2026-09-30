import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const links = [["/", "Início"], ["/servicos", "Serviços"], ["/portfolio", "Portfólio"], ["/sobre", "Sobre"], ["/contato", "Contato"], ["/cadastro", "Cadastro"]];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <BrandLogo />
        <nav className="hidden gap-6 text-sm md:flex" aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href} className="font-medium text-zinc-600 transition-colors hover:text-brand">{label}</Link>)}
        </nav>
        <div className="hidden gap-2 md:flex">
          <Link href="/login" className="btn btn-ghost">Entrar</Link>
          <Link href="/solicitar-orcamento" className="btn btn-primary">Solicitar análise</Link>
        </div>
        <details className="relative md:hidden">
          <summary className="btn btn-ghost cursor-pointer list-none" aria-label="Abrir menu">Menu</summary>
          <div className="absolute right-0 mt-2 flex w-60 flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
            {links.map(([href, label]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm hover:bg-mist">{label}</Link>)}
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-mist">Entrar</Link>
            <Link href="/solicitar-orcamento" className="btn btn-primary mt-1">Solicitar análise</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
