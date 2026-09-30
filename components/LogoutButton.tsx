"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    setPending(true);

    try {
      await fetch("/auth/logout", {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      });
    } catch {
      // Mesmo se a rede falhar, a navegação abaixo força uma nova leitura da sessão.
    } finally {
      window.location.replace("/?logout=1");
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="mt-4 w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-60 md:mt-auto"
    >
      {pending ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
