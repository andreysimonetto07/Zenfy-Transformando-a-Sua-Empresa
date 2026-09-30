"use client";

import { useState, useTransition } from "react";
import { sendClientMessageAction } from "@/app/cliente/actions";

export default function ClientMessageComposer({ projects }: { projects: { id: string; name: string }[] }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ok:boolean;text:string}|null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFeedback(null);
    startTransition(async () => {
      const result = await sendClientMessageAction({
        content: String(fd.get("content") || ""),
        project_id: String(fd.get("project_id") || ""),
      });
      if (!result.ok) return setFeedback({ ok:false, text:result.error });
      form.reset();
      setFeedback({ ok:true, text:result.message || "Mensagem enviada." });
    });
  }

  return (
    <form onSubmit={submit} className="surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          <span className="mb-1.5 block font-bold text-zinc-700">Mensagem para a equipe Zenfy</span>
          <textarea name="content" required rows={4} className="input" placeholder="Escreva sua dúvida, atualização ou pedido..." />
        </label>
        <div className="w-full sm:w-56">
          <label className="block text-sm">
            <span className="mb-1.5 block font-bold text-zinc-700">Projeto</span>
            <select name="project_id" className="input">
              <option value="">Geral</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <button disabled={pending} className="btn btn-primary mt-3 w-full">{pending ? "Enviando..." : "Enviar mensagem"}</button>
        </div>
      </div>
      {feedback && <p className={`mt-4 rounded-2xl p-3 text-sm ${feedback.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-700"}`}>{feedback.text}</p>}
    </form>
  );
}
