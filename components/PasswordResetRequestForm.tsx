"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordResetRequestForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent("/redefinir-senha")}`,
    });

    setPending(false);
    if (error) return setError("Não foi possível enviar o e-mail agora. Tente novamente em alguns minutos.");
    setSent(true);
  }

  if (sent) {
    return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha. <Link href="/login" className="font-bold underline">Voltar ao login</Link>.</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm"><span className="mb-1 block font-medium">E-mail da conta</span><input name="email" type="email" required autoComplete="email" className="input" placeholder="voce@empresa.com" /></label>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Enviando..." : "Enviar link de recuperação"}</button>
      <p className="text-center text-sm text-zinc-500"><Link href="/login" className="hover:text-brand">Voltar ao login</Link></p>
    </form>
  );
}
