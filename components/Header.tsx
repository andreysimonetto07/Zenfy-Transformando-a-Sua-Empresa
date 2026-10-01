import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MobileMenu from "@/components/MobileMenu";
import AccountMenu from "@/components/AccountMenu";
import DesktopNavigation from "@/components/DesktopNavigation";
import { getCurrentAccount } from "@/lib/account";

export default async function Header() {
  const account = await getCurrentAccount();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/92 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

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
                <span>Solicitar análise</span>
                <span className="header-cta-arrow">→</span>
              </Link>
            </>
          )}
        </div>

        <MobileMenu account={account} />
      </div>
    </header>
  );
}
