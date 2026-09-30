"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PublicAccount } from "@/types/account";

const links = [
  ["/", "Início"],
  ["/servicos", "Serviços"],
  ["/portfolio", "Portfólio"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
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
      await Promise.race([
        createClient().auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
      ]);
    } catch {
      // Força uma nova navegação para nunca deixar o botão travado em "Saindo...".
    } finally {
      setOpen(false);
      window.location.assign("/");
    }
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-md transition duration-200 active:scale-95"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span className="relative h-5 w-6">
          <span className={`absolute left-0 top-0.5 h-0.5 w-6 rounded bg-[#09113f] transition-all duration-300 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[9px] h-0.5 rounded bg-[#09113f] transition-all duration-300 ${open ? "w-0 opacity-0" : "w-6 opacity-100"}`} />
          <span className={`absolute bottom-0.5 left-0 h-0.5 w-6 rounded bg-[#09113f] transition-all duration-300 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </span>
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[68px] z-40 transition-opacity duration-200 ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-[#020624]/35" />

        <nav className={`absolute left-0 right-0 top-0 max-h-[calc(100vh-68px)] overflow-y-auto border-t border-zinc-100 bg-white px-4 pb-5 pt-4 shadow-2xl shadow-blue-950/15 transition-all duration-300 ease-out ${open ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`} aria-label="Menu mobile">
          <div className="mx-auto max-w-md">
            {account ? (
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 p-4">
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
                <Link
                  href={account.dashboardHref}
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm font-extrabold text-[#09113f] shadow-sm"
                >
                  <span>{account.role === "client" ? "Abrir minha área" : "Abrir painel administrativo"}</span>
                  <span className="text-brand">→</span>
                </Link>
              </div>
            ) : (
              <div className="mb-3 px-2">
                <p className="text-[11px] font-black uppercase tracking-[.18em] text-brand">Navegação</p>
                <p className="mt-1 text-xs text-zinc-400">Zenfy · Companhia A &amp; P</p>
              </div>
            )}

            <div className="grid gap-1">
              {links.map(([href, label]) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold transition duration-200 ${active ? "bg-blue-50 text-brand" : "text-[#09113f] hover:bg-zinc-50"}`}
                  >
                    <span>{label}</span>
                    <span className={active ? "text-brand" : "text-zinc-300"}>→</span>
                  </Link>
                );
              })}
            </div>

            <div className="my-3 h-px bg-zinc-100" />

            {account ? (
              <button
                type="button"
                onClick={logout}
                disabled={pending}
                className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-extrabold text-red-600 transition active:scale-[.99] disabled:opacity-60"
              >
                {pending ? "Saindo..." : "Sair da conta"}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">Entrar</Link>
                <Link href="/cadastro" onClick={() => setOpen(false)} className="btn btn-primary">Criar conta</Link>
              </div>
            )}

            <Link href="/solicitar-orcamento" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center rounded-xl py-2 text-sm font-extrabold text-brand transition hover:bg-blue-50">
              Solicitar análise gratuita →
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
