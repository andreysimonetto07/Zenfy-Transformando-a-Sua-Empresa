"use client";

import { useState, useTransition } from "react";
import { quickUpdateTrafficAction } from "@/app/admin/clientes/actions";

type Initial = {
  platform?: string | null;
  spend?: number | string | null;
  impressions?: number | string | null;
  clicks?: number | string | null;
  leads?: number | string | null;
  conversions?: number | string | null;
  revenue?: number | string | null;
};

export default function DailyMetricsQuickUpdate({
  clientId,
  today,
  initial,
}:{
  clientId:string;
  today:string;
  initial?:Initial|null;
}) {
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const raw={...Object.fromEntries(new FormData(form).entries()),client_id:clientId};
    setFeedback(null);
    startTransition(async()=>{
      const result=await quickUpdateTrafficAction(raw);
      setFeedback({ok:result.ok,text:result.ok ? result.message || "Métricas salvas." : result.error || "Não foi possível salvar."});
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Atualização rápida</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Métricas do dia</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Coloque aqui o total acumulado que você está vendo na campanha. Se já existir um registro para a mesma data e plataforma, ele será atualizado.
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-brand">Manual pela Zenfy</span>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <F name="date" label="Data" type="date" value={today} required />
          <label className="text-sm">
            <span className="mb-1.5 block font-bold text-zinc-700">Plataforma</span>
            <select name="platform" defaultValue={initial?.platform || "Meta Ads"} className="input">
              <option>Meta Ads</option>
              <option>Google Ads</option>
              <option>TikTok Ads</option>
              <option>Outra</option>
            </select>
          </label>
          <F name="leads" label="Leads no dia" type="number" value={String(initial?.leads ?? 0)} min="0" required />
          <F name="spend" label="Investimento (R$)" type="number" value={String(initial?.spend ?? 0)} min="0" step="0.01" required />
          <F name="clicks" label="Cliques" type="number" value={String(initial?.clicks ?? 0)} min="0" required />
          <F name="impressions" label="Impressões" type="number" value={String(initial?.impressions ?? 0)} min="0" required />
          <F name="conversions" label="Conversões" type="number" value={String(initial?.conversions ?? 0)} min="0" required />
          <F name="revenue" label="Faturamento atribuído (R$)" type="number" value={String(initial?.revenue ?? 0)} min="0" step="0.01" required />

          {feedback && (
            <p className={`rounded-2xl p-3 text-sm lg:col-span-4 ${feedback.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
              {feedback.text}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row lg:col-span-4">
            <button disabled={pending} className="btn btn-primary">{pending ? "Salvando..." : "Atualizar painel do cliente"}</button>
            <p className="self-center text-xs text-zinc-400">Ex.: hoje chegaram 3 leads → coloque 3. Depois chegaram mais 2 → volte e altere para 5.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function F({name,label,type="text",value,min,step,required}:{name:string;label:string;type?:string;value:string;min?:string;step?:string;required?:boolean}) {
  return <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">{label}</span><input name={name} type={type} defaultValue={value} min={min} step={step} required={required} className="input" /></label>;
}
