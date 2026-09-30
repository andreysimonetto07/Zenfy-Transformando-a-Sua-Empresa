"use client";

import { useState, useTransition } from "react";
import { createInvoiceAction, createProjectAction, createSiteAction, createTrafficReportAction } from "@/app/admin/clientes/actions";

type Props={clientId:string;companyId?:string|null;projects:{id:string;name:string}[]};
type Kind="project"|"site"|"traffic"|"invoice";

export default function AdminClientForms({clientId,companyId,projects}:Props){
  const [kind,setKind]=useState<Kind>("traffic");
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); const form=e.currentTarget; const fd=new FormData(form);
    const raw={...Object.fromEntries(fd.entries()),client_id:clientId,company_id:companyId||""};
    setFeedback(null);
    startTransition(async()=>{
      const action=kind==="project"?createProjectAction:kind==="site"?createSiteAction:kind==="traffic"?createTrafficReportAction:createInvoiceAction;
      const result=await action(raw);
      if(!result.ok)return setFeedback({ok:false,text:result.error || "Não foi possível salvar."});
      form.reset(); setFeedback({ok:true,text:result.message||"Salvo."});
    });
  }

  return <section className="surface p-5 sm:p-6">
    <div className="flex flex-wrap gap-2">
      {([["traffic","Tráfego"],["site","Site"],["project","Projeto"],["invoice","Cobrança"]] as [Kind,string][]).map(([value,label])=><button key={value} type="button" onClick={()=>{setKind(value);setFeedback(null)}} className={`rounded-xl px-4 py-2 text-sm font-black transition ${kind===value?"brand-gradient text-white shadow-md":"bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>{label}</button>)}
    </div>

    <form key={kind} onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
      {kind==="traffic"&&<>
        <F name="period_start" label="Início do período" type="date" required/><F name="period_end" label="Fim do período" type="date" required/>
        <F name="platform" label="Plataforma" value="Meta Ads" required/><F name="spend" label="Investimento (R$)" type="number" value="0" required step="0.01"/>
        <F name="impressions" label="Impressões" type="number" value="0" required/><F name="clicks" label="Cliques" type="number" value="0" required/>
        <F name="leads" label="Leads" type="number" value="0" required/><F name="conversions" label="Conversões" type="number" value="0" required/>
        <F name="revenue" label="Faturamento atribuído (R$)" type="number" value="0" required step="0.01"/>
        <ProjectSelect projects={projects}/><Area name="notes" label="Observações"/>
      </>}
      {kind==="site"&&<>
        <F name="name" label="Nome do site" required/><F name="domain" label="Domínio"/>
        <F name="url" label="URL completa"/><F name="platform" label="Tecnologia" placeholder="Next.js / WordPress / Loja"/>
        <label className="text-sm"><span className="mb-1.5 block font-bold">Status</span><select name="status" defaultValue="ativo" className="input"><option value="planejamento">Planejamento</option><option value="desenvolvimento">Em desenvolvimento</option><option value="ativo">Ativo</option><option value="pausado">Pausado</option><option value="arquivado">Arquivado</option></select></label>
        <ProjectSelect projects={projects}/><Area name="notes" label="Observações"/>
      </>}
      {kind==="project"&&<>
        <F name="name" label="Nome do projeto" required/><F name="type" label="Tipo" placeholder="Site / Landing Page / Tráfego"/>
        <label className="text-sm"><span className="mb-1.5 block font-bold">Status</span><select name="status" defaultValue="planejamento" className="input"><option value="planejamento">Planejamento</option><option value="desenvolvimento">Em desenvolvimento</option><option value="revisao">Revisão</option><option value="concluido">Concluído</option></select></label>
        <F name="progress" label="Progresso (%)" type="number" value="0" min="0" max="100" step="10"/>
        <F name="start_date" label="Data de início" type="date"/><F name="deadline" label="Prazo" type="date"/>
        <F name="price" label="Valor (R$)" type="number" step="0.01"/><Area name="description" label="Descrição"/>
      </>}
      {kind==="invoice"&&<>
        <F name="description" label="Descrição da cobrança" required/><F name="amount" label="Valor (R$)" type="number" required step="0.01"/>
        <F name="due_date" label="Vencimento" type="date"/>
        <label className="text-sm"><span className="mb-1.5 block font-bold">Status</span><select name="status" defaultValue="pendente" className="input"><option value="pendente">Pendente</option><option value="pago">Pago</option><option value="atrasado">Atrasado</option><option value="cancelado">Cancelado</option></select></label>
        <F name="payment_url" label="Link de pagamento" placeholder="https://..."/>
      </>}
      {feedback&&<p className={`rounded-2xl p-3 text-sm sm:col-span-2 ${feedback.ok?"bg-emerald-50 text-emerald-900":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}
      <div className="sm:col-span-2"><button disabled={pending} className="btn btn-primary">{pending?"Salvando...":"Salvar"}</button></div>
    </form>
  </section>;
}

function F(props:{name:string;label:string;type?:string;required?:boolean;value?:string;placeholder?:string;step?:string;min?:string;max?:string}){return <label className="text-sm"><span className="mb-1.5 block font-bold">{props.label}</span><input name={props.name} type={props.type||"text"} required={props.required} defaultValue={props.value} placeholder={props.placeholder} step={props.step} min={props.min} max={props.max} className="input"/></label>}
function Area({name,label}:{name:string;label:string}){return <label className="text-sm sm:col-span-2"><span className="mb-1.5 block font-bold">{label}</span><textarea name={name} rows={4} className="input"/></label>}
function ProjectSelect({projects}:{projects:{id:string;name:string}[]}){return <label className="text-sm"><span className="mb-1.5 block font-bold">Projeto relacionado</span><select name="project_id" className="input"><option value="">Nenhum</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
