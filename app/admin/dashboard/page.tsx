import Link from "next/link";
import StatCard from "@/components/StatCard";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const modules=[
  ["/admin/leads","Leads","Pipeline e contatos recebidos"],
  ["/admin/empresas","Empresas","Base comercial e prospecção"],
  ["/admin/trafego","Gestão de tráfego","Visão consolidada das campanhas"],
  ["/admin/projetos","Projetos","Entregas e progresso"],
  ["/admin/portfolio","Portfólio & Cases","Projetos públicos e avaliações"],
  ["/admin/propostas","Propostas","Propostas comerciais"],
  ["/admin/tarefas","Tarefas & Suporte","Solicitações e pendências"],
  ["/admin/prospeccao","Prospecção","Rotina comercial"],
];

export default async function AdminDashboard() {
  const {supabase}=await requireProfile(ADMIN_ROLES);

  const countStatus=async(status?:string)=>{
    let q=supabase.from("leads").select("*",{count:"exact",head:true});
    if(status)q=q.eq("status",status);
    const {count}=await q;
    return count??0;
  };

  const [total,news,meetings,clientsCount,activeIntegrations]=await Promise.all([
    countStatus(),
    countStatus("new"),
    countStatus("meeting_scheduled"),
    supabase.from("clients").select("*",{count:"exact",head:true}).then(r=>r.count??0),
    supabase.from("analytics_integrations").select("*",{count:"exact",head:true}).eq("status","active").then(r=>r.count??0),
  ]);

  const {data:clients}=await supabase.from("clients").select("id,status,plan,profiles(name,email),companies(name)").order("created_at",{ascending:false}).limit(5);

  return <div className="mx-auto max-w-7xl">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-6 text-white shadow-2xl sm:p-8">
      <div className="absolute inset-0 zenfy-dark-art opacity-75"/>
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Zenfy Admin</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Controle da operação em um só lugar.</h1><p className="mt-3 max-w-2xl text-blue-50/75">Clientes, campanhas e módulos comerciais organizados sem poluir a navegação lateral.</p></div>
        <Link href="/admin/clientes" className="header-cta"><span>Abrir clientes</span><span className="header-cta-arrow">→</span></Link>
      </div>
    </section>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Leads totais" value={total}/>
      <StatCard label="Novos leads" value={news}/>
      <StatCard label="Reuniões marcadas" value={meetings}/>
      <StatCard label="Clientes" value={clientsCount}/>
      <StatCard label="Meta Ads conectados" value={activeIntegrations}/>
    </div>

    <section className="mt-6">
      <div className="mb-4"><p className="eyebrow">Acesso rápido</p><h2 className="mt-2 text-2xl font-black text-[#09113f]">Módulos da operação</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(([href,title,text])=><Link key={href} href={href} className="group rounded-[1.4rem] border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#09113f]">{title}</p><p className="mt-1 text-sm text-zinc-500">{text}</p></div><span className="text-brand transition-transform group-hover:translate-x-1">→</span></div></Link>)}
      </div>
    </section>

    <section className="surface mt-6 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-100 p-5 sm:p-6"><div><p className="eyebrow">Clientes recentes</p><h2 className="mt-1 text-xl font-black text-[#09113f]">Painéis das empresas</h2></div><Link href="/admin/clientes" className="text-sm font-black text-brand">Ver todos →</Link></div>
      {(clients??[]).length?<div className="divide-y divide-zinc-100">{(clients??[]).map((client:any)=>{const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;const company=Array.isArray(client.companies)?client.companies[0]:client.companies;return <Link key={client.id} href={`/admin/clientes/${client.id}`} className="flex items-center justify-between gap-3 p-5 transition hover:bg-blue-50/40"><div><p className="font-black text-[#09113f]">{company?.name||profile?.name||"Cliente"}</p><p className="mt-1 text-sm text-zinc-500">{profile?.email||""}</p></div><div className="text-right"><p className="text-sm font-bold text-brand">{client.plan||"Sem plano"}</p><p className="mt-1 text-xs text-zinc-400">{client.status||"—"}</p></div></Link>})}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhum cliente ainda.</div>}
    </section>
  </div>;
}
