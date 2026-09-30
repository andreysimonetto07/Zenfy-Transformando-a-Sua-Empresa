import { requireClientPortal, statusLabel } from "@/lib/client-portal";

export default async function SitesPage() {
  const { supabase, client } = await requireClientPortal();
  const clientId=client?.id || "00000000-0000-0000-0000-000000000000";
  const { data }=await supabase.from("client_sites").select("*").eq("client_id",clientId).order("created_at",{ascending:false});
  const sites=data ?? [];

  return <div className="mx-auto max-w-6xl">
    <div className="mb-7"><p className="eyebrow">Presença digital</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Sites da sua empresa</h1><p className="mt-2 text-zinc-600">Veja os sites, domínios e projetos web que a Zenfy mantém para sua empresa.</p></div>
    {sites.length ? <div className="grid gap-5 md:grid-cols-2">{sites.map(site=><article key={site.id} className="surface p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.13em] text-brand">{site.platform || "Web"}</p><h2 className="mt-2 text-2xl font-black text-[#09113f]">{site.name}</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{statusLabel(site.status)}</span></div>{site.domain&&<p className="mt-3 text-sm text-zinc-500">{site.domain}</p>}{site.notes&&<p className="mt-4 text-sm leading-relaxed text-zinc-600">{site.notes}</p>}{site.url&&<a href={site.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full sm:w-auto">Abrir site ↗</a>}</article>)}</div> : <div className="surface p-10 text-center text-sm text-zinc-500">Nenhum site foi vinculado à sua conta ainda.</div>}
  </div>;
}
