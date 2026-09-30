"use client";
import { useState } from "react";

const services=["Site completo","Landing Page","Tráfego Pago","Automação","Criativos","Copywriting","Consultoria","Outro"];

export default function ContactForm(){
 const [state,setState]=useState<"idle"|"sending"|"ok"|"error">("idle");
 async function onSubmit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setState("sending");const form=e.currentTarget;const body=Object.fromEntries(new FormData(form));const res=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(res.ok){setState("ok");form.reset()}else setState("error")}
 if(state==="ok") return <div className="surface border-emerald-100 bg-emerald-50 p-6 text-emerald-900"><p className="font-black">Mensagem recebida.</p><p className="mt-1 text-sm">A equipe Zenfy entrará em contato pelo WhatsApp ou e-mail informado.</p></div>;
 const field=(name:string,label:string,type="text",required=false,placeholder="")=><label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">{label}</span><input name={name} type={type} required={required} placeholder={placeholder} className="input"/></label>;
 return <form onSubmit={onSubmit} className="surface grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
  {field("name","Nome","text",true,"Seu nome")}{field("company","Empresa","text",false,"Nome da empresa")}
  {field("whatsapp","WhatsApp","tel",true,"(45) 99999-9999")}{field("email","E-mail","email",true,"voce@empresa.com")}
  {field("instagram","Instagram","text",false,"@empresa")}{field("website","Site atual","text",false,"seusite.com.br")}
  <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Serviço desejado</span><select name="service" required className="input">{services.map(s=><option key={s}>{s}</option>)}</select></label>
  <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Conte um pouco sobre o que precisa</span><textarea name="message" rows={5} className="input" placeholder="Ex.: quero um site mais profissional para apresentar meus serviços e receber contatos..."/></label>
  {state==="error"&&<p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">Não foi possível enviar. Tente novamente.</p>}
  <button disabled={state==="sending"} className="btn btn-primary sm:col-span-2">{state==="sending"?"Enviando...":"Enviar para a Zenfy"}</button>
 </form>
}
