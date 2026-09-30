import SupportRequestForm from "@/components/SupportRequestForm";
import { requireClientPortal, dateBr, statusLabel } from "@/lib/client-portal";

export default async function SuportePage() {
  const { supabase, profile }=await requireClientPortal();
  const [{data:requests},{data:projects}]=await Promise.all([
    supabase.from("service_requests").select("*").eq("client_id",profile.id).order("created_at",{ascending:false}),
    supabase.from("projects").select("id,name").order("created_at",{ascending:false}),
  ]);

  return <div className="mx-auto max-w-6xl">
    <div className="mb-7"><p className="eyebrow">Atendimento</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Suporte e solicitações</h1><p className="mt-2 text-zinc-600">Peça alterações, suporte técnico, ajuda com campanhas ou novas demandas.</p></div>
    <SupportRequestForm projects={projects ?? []}/>
    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black text-[#09113f]">Histórico</h2></div>
      {(requests ?? []).length ? <div className="divide-y divide-zinc-100">{(requests ?? []).map(r=><article key={r.id} className="p-5 sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-brand">{r.kind || "Solicitação"} · {r.priority}</p><h3 className="mt-1 font-black text-[#09113f]">{r.subject}</h3></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand">{statusLabel(r.status)}</span></div><p className="mt-3 text-sm leading-relaxed text-zinc-600">{r.description}</p><p className="mt-3 text-xs text-zinc-400">{dateBr(r.created_at)}</p></article>)}</div> : <div className="p-10 text-center text-sm text-zinc-500">Você ainda não abriu nenhuma solicitação.</div>}
    </section>
  </div>;
}
