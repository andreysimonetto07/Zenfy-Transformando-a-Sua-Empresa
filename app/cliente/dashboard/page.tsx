import Link from "next/link";
import AnalyticsMetricCard from "@/components/AnalyticsMetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import { requireClientPortal, brl, dateBr, numberBr } from "@/lib/client-portal";
import { comparisonPercent, isoDaysAgo, summarizeAnalytics } from "@/lib/analytics";
import { syncMetaIfStale } from "@/lib/meta-ads";

export default async function ClientDashboard() {
  const {supabase,profile,client,company}=await requireClientPortal();
  const clientId=client?.id||"00000000-0000-0000-0000-000000000000";

  if(client) await syncMetaIfStale(client.id,20);

  const currentStart=isoDaysAgo(29);
  const previousStart=isoDaysAgo(59);
  const previousEnd=isoDaysAgo(30);

  const [metricsRes,projectsRes,messagesRes,requestsRes,invoicesRes,sitesRes,integrationRes,manualRes]=await Promise.all([
    supabase.from("ad_daily_metrics").select("*").eq("client_id",clientId).eq("provider","meta_ads").eq("level","account").gte("date",previousStart).order("date",{ascending:true}),
    supabase.from("projects").select("id,name,status,progress,deadline").order("created_at",{ascending:false}).limit(3),
    supabase.from("messages").select("id",{count:"exact",head:true}).eq("receiver_id",profile.id).eq("read",false),
    supabase.from("service_requests").select("id",{count:"exact",head:true}).eq("client_id",profile.id).neq("status","concluida"),
    supabase.from("invoices").select("*").eq("client_id",clientId).in("status",["pendente","atrasado"]).order("due_date",{ascending:true}).limit(1),
    supabase.from("client_sites").select("id",{count:"exact",head:true}).eq("client_id",clientId).eq("status","ativo"),
    supabase.from("analytics_integrations").select("status,last_synced_at,account_name").eq("client_id",clientId).eq("provider","meta_ads").maybeSingle(),
    supabase.from("traffic_reports").select("*").eq("client_id",clientId).order("period_end",{ascending:false}).limit(1),
  ]);

  const all=(metricsRes.data??[]) as any[];
  const current=all.filter((row:any)=>row.date>=currentStart);
  const previous=all.filter((row:any)=>row.date>=previousStart&&row.date<=previousEnd);
  const totals=summarizeAnalytics(current as any[]);
  const prev=summarizeAnalytics(previous as any[]);
  const hasAuto=current.length>0;
  const manual=manualRes.data?.[0]??null;
  const projects=projectsRes.data??[];
  const invoice=invoicesRes.data?.[0]??null;
  const integration=integrationRes.data??null;

  const leadSeries=current.map((row:any)=>({label:shortDate(row.date),value:Number(row.leads||0)}));
  const spendSeries=current.map((row:any)=>({label:shortDate(row.date),value:Number(row.spend||0)}));

  return <div className="mx-auto max-w-7xl">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-6 text-white shadow-2xl shadow-blue-950/10 sm:p-8 lg:p-10">
      <div className="absolute inset-0 zenfy-dark-art opacity-80"/>
      <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Visão geral</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Olá, {profile.name}.</h1>
          <p className="mt-3 max-w-2xl text-blue-50/80">{company?.name||"Sua empresa"} tem resultados, projetos e atendimento concentrados aqui.</p>
          {integration?.last_synced_at&&<p className="mt-4 text-xs font-bold text-cyan-100/70">Meta Ads sincronizado em {new Date(integration.last_synced_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})}</p>}
        </div>
        <Link href="/cliente/resultados" className="header-cta w-full lg:w-auto"><span>Ver resultados completos</span><span className="header-cta-arrow">→</span></Link>
      </div>
    </section>

    {!hasAuto&&!manual ? (
      <section className="surface mt-6 p-6 sm:p-8">
        <p className="eyebrow">Sua área está pronta</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-[#09113f]">Os números aparecem assim que a equipe conectar ou publicar sua primeira campanha.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-zinc-600">Enquanto isso, você já pode falar com a Zenfy, enviar materiais, abrir suporte e acompanhar seus projetos.</p>
        <QuickGrid messages={messagesRes.count??0} requests={requestsRes.count??0}/>
      </section>
    ) : (
      <>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {hasAuto ? <>
            <AnalyticsMetricCard label="Investimento · 30 dias" value={brl(totals.spend)} comparison={comparisonPercent(totals.spend,prev.spend)} hint="Meta Ads"/>
            <AnalyticsMetricCard label="Leads · 30 dias" value={numberBr(totals.leads)} comparison={comparisonPercent(totals.leads,prev.leads)} hint={totals.leads?`CPL ${brl(totals.cpl)}`:"Sem leads"}/>
            <AnalyticsMetricCard label="CTR" value={totals.ctr.toFixed(2)+"%"} comparison={comparisonPercent(totals.ctr,prev.ctr)} hint={`CPC ${brl(totals.cpc)}`}/>
            <AnalyticsMetricCard label="ROAS" value={totals.roas?totals.roas.toFixed(2)+"x":"—"} comparison={comparisonPercent(totals.roas,prev.roas)} hint={`Receita ${brl(totals.revenue)}`}/>
          </> : <>
            <AnalyticsMetricCard label="Investimento" value={brl(manual.spend)} hint={manual.platform}/>
            <AnalyticsMetricCard label="Leads" value={numberBr(manual.leads)} hint={Number(manual.leads)?`CPL ${brl(Number(manual.spend)/Number(manual.leads))}`:"Sem leads"}/>
            <AnalyticsMetricCard label="Cliques" value={numberBr(manual.clicks)} hint="Dado manual"/>
            <AnalyticsMetricCard label="ROAS" value={Number(manual.spend)?(Number(manual.revenue)/Number(manual.spend)).toFixed(2)+"x":"—"} hint="Dado manual"/>
          </>}
        </div>

        {hasAuto&&<div className="mt-6 grid gap-6 xl:grid-cols-2">
          <PerformanceChart title="Leads nos últimos 30 dias" data={leadSeries} description="Resultado diário importado da Meta."/>
          <PerformanceChart title="Investimento nos últimos 30 dias" data={spendSeries} description="Quanto foi investido por dia." format="currency"/>
        </div>}
      </>
    )}

    <QuickGrid messages={messagesRes.count??0} requests={requestsRes.count??0}/>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section className="surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Projetos</p><h2 className="mt-1 text-2xl font-black text-[#09113f]">Em andamento</h2></div><Link href="/cliente/projetos" className="text-sm font-black text-brand hover:underline">Ver todos →</Link></div>
        {projects.length?<div className="mt-5 grid gap-4">{projects.map(p=><article key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-black text-[#09113f]">{p.name}</p><p className="mt-1 text-sm text-zinc-500">{p.status}</p></div><span className="text-sm font-black text-brand">{p.progress??0}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full brand-gradient" style={{width:`${p.progress??0}%`}}/></div>{p.deadline&&<p className="mt-2 text-xs text-zinc-400">Prazo: {dateBr(p.deadline)}</p>}</article>)}</div>:<p className="mt-5 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">Nenhum projeto ativo.</p>}
      </section>

      <div className="grid gap-6">
        <section className="surface p-5"><p className="eyebrow">Estrutura</p><div className="mt-4 grid grid-cols-2 gap-3"><Mini label="Sites ativos" value={String(sitesRes.count??0)}/><Mini label="Plano" value={client?.plan||"—"}/></div><Link href="/cliente/sites" className="btn btn-ghost mt-4 w-full">Ver sites e páginas</Link></section>
        <section className="surface p-5"><p className="eyebrow">Financeiro</p>{invoice?<><p className="mt-3 text-2xl font-black text-[#09113f]">{brl(invoice.amount)}</p><p className="mt-1 text-sm text-zinc-500">{invoice.description}</p><p className="mt-1 text-xs text-zinc-400">Vence {dateBr(invoice.due_date)}</p></>:<p className="mt-3 text-sm text-zinc-500">Nenhuma cobrança pendente.</p>}<Link href="/cliente/faturamento" className="btn btn-ghost mt-4 w-full">Faturamento</Link></section>
      </div>
    </div>
  </div>;
}

function QuickGrid({messages,requests}:{messages:number;requests:number}) {
  const items=[
    ["/cliente/resultados","Resultados","Gráficos, campanhas e métricas","↗"],
    ["/cliente/mensagens","Mensagens",messages?messages+" nova(s)":"Fale com a equipe","→"],
    ["/cliente/suporte","Suporte",requests?requests+" solicitação(ões)":"Abrir atendimento","→"],
    ["/cliente/arquivos","Arquivos","Enviar ou acessar materiais","→"],
    ["/cliente/faturamento","Faturamento","Cobranças e pagamentos","→"],
    ["/cliente/perfil","Minha conta","Dados e notificações","→"],
  ];
  return <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(([href,title,text,arrow])=><Link key={href} href={href} className="group rounded-[1.4rem] border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#09113f]">{title}</p><p className="mt-1 text-sm text-zinc-500">{text}</p></div><span className="text-lg font-black text-brand transition-transform group-hover:translate-x-1">{arrow}</span></div></Link>)}</section>;
}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-blue-50/70 p-4"><p className="text-xs font-bold text-zinc-500">{label}</p><p className="mt-1 truncate text-lg font-black text-[#09113f]">{value}</p></div>}
function shortDate(value:string){return new Date(value+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
