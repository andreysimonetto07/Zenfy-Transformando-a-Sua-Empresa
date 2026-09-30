import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, dateBr, statusLabel } from "@/lib/client-portal";

export default async function FaturamentoAdminPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const {data:raw}=await supabase.from("invoices").select("*").order("created_at",{ascending:false}).limit(250);
  const invoices=(raw??[]) as any[];
  const clientIds=[...new Set(invoices.map(i=>i.client_id).filter(Boolean))];
  const {data:rawClients}=clientIds.length?await supabase.from("clients").select("id,profiles(name,email),companies(name)").in("id",clientIds):{data:[]};
  const clientMap=new Map<string,string>();
  for(const c of (rawClients??[]) as any[]){const p=Array.isArray(c.profiles)?c.profiles[0]:c.profiles;const co=Array.isArray(c.companies)?c.companies[0]:c.companies;clientMap.set(c.id,co?.name||p?.name||"Cliente")}

  const pending=invoices.filter(i=>i.status==="pendente"||i.status==="atrasado").reduce((s,i)=>s+Number(i.amount||0),0);
  const paid=invoices.filter(i=>i.status==="pago").reduce((s,i)=>s+Number(i.amount||0),0);
  const overdue=invoices.filter(i=>i.status==="atrasado").length;

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Financeiro</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Faturamento</h1><p className="mt-2 text-zinc-600">Cobranças vinculadas aos clientes da Zenfy.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><K label="Em aberto" value={brl(pending)}/><K label="Pago registrado" value={brl(paid)}/><K label="Cobranças atrasadas" value={String(overdue)}/></div>
    <section className="surface mt-6 overflow-hidden">
      {invoices.length?<div className="divide-y divide-zinc-100">{invoices.map(i=><article key={i.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-xs font-black uppercase tracking-[.12em] text-brand">{clientMap.get(i.client_id)||"Cliente"}</p><h2 className="mt-1 font-black text-[#09113f]">{i.description}</h2><p className="mt-1 text-sm text-zinc-500">Vence {dateBr(i.due_date)} · {statusLabel(i.status)}</p></div><div className="sm:text-right"><p className="text-2xl font-black text-[#09113f]">{brl(i.amount)}</p><Link href={`/admin/clientes/${i.client_id}`} className="mt-2 inline-block text-sm font-black text-brand hover:underline">Abrir cliente →</Link></div></article>)}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma cobrança criada. Abra um cliente para cadastrar a primeira.</div>}
    </section>
  </div>;
}
function K({label,value}:{label:string;value:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-black text-[#09113f]">{value}</p></div>}
