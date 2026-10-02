"use client";

import { useMemo, useState } from "react";

type Campaign = {
  id:string;
  name:string;
  spend:number;
  impressions:number;
  clicks:number;
  leads:number;
  cpl:number;
  ctr:number;
  cpc:number;
  revenue:number;
  roas:number;
};

export default function CampaignPerformanceTable({campaigns}:{campaigns:Campaign[]}) {
  const [campaignId,setCampaignId]=useState("all");
  const visible=useMemo(()=>campaignId==="all"?campaigns:campaigns.filter(c=>c.id===campaignId),[campaignId,campaigns]);

  return <section className="surface overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
      <div>
        <p className="eyebrow">Campanhas</p>
        <h2 className="mt-2 text-2xl font-black text-[#09113f]">Desempenho por campanha</h2>
        <p className="mt-1 text-sm text-zinc-500">Use o filtro para analisar uma campanha específica.</p>
      </div>
      <label className="w-full text-sm sm:w-72">
        <span className="mb-1 block font-bold text-zinc-500">Filtrar campanha</span>
        <select value={campaignId} onChange={e=>setCampaignId(e.target.value)} className="input">
          <option value="all">Todas as campanhas</option>
          {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
    </div>

    {visible.length?<div className="overflow-x-auto">
      <table className="min-w-[980px] w-full text-left text-sm">
        <thead className="bg-zinc-50 text-[11px] uppercase tracking-[.08em] text-zinc-500">
          <tr><th className="p-4">Campanha</th><th className="p-4">Investimento</th><th className="p-4">Resultados</th><th className="p-4">Impressões</th><th className="p-4">CTR</th><th className="p-4">CPC</th><th className="p-4">CPL</th><th className="p-4">ROAS</th></tr>
        </thead>
        <tbody>
          {visible.map(c=><tr key={c.id} className="border-t border-zinc-100 transition hover:bg-blue-50/35">
            <td className="p-4 font-black text-[#09113f]">{c.name}</td>
            <td className="p-4">{brl(c.spend)}</td>
            <td className="p-4"><p className="font-black text-brand">{num(c.leads)} leads</p><p className="mt-1 text-xs text-zinc-500">{num(c.clicks)} cliques</p></td>
            <td className="p-4">{num(c.impressions)}</td>
            <td className="p-4">{c.ctr.toFixed(2)}%</td>
            <td className="p-4">{brl(c.cpc)}</td>
            <td className="p-4">{c.leads?brl(c.cpl):"—"}</td>
            <td className="p-4 font-bold">{c.roas?c.roas.toFixed(2)+"x":"—"}</td>
          </tr>)}
        </tbody>
      </table>
    </div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma campanha encontrada neste período.</div>}
  </section>;
}

const brl=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const num=(v:number)=>new Intl.NumberFormat("pt-BR").format(v);
