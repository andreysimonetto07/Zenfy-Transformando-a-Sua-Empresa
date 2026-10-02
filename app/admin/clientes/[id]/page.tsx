import Link from "next/link";
import { notFound } from "next/navigation";
import AdminClientForms from "@/components/AdminClientForms";
import TrafficReportManager from "@/components/TrafficReportManager";
import DailyMetricsQuickUpdate from "@/components/DailyMetricsQuickUpdate";
import MetaIntegrationCard from "@/components/MetaIntegrationCard";
import DailyClientUpdateForm from "@/components/DailyClientUpdateForm";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, dateBr, statusLabel } from "@/lib/client-portal";

export default async function ClienteDetalhe({params}:{params:Promise<{id:string}>}){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const {id}=await params;

  const {data:client}=await supabase
    .from("clients")
    .select("*,profiles(name,email,phone),companies(name,whatsapp,email,website,instagram,city,state)")
    .eq("id",id)
    .maybeSingle();

  if(!client) notFound();

  const profile:any=Array.isArray((client as any).profiles)?(client as any).profiles[0]:(client as any).profiles;
  const company:any=Array.isArray((client as any).companies)?(client as any).companies[0]:(client as any).companies;

  const [projectsRes,sitesRes,trafficRes,invoicesRes,requestsRes,integrationRes,dailyUpdatesRes]=await Promise.all([
    supabase.from("projects").select("*").eq("client_id",id).order("created_at",{ascending:false}),
    supabase.from("client_sites").select("*").eq("client_id",id).order("created_at",{ascending:false}),
    supabase.from("traffic_reports").select("*").eq("client_id",id).order("created_at",{ascending:false}).limit(30),
    supabase.from("invoices").select("*").eq("client_id",id).order("created_at",{ascending:false}).limit(10),
    profile?.id?supabase.from("service_requests").select("*").eq("client_id",profile.id).order("created_at",{ascending:false}).limit(10):Promise.resolve({data:[]}),
    supabase.from("analytics_integrations").select("external_account_id,account_name,status,last_synced_at,last_error").eq("client_id",id).eq("provider","meta_ads").maybeSingle(),
    supabase.from("client_daily_updates").select("*").eq("client_id",id).order("update_date",{ascending:false}).limit(14),
  ]);

  const projects=projectsRes.data??[];
  const sites=sitesRes.data??[];
  const traffic=trafficRes.data??[];
  const invoices=invoicesRes.data??[];
  const requests=(requestsRes as any).data??[];
  const integration=(integrationRes as any).data??null;
  const dailyUpdates=(dailyUpdatesRes as any).data??[];
  const today=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const todayReport=traffic.find((r:any)=>r.period_start===today&&r.period_end===today)??null;
  const todayUpdate=dailyUpdates.find((r:any)=>r.update_date===today)??null;

  return <div className="mx-auto max-w-7xl">
    <section className="surface p-6 sm:p-8">
      <p className="eyebrow">Painel da empresa</p>
      <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#09113f]">{company?.name||profile?.name||"Cliente"}</h1>
          <p className="mt-2 text-zinc-500">{profile?.name} · {profile?.email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {company?.whatsapp && <a href={`https://wa.me/${String(company.whatsapp).replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Falar no WhatsApp ↗</a>}
            <Link href="/admin/trafego" className="btn btn-ghost">Gestão de tráfego</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Badge label="Plano" value={(client as any).plan||"—"}/>
          <Badge label="Status" value={(client as any).status||"—"}/>
          <Badge label="Mensalidade" value={(client as any).value!=null?brl((client as any).value):"—"}/>
        </div>
      </div>
    </section>

    <div className="mt-6">
      <MetaIntegrationCard clientId={id} integration={integration as any} />
    </div>

    <div className="mt-6">
      <DailyMetricsQuickUpdate clientId={id} today={today} initial={todayReport as any} />
    </div>

    <div className="mt-6">
      <DailyClientUpdateForm clientId={id} today={today} initial={todayUpdate as any} />
    </div>

    <div className="mt-6">
      <AdminClientForms clientId={id} companyId={(client as any).company_id} projects={projects.map((p:any)=>({id:p.id,name:p.name}))}/>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <List title="Projetos" empty="Nenhum projeto." items={projects.map((p:any)=>({title:p.name,meta:`${statusLabel(p.status)} · ${p.progress??0}% · prazo ${dateBr(p.deadline)}`}))}/>
      <List title="Sites" empty="Nenhum site vinculado." items={sites.map((s:any)=>({title:s.name,meta:`${statusLabel(s.status)} · ${s.domain||s.url||"sem domínio"}`}))}/>
      <TrafficReportManager clientId={id} reports={traffic as any} />
      <List title="Faturamento" empty="Nenhuma cobrança." items={invoices.map((i:any)=>({title:i.description,meta:`${brl(i.amount)} · ${statusLabel(i.status)} · vence ${dateBr(i.due_date)}`}))}/>
      <List title="Relatórios diários" empty="Nenhum relatório diário." items={dailyUpdates.slice(0,7).map((u:any)=>({title:`${dateBr(u.update_date)} · ${u.title}`,meta:u.work_done}))}/>
      <List title="Suporte" empty="Nenhuma solicitação." items={requests.map((r:any)=>({title:r.subject,meta:`${r.kind} · ${statusLabel(r.status)} · ${r.priority}`}))}/>

      <section className="surface p-6">
        <h2 className="text-xl font-black text-[#09113f]">Contato</h2>
        <div className="mt-4 space-y-2 text-sm text-zinc-600">
          <p><strong>WhatsApp:</strong> {company?.whatsapp||"—"}</p>
          <p><strong>Site:</strong> {company?.website||"—"}</p>
          <p><strong>Instagram:</strong> {company?.instagram||"—"}</p>
          <p><strong>Cidade:</strong> {[company?.city,company?.state].filter(Boolean).join(" - ")||"—"}</p>
        </div>
      </section>
    </div>
  </div>;
}

function Badge({label,value}:{label:string;value:string}) {
  return <div className="rounded-xl bg-blue-50 px-3 py-2"><p className="text-[10px] font-black uppercase tracking-[.11em] text-zinc-400">{label}</p><p className="mt-1 text-sm font-black text-[#09113f]">{value}</p></div>;
}

function List({title,items,empty}:{title:string;items:{title:string;meta:string}[];empty:string}) {
  return <section className="surface p-6"><h2 className="text-xl font-black text-[#09113f]">{title}</h2>{items.length?<div className="mt-4 divide-y divide-zinc-100">{items.map((item,index)=><div key={index} className="py-3 first:pt-0 last:pb-0"><p className="font-bold text-[#09113f]">{item.title}</p><p className="mt-1 text-sm text-zinc-500">{item.meta}</p></div>)}</div>:<p className="mt-4 text-sm text-zinc-500">{empty}</p>}</section>;
}
