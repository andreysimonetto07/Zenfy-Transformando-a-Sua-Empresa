import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl } from "@/lib/client-portal";

export default async function ClientesPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const {data,error}=await supabase.from("clients").select("id,profile_id,company_id,plan,status,value,created_at,profiles(name,email,phone),companies(name,whatsapp,city,state)").order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  const clients=data ?? [];

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Relacionamento</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Clientes</h1><p className="mt-2 text-zinc-600">Contas que já possuem acesso à área do cliente da Zenfy.</p></div>
    {clients.length?<div className="grid gap-4 lg:grid-cols-2">{clients.map((client:any)=>{const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;const company=Array.isArray(client.companies)?client.companies[0]:client.companies;return <Link key={client.id} href={`/admin/clientes/${client.id}`} className="surface group p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-brand">{client.status||"cliente"}</p><h2 className="mt-1 text-xl font-black text-[#09113f]">{company?.name||profile?.name||"Cliente"}</h2><p className="mt-1 text-sm text-zinc-500">{profile?.name} · {profile?.email}</p></div><span className="text-brand transition-transform group-hover:translate-x-1">→</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Info label="Plano" value={client.plan||"—"}/><Info label="Valor" value={client.value!=null?brl(client.value):"—"}/><Info label="WhatsApp" value={company?.whatsapp||"—"}/><Info label="Cidade" value={[company?.city,company?.state].filter(Boolean).join(" - ")||"—"}/></div></Link>})}</div>:<div className="surface p-10 text-center text-sm text-zinc-500">Nenhum cliente cadastrado ainda.</div>}
  </div>;
}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-zinc-50 p-3"><p className="text-xs font-bold text-zinc-400">{label}</p><p className="mt-1 truncate font-bold text-[#09113f]">{value}</p></div>}
