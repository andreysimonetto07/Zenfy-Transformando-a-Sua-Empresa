"use client";

import { useState, useTransition } from "react";
import { createSupportRequestAction } from "@/app/cliente/actions";

export default function SupportRequestForm({ projects }: { projects: { id:string; name:string }[] }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ok:boolean;text:string}|null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const fd=new FormData(form);
    setFeedback(null);
    startTransition(async()=>{
      const result=await createSupportRequestAction(Object.fromEntries(fd.entries()));
      if(!result.ok) return setFeedback({ok:false,text:result.error});
      form.reset();
      setFeedback({ok:true,text:result.message || "Solicitação aberta."});
    });
  }

  return <form onSubmit={submit} className="surface grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
    <label className="text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Assunto</span><input name="subject" required className="input" placeholder="Ex.: Alteração na página de serviços" /></label>
    <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Tipo</span><select name="kind" className="input"><option>Suporte</option><option>Alteração no site</option><option>Tráfego pago</option><option>Financeiro</option><option>Nova ideia</option></select></label>
    <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Prioridade</span><select name="priority" defaultValue="normal" className="input"><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option></select></label>
    <label className="text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Projeto relacionado</span><select name="project_id" className="input"><option value="">Geral</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label className="text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Descreva o que precisa</span><textarea name="description" required rows={5} className="input" placeholder="Explique com detalhes para a equipe conseguir agir mais rápido." /></label>
    {feedback && <p className={`rounded-2xl p-3 text-sm sm:col-span-2 ${feedback.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-700"}`}>{feedback.text}</p>}
    <div className="sm:col-span-2"><button disabled={pending} className="btn btn-primary w-full sm:w-auto">{pending ? "Abrindo..." : "Abrir solicitação"}</button></div>
  </form>;
}
