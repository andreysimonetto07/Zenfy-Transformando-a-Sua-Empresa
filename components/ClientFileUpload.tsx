"use client";

import { useState, useTransition } from "react";
import { uploadClientFileAction } from "@/app/cliente/actions";

export default function ClientFileUpload({ projects }: { projects:{id:string;name:string}[] }) {
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const fd=new FormData(form);
    setFeedback(null);
    startTransition(async()=>{
      const result=await uploadClientFileAction(fd);
      if(!result.ok) return setFeedback({ok:false,text:result.error});
      form.reset();
      setFeedback({ok:true,text:result.message || "Arquivo enviado."});
    });
  }

  return <form onSubmit={submit} className="surface grid gap-4 p-5 sm:grid-cols-[1fr_240px_auto] sm:items-end sm:p-6">
    <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Arquivo</span><input name="file" type="file" required className="input file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-bold file:text-brand" /></label>
    <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Projeto</span><select name="project_id" className="input"><option value="">Geral</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <button disabled={pending} className="btn btn-primary">{pending ? "Enviando..." : "Enviar arquivo"}</button>
    {feedback && <p className={`rounded-2xl p-3 text-sm sm:col-span-3 ${feedback.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-700"}`}>{feedback.text}</p>}
  </form>;
}
