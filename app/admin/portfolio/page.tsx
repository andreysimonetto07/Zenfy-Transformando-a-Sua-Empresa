import AdminPortfolioForm from "@/components/AdminPortfolioForm";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { togglePortfolioPublishAction, toggleTestimonialPublishAction } from "@/app/admin/portfolio/actions";

export default async function AdminPortfolioPage() {
  const { supabase }=await requireProfile(ADMIN_ROLES);
  const [{data:projects},{data:testimonials}]=await Promise.all([
    supabase.from("portfolio_projects").select("id,name,client_name,category,published,featured,date").order("date",{ascending:false}),
    supabase.from("testimonials").select("id,name,company,published,featured,created_at").order("created_at",{ascending:false}),
  ]);

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Marketing Zenfy</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Portfólio, cases e avaliações</h1><p className="mt-2 max-w-2xl text-zinc-600">Publique somente trabalhos, resultados e depoimentos reais. O site público usa estes dados automaticamente.</p></div>

    <AdminPortfolioForm />

    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <section className="surface p-6"><h2 className="text-xl font-black text-[#09113f]">Projetos e cases</h2><div className="mt-4 divide-y divide-zinc-100">{(projects??[]).map((p:any)=><div key={p.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-bold text-[#09113f]">{p.name}</p><p className="text-xs text-zinc-500">{p.client_name||"Sem cliente"} · {p.category||"projeto"} {p.featured?"· destaque":""}</p></div><form action={togglePortfolioPublishAction}><input type="hidden" name="id" value={p.id}/><input type="hidden" name="published" value={String(Boolean(p.published))}/><button className={`rounded-xl px-3 py-2 text-xs font-black ${p.published?"bg-emerald-50 text-emerald-700":"bg-zinc-100 text-zinc-500"}`}>{p.published?"Publicado":"Rascunho"}</button></form></div>)}</div>{!(projects??[]).length&&<p className="mt-4 text-sm text-zinc-500">Nenhum item ainda.</p>}</section>

      <section className="surface p-6"><h2 className="text-xl font-black text-[#09113f]">Avaliações</h2><div className="mt-4 divide-y divide-zinc-100">{(testimonials??[]).map((t:any)=><div key={t.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-bold text-[#09113f]">{t.name}</p><p className="text-xs text-zinc-500">{t.company||"Sem empresa"} {t.featured?"· destaque":""}</p></div><form action={toggleTestimonialPublishAction}><input type="hidden" name="id" value={t.id}/><input type="hidden" name="published" value={String(Boolean(t.published))}/><button className={`rounded-xl px-3 py-2 text-xs font-black ${t.published?"bg-emerald-50 text-emerald-700":"bg-zinc-100 text-zinc-500"}`}>{t.published?"Publicado":"Rascunho"}</button></form></div>)}</div>{!(testimonials??[]).length&&<p className="mt-4 text-sm text-zinc-500">Nenhuma avaliação ainda.</p>}</section>
    </div>
  </div>;
}
