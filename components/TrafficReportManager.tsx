"use client";

import { useState, useTransition } from "react";
import { deleteTrafficReportAction, updateTrafficReportAction } from "@/app/admin/clientes/actions";

type Report = {
  id:string;
  client_id:string;
  project_id?:string|null;
  period_start:string;
  period_end:string;
  platform:string;
  spend:number|string;
  impressions:number|string;
  clicks:number|string;
  leads:number|string;
  conversions:number|string;
  revenue:number|string;
  notes?:string|null;
  created_at?:string|null;
  updated_at?:string|null;
};

export default function TrafficReportManager({clientId,reports}:{clientId:string;reports:Report[]}) {
  const [editing,setEditing]=useState<string|null>(null);
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function save(e:React.FormEvent<HTMLFormElement>, reportId:string) {
    e.preventDefault();
    const form=e.currentTarget;
    const raw={...Object.fromEntries(new FormData(form).entries()),report_id:reportId,client_id:clientId};
    startTransition(async()=>{
      const result=await updateTrafficReportAction(raw);
      setFeedback({ok:result.ok,text:result.ok?result.message||"Atualizado.":result.error||"Erro."});
      if(result.ok)setEditing(null);
    });
  }

  function remove(reportId:string) {
    if(!window.confirm("Excluir este relatório?")) return;
    startTransition(async()=>{
      const result=await deleteTrafficReportAction({report_id:reportId,client_id:clientId});
      setFeedback({ok:result.ok,text:result.ok?result.message||"Excluído.":result.error||"Erro."});
    });
  }

  return <section className="surface p-6">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-[#09113f]">Tráfego recente</h2>
        <p className="mt-1 text-sm text-zinc-500">Edite os números publicados no portal do cliente.</p>
      </div>
    </div>

    {feedback&&<p className={`mt-4 rounded-xl p-3 text-sm ${feedback.ok?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}

    {reports.length ? <div className="mt-4 grid gap-3">
      {reports.map((r)=>editing===r.id ? (
        <form key={r.id} onSubmit={(e)=>save(e,r.id)} className="grid gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4 sm:grid-cols-2">
          <F name="period_start" label="Início" type="date" value={r.period_start}/>
          <F name="period_end" label="Fim" type="date" value={r.period_end}/>
          <F name="platform" label="Plataforma" value={r.platform}/>
          <F name="spend" label="Investimento" type="number" value={String(r.spend)} step="0.01"/>
          <F name="impressions" label="Impressões" type="number" value={String(r.impressions)}/>
          <F name="clicks" label="Cliques" type="number" value={String(r.clicks)}/>
          <F name="leads" label="Leads" type="number" value={String(r.leads)}/>
          <F name="conversions" label="Conversões" type="number" value={String(r.conversions)}/>
          <F name="revenue" label="Faturamento atribuído" type="number" value={String(r.revenue)} step="0.01"/>
          <label className="text-sm sm:col-span-2"><span className="mb-1 block font-bold">Observações</span><textarea name="notes" defaultValue={r.notes||""} rows={3} className="input"/></label>
          <div className="flex gap-2 sm:col-span-2">
            <button disabled={pending} className="btn btn-primary">Salvar alterações</button>
            <button type="button" onClick={()=>setEditing(null)} className="btn btn-ghost">Cancelar</button>
          </div>
        </form>
      ) : (
        <article key={r.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-black text-[#09113f]">{r.platform}</p>
              <p className="mt-1 text-xs text-zinc-500">{r.period_start} → {r.period_end}</p>
              <p className="mt-2 text-sm text-zinc-600">R$ {Number(r.spend).toLocaleString("pt-BR",{minimumFractionDigits:2})} investidos · {r.leads} leads · R$ {Number(r.revenue).toLocaleString("pt-BR",{minimumFractionDigits:2})} faturamento</p>
              <p className="mt-1 text-xs text-zinc-400">Última atualização: {new Date(r.updated_at||r.created_at||Date.now()).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={()=>setEditing(r.id)} className="btn btn-ghost">Editar</button>
              <button type="button" onClick={()=>remove(r.id)} className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">Excluir</button>
            </div>
          </div>
        </article>
      ))}
    </div> : <p className="mt-4 text-sm text-zinc-500">Nenhum relatório publicado ainda.</p>}
  </section>;
}

function F({name,label,type="text",value,step}:{name:string;label:string;type?:string;value:string;step?:string}) {
  return <label className="text-sm"><span className="mb-1 block font-bold">{label}</span><input name={name} type={type} defaultValue={value} step={step} required className="input"/></label>;
}
