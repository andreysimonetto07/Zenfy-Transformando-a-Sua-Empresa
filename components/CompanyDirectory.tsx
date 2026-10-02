"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CompanyDirectoryItem = {
  id:string;
  name:string;
  industry:string;
  city:string;
  state:string;
  whatsapp:string;
  website:string;
  leads:number;
  lastContact:string|null;
};

export default function CompanyDirectory({items}:{items:CompanyDirectoryItem[]}){
  const [q,setQ]=useState("");
  const [industry,setIndustry]=useState("");
  const [city,setCity]=useState("");
  const [website,setWebsite]=useState("");
  const [sort,setSort]=useState("recent");

  const industries=useMemo(()=>[...new Set(items.map(i=>i.industry).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR")), [items]);
  const cities=useMemo(()=>[...new Set(items.map(i=>i.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR")), [items]);

  const visible=useMemo(()=>{
    const query=q.trim().toLocaleLowerCase("pt-BR");
    const list=items.filter(item=>{
      if(query && ![item.name,item.industry,item.city,item.state,item.whatsapp].join(" ").toLocaleLowerCase("pt-BR").includes(query)) return false;
      if(industry && item.industry!==industry) return false;
      if(city && item.city!==city) return false;
      if(website==="yes" && !item.website) return false;
      if(website==="no" && item.website) return false;
      return true;
    });

    return [...list].sort((a,b)=>{
      if(sort==="name") return a.name.localeCompare(b.name,"pt-BR");
      if(sort==="leads") return b.leads-a.leads;
      if(sort==="contact") return (b.lastContact||"").localeCompare(a.lastContact||"");
      return 0;
    });
  },[items,q,industry,city,website,sort]);

  const withSite=items.filter(i=>i.website).length;
  const withoutSite=items.length-withSite;

  function clear(){
    setQ("");setIndustry("");setCity("");setWebsite("");setSort("recent");
  }

  return <>
    <div className="grid gap-3 sm:grid-cols-3">
      <Summary label="Empresas cadastradas" value={String(items.length)} text="Base comercial"/>
      <Summary label="Com site" value={String(withSite)} text="Presença digital existente"/>
      <Summary label="Sem site" value={String(withoutSite)} text="Oportunidade para oferta"/>
    </div>

    <section className="surface mt-5 p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_.9fr_.9fr]">
        <label className="relative">
          <span className="sr-only">Buscar empresa</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar nome, nicho, cidade..." className="input pl-11"/>
        </label>
        <select value={industry} onChange={e=>setIndustry(e.target.value)} className="input">
          <option value="">Todos os nichos</option>
          {industries.map(value=><option key={value}>{value}</option>)}
        </select>
        <select value={city} onChange={e=>setCity(e.target.value)} className="input">
          <option value="">Todas as cidades</option>
          {cities.map(value=><option key={value}>{value}</option>)}
        </select>
        <select value={website} onChange={e=>setWebsite(e.target.value)} className="input">
          <option value="">Site: todos</option>
          <option value="yes">Com site</option>
          <option value="no">Sem site</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="input">
          <option value="recent">Mais recentes</option>
          <option value="name">A-Z</option>
          <option value="leads">Mais leads</option>
          <option value="contact">Contato recente</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-500"><strong className="text-[#09113f]">{visible.length}</strong> de {items.length} empresas</p>
        {(q||industry||city||website||sort!=="recent")&&<button type="button" onClick={clear} className="text-sm font-black text-brand hover:underline">Limpar filtros</button>}
      </div>
    </section>

    {visible.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visible.map(item=><Link key={item.id} href={"/admin/empresas/"+item.id} className="group surface relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 brand-gradient opacity-0 transition group-hover:opacity-100"/>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xl font-black tracking-[-0.02em] text-[#09113f]">{item.name}</p>
            <p className="mt-1 truncate text-sm font-bold text-brand">{item.industry||"Nicho não informado"}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[.08em] ${item.website?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{item.website?"Com site":"Sem site"}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Mini label="Local" value={[item.city,item.state].filter(Boolean).join(" - ")||"—"}/>
          <Mini label="Leads" value={String(item.leads)}/>
          <Mini label="WhatsApp" value={item.whatsapp||"—"}/>
          <Mini label="Último contato" value={date(item.lastContact)}/>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-xs font-semibold text-zinc-400">{item.website?"Presença digital cadastrada":"Boa oportunidade para site/landing"}</span>
          <span className="font-black text-brand transition-transform group-hover:translate-x-1">Abrir →</span>
        </div>
      </Link>)}
    </div> : <div className="surface mt-5 p-10 text-center"><p className="font-black text-[#09113f]">Nenhuma empresa encontrada</p><p className="mt-1 text-sm text-zinc-500">Tente remover um dos filtros.</p><button type="button" onClick={clear} className="btn btn-ghost mt-4">Limpar filtros</button></div>}
  </>;
}

function Summary({label,value,text}:{label:string;value:string;text:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-3xl font-black text-[#09113f]">{value}</p><p className="mt-1 text-xs text-zinc-500">{text}</p></div>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-[10px] font-black uppercase tracking-[.1em] text-zinc-400">{label}</p><p className="mt-1 truncate text-sm font-bold text-[#09113f]">{value}</p></div>}
function date(value:string|null){return value?new Intl.DateTimeFormat("pt-BR",{dateStyle:"short"}).format(new Date(value)):"—"}
