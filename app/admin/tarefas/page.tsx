import SupportStatusSelect from "@/components/SupportStatusSelect";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { dateBr } from "@/lib/client-portal";

export default async function TarefasAdmin(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const [{data:requests},{data:tasks}]=await Promise.all([
    supabase.from("service_requests").select("*,profiles:client_id(name,email)").order("created_at",{ascending:false}).limit(100),
    supabase.from("tasks").select("*,projects(name)").order("created_at",{ascending:false}).limit(100),
  ]);

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Operação</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Tarefas e suporte</h1><p className="mt-2 text-zinc-600">Demandas internas e solicitações abertas pelos clientes.</p></div>
    <section className="surface overflow-hidden"><div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black">Solicitações de clientes</h2></div>{(requests??[]).length?<div className="divide-y divide-zinc-100">{(requests??[]).map((r:any)=>{const person=Array.isArray(r.profiles)?r.profiles[0]:r.profiles;return <article key={r.id} className="p-5 sm:p-6"><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-brand">{r.kind||"Suporte"} · {r.priority}</p><h3 className="mt-1 font-black text-[#09113f]">{r.subject}</h3><p className="mt-1 text-xs text-zinc-400">{person?.name||"Cliente"} · {dateBr(r.created_at)}</p></div><SupportStatusSelect id={r.id} status={r.status||"aberta"}/></div><p className="mt-3 text-sm leading-relaxed text-zinc-600">{r.description}</p></article>})}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma solicitação de cliente.</div>}</section>

    <section className="surface mt-6 overflow-hidden"><div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black">Tarefas internas</h2></div>{(tasks??[]).length?<div className="divide-y divide-zinc-100">{(tasks??[]).map((t:any)=><article key={t.id} className="p-5 sm:p-6"><p className="font-black text-[#09113f]">{t.title}</p><p className="mt-1 text-sm text-zinc-500">{(Array.isArray(t.projects)?t.projects[0]?.name:t.projects?.name)||"Sem projeto"} · {t.priority} · {t.status}</p>{t.description&&<p className="mt-2 text-sm text-zinc-600">{t.description}</p>}</article>)}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma tarefa interna.</div>}</section>
  </div>;
}
