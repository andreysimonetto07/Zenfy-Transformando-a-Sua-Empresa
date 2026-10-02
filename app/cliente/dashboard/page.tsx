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

  const [metricsRes,projectsRes,invoicesRes,sitesRes,integrationRes,manualRes,dailyUpdatesRes]=await Promise.all([
    supabase.from("ad_daily_metrics").select("*").eq("client_id",clientId).eq("provider","meta_ads").eq("level","account").gte("date",previousStart).order("date",{ascending:true}),
    supabase.from("projects").select("id,name,status,progress,deadline").order("created_at",{ascending:false}).limit(3),
    supabase.from("invoices").select("*").eq("client_id",clientId).in("status",["pendente","atrasado"]).order("due_date",{ascending:true}).limit(1),
    supabase.from("client_sites").select("id",{count:"exact",head:true}).eq("client_id",clientId).eq("status","ativo"),
    supabase.from("analytics_integrations").select("status,last_synced_at,account_name").eq("client_id",clientId).eq("provider","meta_ads").maybeSingle(),
    supabase.from("traffic_reports").select("*").eq("client_id",clientId).order("period_end",{ascending:false}).limit(1),
    supabase.from("client_daily_updates").select("*").eq("client_id",clientId).order("update_date",{ascending:false}).limit(5),
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
  const dailyUpdates=dailyUpdatesRes.data??[];

  const leadSeries=current.map((row:any)=>({label:shortDate(row.date),value:Number(row.leads||0)}));

  return <div className="mx-auto max-w-7xl">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-6 text-white shadow-2xl shadow-blue-950/10 sm:p-8 lg:p-10">
      <div className="absolute inset-0 zenfy-dark-art opacity-80"/>
      <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Visão geral</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Olá, {profile.name}.</h1>
          <p className="mt-3 max-w-2xl text-blue-50/80">Aqui você vê o que realmente importa sobre {company?.name||"sua empresa"} sem precisar procurar informação em várias telas.</p>
          {integration?.last_synced_at&&<p className="mt-4 text-xs font-bold text-cyan-100/70">Meta Ads atualizado em {new Date(integration.last_synced_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})}</p>}
        </div>
        <Link href="/cliente/resultados" className="header-cta w-full lg:w-auto"><span>Ver resultados detalhados</span><span className="header-cta-arrow">→</span></Link>
      </div>
    </section>

    {!hasAuto&&!manual ? (
      <section className="surface mt-6 p-6 sm:p-8">
        <p className="eyebrow">Sua área está pronta</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-[#09113f]">Assim que a primeira campanha for conectada, seus resultados aparecem aqui.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-zinc-600">Enquanto isso, você já consegue acompanhar projetos, faturamento e falar com o suporte pelo botão de WhatsApp no canto da tela.</p>
      </section>
    ) : (
      <>
        <section className="mt-6">
          <div className="mb-4">
            <p className="eyebrow">Resumo dos últimos 30 dias</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Seus principais números</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {hasAuto ? <>
              <AnalyticsMetricCard label="Investimento" value={brl(totals.spend)} comparison={comparisonPercent(totals.spend,prev.spend)} hint="Valor investido em anúncios"/>
              <AnalyticsMetricCard label="Resultados" value={numberBr(totals.leads)+" leads"} comparison={comparisonPercent(totals.leads,prev.leads)} hint={numberBr(totals.clicks)+" cliques · CPL "+(totals.leads?brl(totals.cpl):"—")}/>
              <AnalyticsMetricCard label="Alcance" value={numberBr(totals.reach)} comparison={comparisonPercent(totals.reach,prev.reach)} hint={numberBr(totals.impressions)+" impressões"}/>
              <AnalyticsMetricCard label="Retorno" value={totals.roas?totals.roas.toFixed(2)+"x":"—"} comparison={comparisonPercent(totals.roas,prev.roas)} hint={totals.revenue?"Faturamento atribuído "+brl(totals.revenue):"Sem faturamento atribuído"}/>
            </> : <>
              <AnalyticsMetricCard label="Investimento" value={brl(manual.spend)} hint={manual.platform}/>
              <AnalyticsMetricCard label="Resultados" value={numberBr(manual.leads)+" leads"} hint={numberBr(manual.clicks)+" cliques · CPL "+(Number(manual.leads)?brl(Number(manual.spend)/Number(manual.leads)):"—")}/>
              <AnalyticsMetricCard label="Alcance" value={numberBr(manual.impressions)} hint="Dado publicado pela Zenfy"/>
              <AnalyticsMetricCard label="Retorno" value={Number(manual.spend)?(Number(manual.revenue)/Number(manual.spend)).toFixed(2)+"x":"—"} hint={manual.revenue?"Faturamento "+brl(manual.revenue):"Sem faturamento atribuído"}/>
            </>}
          </div>
        </section>

        {hasAuto&&<div className="mt-6">
          <PerformanceChart title="Leads ao longo do mês" data={leadSeries} description="Uma visão simples da evolução dos contatos gerados pelas campanhas."/>
        </div>}
      </>
    )}

    <section className="mt-6">
      <div className="mb-4">
        <p className="eyebrow">Acompanhamento da Zenfy</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">O que aconteceu nos últimos dias</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500">Um resumo simples do que nossa equipe fez, do que mudou e do que vem a seguir.</p>
      </div>

      {dailyUpdates.length ? <div className="grid gap-4">
        {dailyUpdates.map((update:any,index:number)=><article key={update.id} className={`relative overflow-hidden rounded-[1.5rem] border bg-white p-5 shadow-sm ${index===0?"border-blue-200 shadow-blue-950/5":"border-zinc-200"}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-brand">{dateBr(update.update_date)}{index===0?" · Mais recente":""}</p>
              <h3 className="mt-1.5 text-xl font-black text-[#09113f]">{update.title}</h3>
            </div>
            {index===0&&<span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand">Atualização da equipe</span>}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <UpdateBlock label="O que fizemos" value={update.work_done}/>
            <UpdateBlock label="O que aconteceu" value={update.results||"Sem observações adicionais neste dia."}/>
            <UpdateBlock label="Próximos passos" value={update.next_steps||"A equipe seguirá acompanhando a operação."}/>
          </div>
        </article>)}
      </div> : <div className="surface p-6 text-sm text-zinc-500">A equipe ainda não publicou um relatório diário para esta conta.</div>}
    </section>

    <section className="mt-6">
      <div className="mb-4">
        <p className="eyebrow">Sua conta</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Acesse o que precisar</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/cliente/resultados" className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
          <p className="text-xs font-black uppercase tracking-[.12em] text-brand">Campanhas</p>
          <p className="mt-2 text-xl font-black text-[#09113f]">Resultados detalhados</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">Campanhas, anúncios, custos, alcance e comparação por período.</p>
          <span className="mt-4 inline-block font-black text-brand transition-transform group-hover:translate-x-1">Abrir resultados →</span>
        </Link>

        <Link href="/cliente/projetos" className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
          <p className="text-xs font-black uppercase tracking-[.12em] text-brand">Projetos</p>
          <p className="mt-2 text-xl font-black text-[#09113f]">{projects.length?projects.length+" em acompanhamento":"Nenhum projeto ativo"}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">Veja andamento, prazo e progresso das entregas da Zenfy.</p>
          <span className="mt-4 inline-block font-black text-brand transition-transform group-hover:translate-x-1">Ver projetos →</span>
        </Link>

        <Link href="/cliente/faturamento" className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
          <p className="text-xs font-black uppercase tracking-[.12em] text-brand">Faturamento</p>
          <p className="mt-2 text-xl font-black text-[#09113f]">{invoice?brl(invoice.amount):"Tudo em dia"}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{invoice?invoice.description+" · vence "+dateBr(invoice.due_date):"Nenhuma cobrança pendente no momento."}</p>
          <span className="mt-4 inline-block font-black text-brand transition-transform group-hover:translate-x-1">Abrir faturamento →</span>
        </Link>
      </div>
    </section>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
      <section className="surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div><p className="eyebrow">Projetos recentes</p><h2 className="mt-1 text-xl font-black text-[#09113f]">Andamento</h2></div>
          <Link href="/cliente/projetos" className="text-sm font-black text-brand hover:underline">Ver todos →</Link>
        </div>
        {projects.length?<div className="mt-5 grid gap-4">{projects.map(p=><article key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-black text-[#09113f]">{p.name}</p><p className="mt-1 text-sm text-zinc-500">{p.status}</p></div><span className="text-sm font-black text-brand">{p.progress??0}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full brand-gradient" style={{width:`${p.progress??0}%`}}/></div>{p.deadline&&<p className="mt-2 text-xs text-zinc-400">Prazo: {dateBr(p.deadline)}</p>}</article>)}</div>:<p className="mt-5 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">Nenhum projeto ativo no momento.</p>}
      </section>

      <section className="surface p-5 sm:p-6">
        <p className="eyebrow">Estrutura digital</p>
        <h2 className="mt-2 text-xl font-black text-[#09113f]">Sites e plano</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Mini label="Sites ativos" value={String(sitesRes.count??0)}/>
          <Mini label="Plano" value={client?.plan||"—"}/>
        </div>
        <Link href="/cliente/sites" className="btn btn-ghost mt-4 w-full">Ver sites e páginas</Link>
      </section>
    </div>
  </div>;
}

function UpdateBlock({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-zinc-50 p-4"><p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600">{value}</p></div>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-blue-50/70 p-4"><p className="text-xs font-bold text-zinc-500">{label}</p><p className="mt-1 truncate text-lg font-black text-[#09113f]">{value}</p></div>}
function shortDate(value:string){return new Date(value+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
