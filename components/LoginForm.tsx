"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
    if (error) return setMsg("E-mail ou senha incorretos.");
    router.push("/cliente/dashboard");
    router.refresh();
  }
  async function reset(e: React.MouseEvent<HTMLButtonElement>) {
    const email = (e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement).value;
    if (!email) return setMsg("Informe o e-mail para recuperar a senha.");
    await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login` });
    setMsg("Se o e-mail existir, enviamos um link de recuperação.");
  }
  return (
    <form onSubmit={login} className="space-y-4">
      <input name="email" type="email" required placeholder="E-mail" className="input" />
      <input name="password" type="password" required placeholder="Senha" className="input" />
      {msg && <p className="text-sm text-zinc-600">{msg}</p>}
      <button className="btn btn-primary w-full">Entrar</button>
      <button type="button" onClick={reset} className="w-full text-sm text-zinc-500 hover:text-ink">Esqueci minha senha</button>
    </form>
  );
}
