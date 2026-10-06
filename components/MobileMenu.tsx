"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { PublicAccount } from "@/types/account";

const links = [
  { href: "/servicos", label: "Soluções", text: "Tráfego pago, sites, landing pages, sistemas e automações." },
  { href: "/#como-funciona", label: "Como funciona", text: "Veja como a Zenfy transforma estratégia em execução e acompanhamento." },
  { href: "/portfolio", label: "Projetos", text: "Explore demonstrações e projetos publicados pela equipe." },
  { href: "/sobre", label: "A Zenfy", text: "Conheça a empresa, a Companhia A & P e quem está por trás da operação." },
  { href: "/contato", label: "Contato", text: "Fale com a equipe e explique o que sua empresa precisa." },
];

export default function MobileMenu({ account }: { account: PublicAccount | null }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!mounted) return;
    const element = dialog.current;
    if (open && !element?.open) element?.showModal();
    if (!open && element?.open) element.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const query = window.matchMedia("(min-width: 1280px)");
    const resize = () => { if (query.matches) setOpen(false); };
    query.addEventListener("change", resize);
    return () => {
      document.body.style.overflow = previous;
      query.removeEventListener("change", resize);
    };
  }, [open, mounted]);

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
    <div className="xl:hidden">
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

      {mounted && createPortal(
        <dialog ref={dialog} onClose={() => setOpen(false)} onCancel={() => setOpen(false)}
          aria-label="Navegação da Zenfy"
          className="mobile-menu-dialog fixed inset-0 m-0 h-[100dvh] max-h-[100dvh] w-full max-w-none overflow-y-auto border-0 bg-white p-4 text-[#09113f] xl:hidden">
          <div className="mx-auto mb-4 flex max-w-md items-center justify-between">
            <p className="font-black">Zenfy · Menu</p>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost" autoFocus>Fechar ×</button>
          </div>
          <nav aria-label="Menu mobile">
          <div className="mx-auto max-w-md">
            {account ? (
              <div className="mb-3 rounded-[1.4rem] bg-gradient-to-br from-blue-50 to-violet-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-md">
                    {account.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500"/><p className="truncate font-black text-[#09113f]">{account.name}</p></div>
                    <p className="break-all text-xs text-zinc-500">{account.email}</p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-700">Conta conectada · {account.roleLabel}</p>
                    {account.companyName&&<p className="mt-1 break-words text-xs font-black text-brand">Empresa: {account.companyName}</p>}
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
              <div className="grid gap-2">
              <Link href="/solicitar-orcamento" onClick={() => setOpen(false)} className="btn btn-primary">Pedir orçamento personalizado</Link>
              <button type="button" onClick={logout} disabled={pending} className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-extrabold text-red-600 transition active:scale-[.99] disabled:opacity-60">
                {pending ? "Saindo..." : "Sair da conta"}
              </button>
              </div>
            ) : (
              <>
                <Link href="/solicitar-orcamento" onClick={() => setOpen(false)} className="header-cta w-full">
                  <span>Orçamento personalizado</span>
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
        </dialog>, document.body
      )}
    </div>
  );
}
