"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [msg,setMsg] = useState("");
  const [pending,setPending] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data,error } = await supabase.auth.signInWithPassword({ email:String(fd.get("email")), password:String(fd.get("password")) });
    if (error || !data.user) { setPending(false); return setMsg("Não foi possível entrar. Confira e-mail, senha e confirmação do e-mail."); }
    const { data:profile } = await supabase.from("profiles").select("role").eq("id",data.user.id).single();
    router.replace(profile?.role === "admin" || profile?.role === "super_admin" ? "/admin/dashboard" : "/cliente/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">E-mail</span><input name="email" type="email" required autoComplete="email" placeholder="voce@empresa.com" className="input" /></label>
      <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Senha</span><input name="password" type="password" required autoComplete="current-password" placeholder="Sua senha" className="input" /></label>
      {msg && <p className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">{msg}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Entrando..." : "Entrar na Zenfy"}</button>
      <div className="text-center"><Link href="/recuperar-senha" className="text-sm font-semibold text-zinc-500 transition hover:text-brand">Esqueci minha senha</Link></div>
    </form>
  );
}
