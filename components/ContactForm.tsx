"use client";
import { useState } from "react";
import { ANDREY_CONTACT, whatsappHref } from "@/lib/contact";

const services=["Site completo","Landing Page","Tráfego Pago","Automação","Criativos","Copywriting","Consultoria","Outro"];

export default function ContactForm(){
 const [state,setState]=useState<"idle"|"sending"|"ok"|"error">("idle");
 async function onSubmit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(state==="sending")return;
  setState("sending");
  const form=e.currentTarget;
  const body=Object.fromEntries(new FormData(form));
  try{
   const res=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   if(!res.ok)throw new Error("Contact request failed");
   setState("ok");form.reset();
  }catch{setState("error")}
 }
 if(state==="ok") return <div role="status" className="surface border-emerald-100 bg-emerald-50 p-6 text-emerald-900"><p className="font-black">Mensagem recebida.</p><p className="mt-1 text-sm">A equipe Zenfy entrará em contato pelo WhatsApp ou e-mail informado.</p></div>;
 const field=(name:string,label:string,type="text",required=false,placeholder="")=><label className="block text-sm"><span className="mb-1.5 block font-bold text-zinc-700">{label}</span><input name={name} type={type} required={required} placeholder={placeholder} className="input"/></label>;
 return <form onSubmit={onSubmit} className="surface grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
  {field("name","Nome","text",true,"Seu nome")}{field("company","Empresa","text",false,"Nome da empresa")}
  {field("whatsapp","WhatsApp","tel",true,"(45) 99999-9999")}{field("email","E-mail","email",true,"voce@empresa.com")}
  {field("instagram","Instagram","text",false,"@empresa")}{field("website","Site atual","text",false,"seusite.com.br")}
  <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Serviço desejado</span><select name="service" required className="input">{services.map(s=><option key={s}>{s}</option>)}</select></label>
  <label className="block text-sm sm:col-span-2"><span className="mb-1.5 block font-bold text-zinc-700">Conte um pouco sobre o que precisa</span><textarea name="message" rows={5} className="input" placeholder="Ex.: quero um site mais profissional para apresentar meus serviços e receber contatos..."/></label>
  {state==="error"&&<p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">Não foi possível enviar sua mensagem. Tente novamente ou <a href={whatsappHref(`Olá ${ANDREY_CONTACT.name}! Não consegui enviar o formulário da Zenfy e gostaria de conversar sobre minha empresa.`, ANDREY_CONTACT)} target="_blank" rel="noopener noreferrer" className="font-bold underline">fale pelo WhatsApp</a>.</p>}
  <button disabled={state==="sending"} className="btn btn-primary sm:col-span-2">{state==="sending"?"Enviando...":"Enviar para a Zenfy"}</button>
 </form>
}
