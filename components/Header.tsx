import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MobileMenu from "@/components/MobileMenu";
import AccountMenu from "@/components/AccountMenu";
import DesktopNavigation from "@/components/DesktopNavigation";
import { getCurrentAccount } from "@/lib/account";

export default async function Header() {
  const account = await getCurrentAccount();
  const firstName = account?.name.trim().split(/\s+/)[0] || "";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/92 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-[76px] sm:gap-4 sm:px-6">
        <div className="sm:hidden">
          <BrandLogo compact />
        </div>
        <div className="hidden sm:block">
          <BrandLogo />
        </div>

        <DesktopNavigation />

        <div className="hidden items-center gap-2 sm:flex">
          {account ? (
            <AccountMenu account={account} />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl px-4 py-3 text-sm font-extrabold text-zinc-600 transition hover:bg-zinc-100 hover:text-[#09113f]"
              >
                Área do cliente
              </Link>
              <Link href="/solicitar-orcamento" className="header-cta">
                <span>Pedir orçamento</span>
                <span className="header-cta-arrow">→</span>
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:ml-0">
          {account && (
            <Link
              href={account.dashboardHref}
              className="flex min-w-0 items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/85 px-2 py-1.5 shadow-sm sm:hidden"
              aria-label={`Conta conectada: ${account.name}`}
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl brand-gradient text-[10px] font-black text-white">
                {account.initials}
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-50 bg-emerald-500" />
              </span>
              <span className="min-w-0 pr-1">
                <span className="block text-[9px] font-black uppercase tracking-[.08em] text-emerald-700">Conectado</span>
                <span className="block max-w-[74px] truncate text-xs font-black text-[#09113f]">{firstName}</span>
              </span>
            </Link>
          )}

          <MobileMenu account={account} />
        </div>
      </div>
    </header>
  );
}
