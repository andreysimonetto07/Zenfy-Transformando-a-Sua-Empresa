import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { dateBr, statusLabel } from "@/lib/client-portal";

export default async function ProjetosAdmin(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const {data}=await supabase.from("projects").select("id,client_id,name,type,status,progress,deadline,clients(id,profiles(name,email),companies(name))").order("created_at",{ascending:false});
  const projects=data??[];
  return <div className="mx-auto max-w-7xl"><div className="mb-7"><p className="eyebrow">Operação</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Projetos</h1><p className="mt-2 text-zinc-600">Visão geral dos projetos ativos e entregas.</p></div>{projects.length?<div className="grid gap-4 lg:grid-cols-2">{projects.map((p:any)=>{const client=Array.isArray(p.clients)?p.clients[0]:p.clients;const company=Array.isArray(client?.companies)?client.companies[0]:client?.companies;return <Link key={p.id} href={p.client_id?`/admin/clientes/${p.client_id}`:"#"} className="surface p-5 transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-brand">{p.type||"Projeto"}</p><h2 className="mt-1 text-xl font-black text-[#09113f]">{p.name}</h2><p className="mt-1 text-sm text-zinc-500">{company?.name||"Cliente"}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand">{statusLabel(p.status)}</span></div><div className="mt-4 h-2 rounded-full bg-zinc-100"><div className="h-full rounded-full brand-gradient" style={{width:`${p.progress??0}%`}}/></div><div className="mt-2 flex justify-between text-xs text-zinc-400"><span>{p.progress??0}%</span><span>Prazo {dateBr(p.deadline)}</span></div></Link>})}</div>:<div className="surface p-10 text-center text-sm text-zinc-500">Nenhum projeto cadastrado.</div>}</div>
}
