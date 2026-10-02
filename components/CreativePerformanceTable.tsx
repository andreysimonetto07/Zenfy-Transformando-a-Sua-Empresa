"use client";

import { useMemo, useState } from "react";

type Creative = {
  id:string;
  name:string;
  campaign:string;
  spend:number;
  impressions:number;
  reach:number;
  clicks:number;
  leads:number;
  cpl:number;
  ctr:number;
};

export default function CreativePerformanceTable({items}:{items:Creative[]}) {
  const [query,setQuery]=useState("");
  const visible=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return items;
    return items.filter(item=>(item.name+" "+item.campaign).toLowerCase().includes(q));
  },[items,query]);

  return <section className="surface overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
      <div>
        <p className="eyebrow">Anúncios / criativos</p>
        <h2 className="mt-2 text-2xl font-black text-[#09113f]">Resultado por anúncio</h2>
        <p className="mt-1 text-sm text-zinc-500">Leads e cliques ficam juntos para facilitar a leitura, sem perder a diferença entre as métricas.</p>
      </div>
      <label className="w-full text-sm sm:w-72">
        <span className="mb-1 block font-bold text-zinc-500">Buscar anúncio</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome do anúncio..." className="input"/>
      </label>
    </div>

    {visible.length?<div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left text-sm">
        <thead className="bg-zinc-50 text-[11px] uppercase tracking-[.08em] text-zinc-500">
          <tr>
            <th className="p-4">Anúncio</th>
            <th className="p-4">Campanha</th>
            <th className="p-4">Investimento</th>
            <th className="p-4">Resultados</th>
            <th className="p-4">Impressões</th>
            <th className="p-4">Alcance</th>
            <th className="p-4">CTR</th>
            <th className="p-4">CPL</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(item=><tr key={item.id} className="border-t border-zinc-100 transition hover:bg-blue-50/35">
            <td className="p-4 font-black text-[#09113f]">{item.name}</td>
            <td className="p-4 text-zinc-500">{item.campaign}</td>
            <td className="p-4">{brl(item.spend)}</td>
            <td className="p-4">
              <p className="font-black text-brand">{num(item.leads)} leads</p>
              <p className="mt-1 text-xs text-zinc-500">{num(item.clicks)} cliques</p>
            </td>
            <td className="p-4">{num(item.impressions)}</td>
            <td className="p-4">{num(item.reach)}</td>
            <td className="p-4">{item.ctr.toFixed(2)}%</td>
            <td className="p-4">{item.leads?brl(item.cpl):"—"}</td>
          </tr>)}
        </tbody>
      </table>
    </div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhum anúncio encontrado neste período.</div>}
  </section>;
}

const brl=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const num=(v:number)=>new Intl.NumberFormat("pt-BR").format(v);
