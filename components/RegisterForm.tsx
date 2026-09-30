"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirm_password") || "");

    if (password.length < 8) return setMessage({ type: "error", text: "A senha precisa ter pelo menos 8 caracteres." });
    if (password !== confirmPassword) return setMessage({ type: "error", text: "As senhas não coincidem." });

    setPending(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: String(fd.get("email") || "").trim(),
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent("/cliente/dashboard")}`,
        data: {
          name: String(fd.get("name") || "").trim(),
          company_name: String(fd.get("company") || "").trim(),
          whatsapp: String(fd.get("whatsapp") || "").trim(),
        },
      },
    });

    setPending(false);

    if (error) {
      return setMessage({ type: "error", text: error.message.includes("already") ? "Já existe uma conta com este e-mail." : "Não foi possível criar a conta. Confira os dados e tente novamente." });
    }

    if (data.session) {
      router.replace("/cliente/dashboard");
      router.refresh();
      return;
    }

    setMessage({ type: "ok", text: "Conta criada. Confira seu e-mail e clique no link de confirmação para liberar o acesso." });
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2"><span className="mb-1 block font-medium">Seu nome</span><input name="name" required minLength={2} className="input" autoComplete="name" /></label>
        <label className="block text-sm sm:col-span-2"><span className="mb-1 block font-medium">Empresa</span><input name="company" required minLength={2} className="input" autoComplete="organization" /></label>
        <label className="block text-sm"><span className="mb-1 block font-medium">WhatsApp</span><input name="whatsapp" required className="input" autoComplete="tel" /></label>
        <label className="block text-sm"><span className="mb-1 block font-medium">E-mail</span><input name="email" type="email" required className="input" autoComplete="email" /></label>
        <label className="block text-sm"><span className="mb-1 block font-medium">Senha</span><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
        <label className="block text-sm"><span className="mb-1 block font-medium">Confirmar senha</span><input name="confirm_password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      </div>
      {message && <p className={`rounded-xl p-3 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Criando conta..." : "Criar minha conta"}</button>
      <p className="text-center text-sm text-zinc-500">Já possui conta? <Link href="/login" className="font-semibold text-brand hover:underline">Entrar</Link></p>
    </form>
  );
}
