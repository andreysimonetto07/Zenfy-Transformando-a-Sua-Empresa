import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MobileMenu from "@/components/MobileMenu";

const links = [
  ["/", "Início"],
  ["/servicos", "Serviços"],
  ["/portfolio", "Portfólio"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-zinc-200/70 bg-white shadow-sm shadow-blue-950/[0.03]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map(([href,label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-zinc-600 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-brand"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login" className="btn btn-ghost">Entrar</Link>
          <Link href="/cadastro" className="btn btn-primary">Criar conta</Link>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
