"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PasswordUpdateForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm_password") || "");

    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");

    setPending(true);
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setPending(false);
      return setError("Sua sessão de recuperação não está mais válida. Solicite um novo link.");
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPending(false);
      return setError(error.message || "Não foi possível alterar a senha. Solicite um novo link e tente novamente.");
    }

    await supabase.auth.signOut();
    router.replace("/login?senha=alterada");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm"><span className="mb-1 block font-medium">Nova senha</span><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      <label className="block text-sm"><span className="mb-1 block font-medium">Confirmar nova senha</span><input name="confirm_password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="btn btn-primary w-full">{pending ? "Salvando..." : "Salvar nova senha"}</button>
    </form>
  );
}
