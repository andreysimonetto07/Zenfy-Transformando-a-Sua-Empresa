"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });

    if (error || !data.user) {
      setPending(false);
      return setMsg("E-mail ou senha incorretos, ou o e-mail ainda não foi confirmado.");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.replace(profile?.role === "admin" || profile?.role === "super_admin" ? "/admin/dashboard" : "/cliente/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">E-mail</span>
        <input name="email" type="email" required autoComplete="email" placeholder="voce@empresa.com" className="input" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Senha</span>
        <input name="password" type="password" required autoComplete="current-password" placeholder="Sua senha" className="input" />
      </label>
      {msg && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{msg}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Entrando..." : "Entrar"}</button>
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href="/recuperar-senha" className="text-zinc-500 hover:text-brand">Esqueci minha senha</Link>
        <Link href="/cadastro" className="font-semibold text-brand hover:underline">Criar conta</Link>
      </div>
    </form>
  );
}
