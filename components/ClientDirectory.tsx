"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ClientDirectoryItem={
  id:string;company:string;contact:string;email:string;whatsapp:string;city:string;state:string;
  status:string;leads:number|null;spend:number|null;lastDate:string|null;platform:string|null;
};

export default function ClientDirectory({items}:{items:ClientDirectoryItem[]}){
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("");
  const [city,setCity]=useState("");
  const [data,setData]=useState("");
  const [sort,setSort]=useState("recent");

  const statuses=useMemo(()=>[...new Set(items.map(i=>i.status).filter(Boolean))].sort(),[items]);
  const cities=useMemo(()=>[...new Set(items.map(i=>i.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR")),[items]);

  const visible=useMemo(()=>{
    const query=q.trim().toLocaleLowerCase("pt-BR");
    const list=items.filter(item=>{
      if(query && ![item.company,item.contact,item.email,item.whatsapp,item.city].join(" ").toLocaleLowerCase("pt-BR").includes(query))return false;
      if(status&&item.status!==status)return false;
      if(city&&item.city!==city)return false;
      if(data==="yes"&&item.leads==null)return false;
      if(data==="no"&&item.leads!=null)return false;
      return true;
    });

    return [...list].sort((a,b)=>{
      if(sort==="name")return a.company.localeCompare(b.company,"pt-BR");
      if(sort==="spend")return Number(b.spend||0)-Number(a.spend||0);
      if(sort==="leads")return Number(b.leads||0)-Number(a.leads||0);
      if(sort==="updated")return (b.lastDate||"").localeCompare(a.lastDate||"");
      return 0;
    });
  },[items,q,status,city,data,sort]);

  const active=items.filter(i=>["ativo","active"].includes(i.status.toLowerCase())).length;
  const withMetrics=items.filter(i=>i.leads!=null).length;
  const recentSpend=items.reduce((sum,i)=>sum+Number(i.spend||0),0);

  return <>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Summary label="Clientes" value={String(items.length)} text="Empresas com portal"/>
      <Summary label="Ativos" value={String(active)} text="Operação em andamento"/>
      <Summary label="Com métricas" value={String(withMetrics)} text="Resultados publicados"/>
      <Summary label="Investimento recente" value={brl(recentSpend)} text="Último dado de cada cliente"/>
    </div>

    <section className="surface mt-5 p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.7fr_.9fr_.9fr_.9fr_.9fr]">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar empresa, contato, e-mail..." className="input"/>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="input"><option value="">Todos status</option>{statuses.map(v=><option key={v}>{v}</option>)}</select>
        <select value={city} onChange={e=>setCity(e.target.value)} className="input"><option value="">Todas cidades</option>{cities.map(v=><option key={v}>{v}</option>)}</select>
        <select value={data} onChange={e=>setData(e.target.value)} className="input"><option value="">Métricas: todos</option><option value="yes">Com métricas</option><option value="no">Sem métricas</option></select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="input"><option value="recent">Mais recentes</option><option value="name">A-Z</option><option value="updated">Atualização recente</option><option value="leads">Mais leads</option><option value="spend">Maior investimento</option></select>
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-500"><strong className="text-[#09113f]">{visible.length}</strong> de {items.length} clientes</p>
    </section>

    {visible.length?<div className="mt-5 overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-white shadow-xl shadow-blue-950/5">
      <div className="hidden grid-cols-[1.35fr_.75fr_.85fr_.8fr_auto] gap-4 bg-zinc-50 px-5 py-3 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400 lg:grid">
        <span>Empresa</span><span>Status</span><span>Resultados</span><span>Investimento</span><span></span>
      </div>
      <div className="divide-y divide-zinc-100">
        {visible.map(item=><Link key={item.id} href={"/admin/clientes/"+item.id} className="group grid gap-4 p-5 transition hover:bg-blue-50/40 lg:grid-cols-[1.35fr_.75fr_.85fr_.8fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="truncate font-black text-[#09113f]">{item.company}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">{item.contact} · {item.email}</p>
            <p className="mt-1 text-xs text-zinc-400">{[item.city,item.state].filter(Boolean).join(" - ")||"Local não informado"}</p>
          </div>
          <div><span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-brand">{item.status||"cliente"}</span></div>
          <div><p className="font-black text-[#09113f]">{item.leads!=null?item.leads+" leads":"Sem métricas"}</p><p className="mt-1 text-xs text-zinc-500">{item.platform||"—"}</p></div>
          <div><p className="font-black text-[#09113f]">{item.spend!=null?brl(item.spend):"—"}</p><p className="mt-1 text-xs text-zinc-400">{item.lastDate?new Date(item.lastDate+"T12:00:00").toLocaleDateString("pt-BR"):"Sem atualização"}</p></div>
          <span className="justify-self-start font-black text-brand transition-transform group-hover:translate-x-1 lg:justify-self-end">Abrir →</span>
        </Link>)}
      </div>
    </div>:<div className="surface mt-5 p-10 text-center text-sm text-zinc-500">Nenhum cliente corresponde aos filtros.</div>}
  </>;
}

function Summary({label,value,text}:{label:string;value:string;text:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-3xl font-black text-[#09113f]">{value}</p><p className="mt-1 text-xs text-zinc-500">{text}</p></div>}
const brl=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
