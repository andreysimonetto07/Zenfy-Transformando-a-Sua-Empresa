"use client";

import { useState, useTransition } from "react";
import { updateClientProfileAction } from "@/app/cliente/actions";

type Initial = {
  name:string;
  phone?:string|null;
  company_name:string;
  whatsapp?:string|null;
  website?:string|null;
  instagram?:string|null;
  city?:string|null;
  state?:string|null;
};

export default function ClientProfileForm({ initial }: { initial: Initial }) {
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    setFeedback(null);
    startTransition(async()=>{
      const result=await updateClientProfileAction(Object.fromEntries(fd.entries()));
      setFeedback(result.ok ? {ok:true,text:result.message || "Dados atualizados."} : {ok:false,text:result.error});
    });
  }

  const field=(name:string,label:string,value?:string|null,type="text")=><label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">{label}</span><input name={name} type={type} defaultValue={value || ""} className="input" /></label>;

  return <form onSubmit={submit} className="surface grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
    {field("name","Seu nome",initial.name)}
    {field("phone","Seu telefone",initial.phone)}
    {field("company_name","Empresa",initial.company_name)}
    {field("whatsapp","WhatsApp da empresa",initial.whatsapp)}
    {field("website","Site",initial.website)}
    {field("instagram","Instagram",initial.instagram)}
    {field("city","Cidade",initial.city)}
    {field("state","Estado",initial.state)}
    {feedback && <p className={`rounded-2xl p-3 text-sm sm:col-span-2 ${feedback.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-700"}`}>{feedback.text}</p>}
    <div className="sm:col-span-2"><button disabled={pending} className="btn btn-primary w-full sm:w-auto">{pending ? "Salvando..." : "Salvar alterações"}</button></div>
  </form>;
}
