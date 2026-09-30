import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const links = [["/", "Início"], ["/servicos", "Serviços"], ["/portfolio", "Portfólio"], ["/sobre", "Sobre"], ["/contato", "Contato"]];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/88 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLogo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map(([href,label]) => <Link key={href} href={href} className="rounded-xl px-3.5 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-blue-50 hover:text-brand">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login" className="btn btn-ghost">Entrar</Link>
          <Link href="/cadastro" className="btn btn-primary">Criar conta</Link>
        </div>
        <details className="relative sm:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-zinc-200 bg-white text-xl text-[#09113f] shadow-sm" aria-label="Abrir menu">☰</summary>
          <div className="absolute right-0 mt-3 w-[min(82vw,290px)] rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-blue-950/15">
            {links.map(([href,label]) => <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-blue-50">{label}</Link>)}
            <div className="my-2 h-px bg-zinc-100" />
            <Link href="/login" className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-blue-50">Entrar</Link>
            <Link href="/cadastro" className="btn btn-primary mt-1 w-full">Criar conta</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
