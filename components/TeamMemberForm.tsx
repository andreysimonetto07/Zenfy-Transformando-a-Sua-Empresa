"use client";

import { useState, useTransition } from "react";
import { createTeamMemberAction } from "@/app/admin/configuracoes/actions";

export default function TeamMemberForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      const result = await createTeamMemberAction(Object.fromEntries(fd.entries()));
      if (!result.ok) return setMessage({ ok: false, text: result.error });
      form.reset();
      setMessage({ ok: true, text: "Acesso criado. A pessoa já pode entrar com o e-mail e a senha temporária." });
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2"><span className="mb-1 block font-medium">Nome</span><input name="name" required className="input" placeholder="Pedro Henrique" /></label>
      <label className="text-sm"><span className="mb-1 block font-medium">E-mail</span><input name="email" type="email" required className="input" /></label>
      <label className="text-sm"><span className="mb-1 block font-medium">Senha temporária</span><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      <label className="text-sm sm:col-span-2"><span className="mb-1 block font-medium">Nível de acesso</span><select name="role" defaultValue="super_admin" className="input"><option value="admin">Administrador</option><option value="super_admin">Super administrador</option></select></label>
      {message && <p className={`rounded-xl p-3 text-sm sm:col-span-2 ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
      <div className="sm:col-span-2"><button disabled={pending} className="btn btn-primary">{pending ? "Criando acesso..." : "Criar acesso da equipe"}</button></div>
    </form>
  );
}
