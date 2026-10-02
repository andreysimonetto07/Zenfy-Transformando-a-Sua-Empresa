import ClientShowcaseGallery from "@/components/ClientShowcaseGallery";
import { requireClientPortal, brl, dateBr, statusLabel } from "@/lib/client-portal";

export default async function ProjetosPage() {
  const { supabase }=await requireClientPortal();
  const { data }=await supabase.from("projects").select("*").order("created_at",{ascending:false});
  const projects=data ?? [];

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Execução</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Projetos</h1><p className="mt-2 text-zinc-600">Acompanhe o que está em planejamento, desenvolvimento e entrega.</p></div>
    {projects.length ? <div className="grid gap-5 lg:grid-cols-2">{projects.map(p=><article key={p.id} className="surface p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.13em] text-brand">{p.type || "Projeto"}</p><h2 className="mt-2 text-2xl font-black text-[#09113f]">{p.name}</h2></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand">{statusLabel(p.status)}</span></div>{p.description&&<p className="mt-4 leading-relaxed text-zinc-600">{p.description}</p>}<div className="mt-5"><div className="flex justify-between text-xs font-bold text-zinc-500"><span>Progresso</span><span>{p.progress ?? 0}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full brand-gradient" style={{width:`${p.progress ?? 0}%`}}/></div></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><Info label="Início" value={dateBr(p.start_date)}/><Info label="Prazo" value={dateBr(p.deadline)}/>{p.price!=null&&<Info label="Valor" value={brl(p.price)}/>}</div></article>)}</div> : <div className="surface p-10 text-center text-sm text-zinc-500">Nenhum projeto cadastrado ainda.</div>}

    <ClientShowcaseGallery />
  </div>;
}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-xs font-bold text-zinc-400">{label}</p><p className="mt-1 font-bold text-[#09113f]">{value}</p></div>}
