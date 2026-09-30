"use client";

import { useState,useTransition } from "react";
import { sendAdminMessageAction } from "@/app/admin/mensagens/actions";

export default function AdminMessageComposer({clients,initialReceiverId=""}:{clients:{id:string;name:string;email:string}[];initialReceiverId?:string}){
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); const form=e.currentTarget; const fd=new FormData(form); setFeedback(null);
    startTransition(async()=>{
      const result=await sendAdminMessageAction(Object.fromEntries(fd.entries()));
      if(!result.ok)return setFeedback({ok:false,text:result.error || "Não foi possível enviar."});
      form.reset(); setFeedback({ok:true,text:result.message||"Enviado."});
    });
  }

  return <form onSubmit={submit} className="surface grid gap-4 p-5 sm:grid-cols-[260px_1fr_auto] sm:items-end sm:p-6">
    <label className="text-sm"><span className="mb-1.5 block font-bold">Cliente</span><select name="receiver_id" required defaultValue={initialReceiverId} className="input"><option value="">Selecione</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name} · {c.email}</option>)}</select></label>
    <label className="text-sm"><span className="mb-1.5 block font-bold">Mensagem</span><textarea name="content" required rows={3} className="input" placeholder="Escreva para o cliente..."/></label>
    <button disabled={pending} className="btn btn-primary">{pending?"Enviando...":"Enviar"}</button>
    {feedback&&<p className={`rounded-2xl p-3 text-sm sm:col-span-3 ${feedback.ok?"bg-emerald-50 text-emerald-900":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}
  </form>;
}
