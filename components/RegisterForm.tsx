"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function productionOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !configured.includes("localhost")) return configured;
  return typeof window !== "undefined" ? window.location.origin : configured || "";
}

export default function RegisterForm() {
  const [message,setMessage] = useState<{type:"ok"|"error";text:string}|null>(null);
  const [pending,setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form=e.currentTarget;
    const fd=new FormData(form);
    const password=String(fd.get("password")||"");
    const confirmPassword=String(fd.get("confirm_password")||"");
    if (password.length < 8) return setMessage({type:"error",text:"Use uma senha com pelo menos 8 caracteres."});
    if (password !== confirmPassword) return setMessage({type:"error",text:"As senhas não coincidem."});

    setPending(true);
    const origin=productionOrigin();
    const { data,error } = await createClient().auth.signUp({
      email:String(fd.get("email")||"").trim(),
      password,
      options:{
        emailRedirectTo:`${origin}/auth/callback?next=${encodeURIComponent("/cliente/dashboard?bem-vindo=1")}`,
        data:{ name:String(fd.get("name")||"").trim(), company_name:String(fd.get("company")||"").trim(), whatsapp:String(fd.get("whatsapp")||"").trim() }
      }
    });
    setPending(false);
    if (error) return setMessage({type:"error",text:error.message.toLowerCase().includes("already") ? "Já existe uma conta com este e-mail." : "Não foi possível criar a conta. Tente novamente."});
    if (data.session) { window.location.href="/cliente/dashboard?bem-vindo=1"; return; }
    setMessage({type:"ok",text:"Conta criada! Enviamos um e-mail de confirmação. Abra o link no mesmo dispositivo e você será levado de volta para a Zenfy."});
    form.reset();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Seu nome</span><input name="name" required minLength={2} className="input" autoComplete="name" placeholder="Seu nome completo" /></label>
        <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Empresa</span><input name="company" required minLength={2} className="input" autoComplete="organization" placeholder="Nome da empresa" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">WhatsApp</span><input name="whatsapp" required className="input" autoComplete="tel" placeholder="(45) 99999-9999" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">E-mail</span><input name="email" type="email" required className="input" autoComplete="email" placeholder="voce@empresa.com" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Senha</span><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Confirmar senha</span><input name="confirm_password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      </div>
      {message && <p className={`rounded-2xl border p-4 text-sm ${message.type==="ok" ? "border-emerald-100 bg-emerald-50 text-emerald-900" : "border-red-100 bg-red-50 text-red-700"}`}>{message.text}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Criando sua conta..." : "Criar conta da empresa"}</button>
      <p className="text-center text-sm text-zinc-500">Já tem acesso? <Link href="/login" className="font-bold text-brand hover:underline">Entrar</Link></p>
    </form>
  );
}
