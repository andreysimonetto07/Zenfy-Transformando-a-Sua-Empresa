"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Início"],
  ["/servicos", "Serviços"],
  ["/portfolio", "Portfólio"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
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
        className={`fixed inset-x-0 bottom-0 top-[68px] z-40 transition-opacity duration-250 ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-[#020624]/35"
        />

        <nav
          className={`absolute left-0 right-0 top-0 border-t border-zinc-100 bg-white px-4 pb-5 pt-4 shadow-2xl shadow-blue-950/15 transition-all duration-300 ease-out ${open ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
          aria-label="Menu mobile"
        >
          <div className="mx-auto max-w-md">
            <div className="mb-3 px-2">
              <p className="text-[11px] font-black uppercase tracking-[.18em] text-brand">Navegação</p>
              <p className="mt-1 text-xs text-zinc-400">Zenfy · Companhia A &amp; P</p>
            </div>

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
                    <span className={`transition-transform duration-200 ${active ? "translate-x-0 text-brand" : "text-zinc-300"}`}>→</span>
                  </Link>
                );
              })}
            </div>

            <div className="my-3 h-px bg-zinc-100" />

            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">Entrar</Link>
              <Link href="/cadastro" onClick={() => setOpen(false)} className="btn btn-primary">Criar conta</Link>
            </div>

            <Link
              href="/solicitar-orcamento"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center rounded-xl py-2 text-sm font-extrabold text-brand transition hover:bg-blue-50"
            >
              Solicitar análise gratuita →
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
