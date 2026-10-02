import Link from "next/link";
import AnalyticsMetricCard from "@/components/AnalyticsMetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, numberBr } from "@/lib/client-portal";
import { isoDaysAgo, summarizeAnalytics } from "@/lib/analytics";

export default async function TrafegoAdminPage() {
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const start=isoDaysAgo(29);

  const [metricsRes,integrationsRes,clientsRes,manualRes]=await Promise.all([
    supabase.from("ad_daily_metrics").select("*").eq("provider","meta_ads").eq("level","account").gte("date",start).order("date",{ascending:true}),
    supabase.from("analytics_integrations").select("client_id,status,account_name,external_account_id,last_synced_at,last_error").eq("provider","meta_ads"),
    supabase.from("clients").select("id,profiles(name,email),companies(name)").order("created_at",{ascending:false}),
    supabase.from("traffic_reports").select("id,client_id,platform,period_end,spend,leads").order("period_end",{ascending:false}).limit(20),
  ]);

  const rows=(metricsRes.data??[]) as any[];
  const totals=summarizeAnalytics(rows as any[]);
  const integrations=integrationsRes.data??[];
  const clients=clientsRes.data??[];
  const clientMap=new Map(clients.map((client:any)=>{
    const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;
    const company=Array.isArray(client.companies)?client.companies[0]:client.companies;
    return [client.id,{name:company?.name||profile?.name||"Cliente",email:profile?.email||""}];
  }));

  const dayMap=new Map<string,{spend:number;leads:number}>();
  for(const row of rows){
    const current=dayMap.get(row.date)||{spend:0,leads:0};
    current.spend+=Number(row.spend||0);
    current.leads+=Number(row.leads||0);
    dayMap.set(row.date,current);
  }
  const days=[...dayMap.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
  const leadSeries=days.map(([date,value])=>({label:shortDate(date),value:value.leads}));
  const spendSeries=days.map(([date,value])=>({label:shortDate(date),value:value.spend}));

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow">Campanhas</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Meta Ads da operação</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Visão consolidada dos últimos 30 dias. Cada empresa continua com o próprio painel e edição manual de apoio.</p>
      </div>
      <Link href="/admin/clientes" className="btn btn-primary">Conectar ou editar cliente</Link>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsMetricCard label="Investimento" value={brl(totals.spend)} hint="Contas Meta conectadas"/>
      <AnalyticsMetricCard label="Leads" value={numberBr(totals.leads)} hint={totals.leads?`CPL médio ${brl(totals.cpl)}`:"Sem leads"}/>
      <AnalyticsMetricCard label="Cliques" value={numberBr(totals.clicks)} hint={`CTR ${totals.ctr.toFixed(2)}%`}/>
      <AnalyticsMetricCard label="ROAS" value={totals.roas?totals.roas.toFixed(2)+"x":"—"} hint={`Receita atribuída ${brl(totals.revenue)}`}/>
    </div>

    {rows.length?<div className="mt-6 grid gap-6 xl:grid-cols-2">
      <PerformanceChart title="Leads da operação" description="Soma diária das contas Meta conectadas." data={leadSeries}/>
      <PerformanceChart title="Investimento da operação" description="Investimento diário das contas sincronizadas." data={spendSeries} format="currency"/>
    </div>:<div className="surface mt-6 p-8 text-center text-sm text-zinc-500">Nenhuma conta Meta sincronizada ainda.</div>}

    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-100 p-5 sm:p-6"><p className="eyebrow">Integrações</p><h2 className="mt-2 text-2xl font-black text-[#09113f]">Contas Meta Ads</h2></div>
      {integrations.length?<div className="divide-y divide-zinc-100">{integrations.map((integration:any)=>{
        const client=clientMap.get(integration.client_id) as any;
        return <Link key={integration.client_id} href={`/admin/clientes/${integration.client_id}`} className="flex flex-col gap-3 p-5 transition hover:bg-blue-50/35 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-black text-[#09113f]">{client?.name||"Cliente"}</p><p className="mt-1 text-sm text-zinc-500">{integration.account_name||integration.external_account_id}</p>{integration.last_error&&<p className="mt-1 text-xs text-red-600">{integration.last_error}</p>}</div>
          <div className="text-left sm:text-right"><span className={`rounded-full px-2.5 py-1 text-xs font-black ${integration.status==="active"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{integration.status==="active"?"Conectado":integration.status}</span><p className="mt-2 text-xs text-zinc-400">{integration.last_synced_at?new Date(integration.last_synced_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"Nunca sincronizado"}</p></div>
        </Link>;
      })}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma conta conectada.</div>}
    </section>

    {(manualRes.data??[]).length>0&&<section className="surface mt-6 p-5 sm:p-6">
      <p className="eyebrow">Complemento manual</p><h2 className="mt-2 text-xl font-black text-[#09113f]">Últimos lançamentos manuais</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{(manualRes.data??[]).slice(0,8).map((r:any)=>{const client=clientMap.get(r.client_id) as any;return <Link key={r.id} href={`/admin/clientes/${r.client_id}`} className="rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-blue-200"><p className="font-black text-[#09113f]">{client?.name||"Cliente"}</p><p className="mt-1 text-sm text-zinc-500">{r.platform} · {r.leads} leads · {brl(r.spend)}</p></Link>})}</div>
    </section>}
  </div>;
}

function shortDate(value:string){return new Date(value+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
