"use client";

import Link from "next/link";
import { useState } from "react";
import { createRecoveryClient } from "@/lib/supabase/recovery";

function productionOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !configured.includes("localhost")) return configured;
  return typeof window !== "undefined" ? window.location.origin : configured || "";
}

export default function PasswordResetRequestForm() {
  const [pending,setPending]=useState(false);
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setPending(true);
    const fd=new FormData(e.currentTarget);
    const email=String(fd.get("email")||"").trim();
    const { error }=await createRecoveryClient().auth.resetPasswordForEmail(email,{ redirectTo:`${productionOrigin()}/redefinir-senha` });
    setPending(false);

    if(error){
      const message=String(error.message||"").toLowerCase();
      const status=(error as any).status;
      const code=String((error as any).code||"");

      if(status===429 || message.includes("rate limit") || message.includes("too many")){
        return setError("O limite de e-mails do Supabase foi atingido. Aguarde e tente novamente mais tarde ou configure um SMTP próprio para a Zenfy.");
      }

      if(message.includes("email address not authorized") || message.includes("not authorized")){
        return setError("O Supabase não autorizou o envio para este e-mail. É necessário configurar um SMTP próprio para permitir recuperação de senha dos clientes.");
      }

      if(message.includes("redirect") || message.includes("url")){
        return setError("A URL de recuperação não foi aceita pelo Supabase. Revise Authentication → URL Configuration.");
      }

      return setError(`Não foi possível enviar o e-mail. ${error.message}${code?` · ${code}`:""}`);
    }

    setSent(true);
  }

  if(sent) return <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-900">Se esse e-mail estiver cadastrado, enviamos um novo link para redefinir a senha. Use somente o e-mail mais recente recebido.<div className="mt-4"><Link href="/login" className="font-bold underline">Voltar ao login</Link></div></div>;

  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">E-mail da conta</span><input name="email" type="email" required autoComplete="email" className="input" placeholder="voce@empresa.com" /></label>
    {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={pending} className="btn btn-primary w-full">{pending ? "Enviando..." : "Enviar link de recuperação"}</button>
    <p className="text-center text-sm text-zinc-500"><Link href="/login" className="font-semibold hover:text-brand">← Voltar ao login</Link></p>
  </form>;
}
