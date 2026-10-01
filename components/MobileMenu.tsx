"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { PublicAccount } from "@/types/account";

const links = [
  { href: "/servicos", label: "Soluções", text: "Tráfego pago, sites, landing pages, sistemas e automações." },
  { href: "/#como-funciona", label: "Como funciona", text: "Veja como a Zenfy transforma estratégia em execução e acompanhamento." },
  { href: "/portfolio", label: "Projetos & Cases", text: "Conheça trabalhos, resultados e projetos publicados pela equipe." },
  { href: "/sobre", label: "A Zenfy", text: "Conheça a empresa, a Companhia A & P e quem está por trás da operação." },
  { href: "/contato", label: "Contato", text: "Fale com a equipe e explique o que sua empresa precisa." },
];

export default function MobileMenu({ account }: { account: PublicAccount | null }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/auth/logout", { method: "POST", cache: "no-store", credentials: "include" });
    } finally {
      setOpen(false);
      window.location.replace("/?logout=1");
    }
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-md transition duration-300 active:scale-95 ${open ? "border-blue-200 bg-[#06114f] text-white shadow-blue-950/20" : "border-zinc-200 bg-white text-[#09113f]"}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span className="relative h-5 w-6">
          <span className={`absolute left-0 top-0.5 h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[9px] h-0.5 rounded bg-current transition-all duration-300 ${open ? "w-0 opacity-0" : "w-6 opacity-100"}`} />
          <span className={`absolute bottom-0.5 left-0 h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </span>
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[76px] z-40 transition-opacity duration-250 ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-[#020624]/45 backdrop-blur-[2px]" />

        <nav
          className={`absolute left-3 right-3 top-3 max-h-[calc(100vh-92px)] overflow-y-auto rounded-[1.75rem] border border-white/60 bg-white p-3 shadow-[0_28px_90px_rgba(2,6,36,.28)] transition-all duration-300 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-[.98] opacity-0"}`}
          aria-label="Menu mobile"
        >
          <div className="mx-auto max-w-md">
            {account ? (
              <div className="mb-3 rounded-[1.4rem] bg-gradient-to-br from-blue-50 to-violet-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-md">
                    {account.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-[#09113f]">{account.name}</p>
                    <p className="truncate text-xs text-zinc-500">{account.email}</p>
                    <p className="mt-1 text-[11px] font-bold text-brand">{account.roleLabel}</p>
                  </div>
                </div>
                <Link href={account.dashboardHref} onClick={() => setOpen(false)} className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm font-extrabold text-[#09113f] shadow-sm">
                  <span>{account.role === "client" ? "Abrir minha área" : "Abrir painel administrativo"}</span>
                  <span className="text-brand">→</span>
                </Link>
              </div>
            ) : (
              <div className="mb-3 overflow-hidden rounded-[1.4rem] bg-[#06114f] p-5 text-white">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-100">Zenfy · Estrutura digital</p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Do anúncio ao resultado, tudo precisa estar conectado.</h2>
                <p className="mt-2 text-sm leading-relaxed text-blue-50/70">Gestão de tráfego, páginas, sistemas e acompanhamento para empresas que querem crescer com mais clareza.</p>
              </div>
            )}

            <div className="grid gap-2">
              {links.map((item) => {
                const active = item.href.startsWith("/#") ? false : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group rounded-[1.35rem] border px-4 py-3.5 transition duration-200 ${active ? "border-blue-200 bg-blue-50" : "border-zinc-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`font-black ${active ? "text-brand" : "text-[#09113f]"}`}>{item.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.text}</p>
                      </div>
                      <span className={`mt-1 text-sm font-black transition-transform duration-200 group-hover:translate-x-1 ${active ? "text-brand" : "text-zinc-300"}`}>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="my-3 h-px bg-zinc-100" />

            {account ? (
              <button type="button" onClick={logout} disabled={pending} className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-extrabold text-red-600 transition active:scale-[.99] disabled:opacity-60">
                {pending ? "Saindo..." : "Sair da conta"}
              </button>
            ) : (
              <>
                <Link href="/solicitar-orcamento" onClick={() => setOpen(false)} className="header-cta w-full">
                  <span>Solicitar análise gratuita</span>
                  <span className="header-cta-arrow">→</span>
                </Link>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">Área do cliente</Link>
                  <Link href="/cadastro" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-center text-sm font-extrabold text-zinc-500 transition hover:bg-zinc-100 hover:text-[#09113f]">Criar acesso</Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
