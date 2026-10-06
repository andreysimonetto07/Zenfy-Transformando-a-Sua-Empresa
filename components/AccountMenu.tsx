"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PublicAccount } from "@/types/account";

export default function AccountMenu({ account }: { account: PublicAccount }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", key);
    };
  }, []);

  async function logout() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/auth/logout", { method: "POST", cache: "no-store", credentials: "include" });
    } finally {
      window.location.replace("/?logout=1");
    }
  }

  const firstName = account.name.trim().split(/\s+/)[0] || account.name;

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-3 rounded-2xl border px-2.5 py-2 text-left transition duration-200 ${open ? "border-blue-200 bg-blue-50/70 shadow-md" : "border-zinc-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-xs font-black text-white shadow-md">
          {account.initials}
        </span>
        <span className="hidden min-w-0 xl:block">
          <span className="block max-w-[130px] truncate text-sm font-extrabold text-[#09113f]">{firstName}</span>
          <span className="block text-[10px] font-semibold text-zinc-400">{account.companyName||account.roleLabel}</span>
        </span>
        <span className={`hidden text-xs text-zinc-400 transition-transform duration-200 xl:block ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      <div className={`absolute right-0 top-[calc(100%+10px)] z-[70] w-72 origin-top-right rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl shadow-blue-950/15 transition-all duration-200 ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[.98] opacity-0"}`} role="menu">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-md">
              {account.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-black text-[#09113f]">{account.name}</p>
              <p className="truncate text-xs text-zinc-500">{account.email}</p>
              <p className="mt-1 text-[11px] font-bold text-brand">{account.roleLabel}</p>
              {account.companyName&&<p className="mt-1 truncate text-xs font-black text-emerald-700">Conectado à empresa: {account.companyName}</p>}
            </div>
          </div>
        </div>

        <div className="mt-2 grid gap-1">
          <Link href={account.dashboardHref} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-[#09113f] transition hover:bg-blue-50">
            <span>{account.role === "client" ? "Minha área" : "Painel administrativo"}</span>
            <span className="text-brand">→</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={pending}
            className="rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {pending ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
