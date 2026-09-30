"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [["/", "Início"], ["/servicos", "Serviços"], ["/portfolio", "Portfólio"], ["/sobre", "Sobre"], ["/contato", "Contato"]];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
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
        className={`relative z-[90] flex h-11 w-11 items-center justify-center rounded-2xl border bg-white shadow-md transition duration-300 ${open ? "border-blue-200" : "border-zinc-200"}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span className="relative h-5 w-6">
          <span className={`absolute left-0 top-0.5 h-0.5 w-6 rounded bg-[#09113f] transition-all duration-300 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[9px] h-0.5 rounded bg-[#09113f] transition-all duration-300 ${open ? "w-0 opacity-0" : "w-6 opacity-100"}`} />
          <span className={`absolute bottom-0.5 left-0 h-0.5 w-6 rounded bg-[#09113f] transition-all duration-300 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </span>
      </button>

      <div className={`fixed inset-0 z-[80] transition-all duration-300 ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}>
        <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-[#020624]/45 backdrop-blur-sm" />
        <nav className={`absolute left-4 right-4 top-[82px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/96 p-3 shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-300 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-[.97] opacity-0"}`}>
          <div className="mb-2 px-3 py-2">
            <p className="text-xs font-black uppercase tracking-[.18em] text-brand">Zenfy</p>
            <p className="mt-1 text-sm text-zinc-500">Uma empresa da Companhia A &amp; P</p>
          </div>
          {links.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="menu-link group flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-[#09113f] transition hover:bg-blue-50"
              style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
            >
              <span>{label}</span><span className="text-brand transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
          <div className="my-2 h-px bg-zinc-100" />
          <div className="grid grid-cols-2 gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">Entrar</Link>
            <Link href="/cadastro" onClick={() => setOpen(false)} className="btn btn-primary">Criar conta</Link>
          </div>
          <Link href="/solicitar-orcamento" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center py-2 text-sm font-bold text-brand">Solicitar análise gratuita →</Link>
        </nav>
      </div>
    </div>
  );
}
