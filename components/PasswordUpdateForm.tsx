"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecoveryClient } from "@/lib/supabase/recovery";
import { SUPPORT_EMAIL_HREF } from "@/lib/contact";

export default function PasswordUpdateForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(pending)return;
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm_password") || "");

    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");

    setPending(true);
    try {
      const supabase = createRecoveryClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if(sessionError || !session)return setError("Sua sessão de recuperação não está mais válida. Solicite um novo link.");
      const {error:updateError}=await supabase.auth.updateUser({password});
      if(updateError)return setError(updateError.code==="same_password"
        ? "Escolha uma senha diferente da senha atual."
        : updateError.code==="weak_password"
          ? "Escolha uma senha mais forte, com letras, números e símbolos."
          : "Não foi possível alterar a senha. Solicite um novo link ou fale com o suporte.");
      await supabase.auth.signOut({scope:"local"});
      router.replace("/login?senha=alterada");
      router.refresh();
    }catch{
      setError("Não conseguimos concluir a alteração. Confira sua conexão e tente novamente.");
    }finally{
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm"><span className="mb-1 block font-medium">Nova senha</span><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      <label className="block text-sm"><span className="mb-1 block font-medium">Confirmar nova senha</span><input name="confirm_password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Salvando..." : "Salvar nova senha"}</button>
      <p className="text-center text-xs text-zinc-500">Precisa de ajuda? <a href={SUPPORT_EMAIL_HREF} className="font-semibold text-brand hover:underline">Fale com o suporte</a>.</p>
    </form>
  );
}
