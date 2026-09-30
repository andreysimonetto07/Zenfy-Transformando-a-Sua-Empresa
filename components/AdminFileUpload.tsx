"use client";

import { useState, useTransition } from "react";
import { uploadAdminFileAction } from "@/app/admin/arquivos/actions";

export default function AdminFileUpload({clients}:{clients:{id:string;name:string;email:string}[]}) {
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const fd=new FormData(form);
    setFeedback(null);

    startTransition(async()=>{
      const result=await uploadAdminFileAction(fd);
      if(!result.ok) return setFeedback({ok:false,text:result.error});
      form.reset();
      setFeedback({ok:true,text:result.message||"Arquivo enviado."});
    });
  }

  return (
    <form onSubmit={submit} className="surface grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
      <label className="text-sm">
        <span className="mb-1.5 block font-bold text-zinc-700">Cliente</span>
        <select name="client_id" required className="input">
          <option value="">Selecione a empresa</option>
          {clients.map((client)=><option key={client.id} value={client.id}>{client.name}{client.email ? " · "+client.email : ""}</option>)}
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block font-bold text-zinc-700">Arquivo</span>
        <input name="file" type="file" required className="input file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-bold file:text-brand" />
      </label>

      <button disabled={pending} className="btn btn-primary">{pending?"Enviando...":"Enviar ao cliente"}</button>

      {feedback&&<p className={`rounded-2xl p-3 text-sm lg:col-span-3 ${feedback.ok?"bg-emerald-50 text-emerald-900":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}
    </form>
  );
}
