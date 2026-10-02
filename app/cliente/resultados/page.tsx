import Link from "next/link";
import AnalyticsMetricCard from "@/components/AnalyticsMetricCard";
import CampaignPerformanceTable from "@/components/CampaignPerformanceTable";
import CreativePerformanceTable from "@/components/CreativePerformanceTable";
import PerformanceChart from "@/components/PerformanceChart";
import ResultsTabs from "@/components/ResultsTabs";
import { requireClientPortal, brl, dateBr, numberBr } from "@/lib/client-portal";
import { aggregateAds, aggregateCampaigns, comparisonPercent, isoDaysAgo, summarizeAnalytics } from "@/lib/analytics";
import { syncMetaIfStale } from "@/lib/meta-ads";

const periods=[7,30,90];

export default async function ResultadosPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {supabase,client,company}=await requireClientPortal();
  const clientId=client?.id||"00000000-0000-0000-0000-000000000000";
  const params=await searchParams;
  const rawPeriod=Array.isArray(params.period)?params.period[0]:params.period;
  const period=periods.includes(Number(rawPeriod))?Number(rawPeriod):30;
  const rawTab=Array.isArray(params.tab)?params.tab[0]:params.tab;
  const tab=["overview","meta","ga","manual"].includes(rawTab||"")?String(rawTab):"overview";

  if(client) await syncMetaIfStale(client.id,20);

  const today=isoDaysAgo(0);
  const currentStart=isoDaysAgo(period-1);
  const previousEnd=isoDaysAgo(period);
  const previousStart=isoDaysAgo(period*2-1);

  const [integrationRes,accountRes,campaignRes,adRes,manualRes]=await Promise.all([
    supabase.from("analytics_integrations").select("provider,external_account_id,account_name,status,last_synced_at,last_error").eq("client_id",clientId),
    supabase.from("ad_daily_metrics").select("*").eq("client_id",clientId).eq("provider","meta_ads").eq("level","account").gte("date",previousStart).lte("date",today).order("date",{ascending:true}),
    supabase.from("ad_daily_metrics").select("*").eq("client_id",clientId).eq("provider","meta_ads").eq("level","campaign").gte("date",currentStart).lte("date",today).order("date",{ascending:true}),
    supabase.from("ad_daily_metrics").select("*").eq("client_id",clientId).eq("provider","meta_ads").eq("level","ad").gte("date",currentStart).lte("date",today).order("date",{ascending:true}),
    supabase.from("traffic_reports").select("*").eq("client_id",clientId).order("period_end",{ascending:false}).limit(100),
  ]);

  const integrations=integrationRes.data??[];
  const metaIntegration=integrations.find((row:any)=>row.provider==="meta_ads")||null;
  const accountRows=(accountRes.data??[]) as any[];
  const currentRows=accountRows.filter((row:any)=>row.date>=currentStart);
  const previousRows=accountRows.filter((row:any)=>row.date>=previousStart&&row.date<=previousEnd);
  const campaigns=aggregateCampaigns((campaignRes.data??[]) as any[]);
  const creatives=aggregateAds((adRes.data??[]) as any[]);
  const totals=summarizeAnalytics(currentRows as any[]);
  const previous=summarizeAnalytics(previousRows as any[]);
  const manual=manualRes.data??[];
  const migrationMissing=Boolean(accountRes.error&&String(accountRes.error.message).includes("ad_daily_metrics"));

  const dailyLeads=currentRows.map((row:any)=>({label:shortDate(row.date),value:Number(row.leads||0)}));
  const dailySpend=currentRows.map((row:any)=>({label:shortDate(row.date),value:Number(row.spend||0)}));

  return <div className="mx-auto max-w-7xl">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow">Resultados</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Performance de {company?.name||"sua empresa"}</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Dados automáticos da Meta, dados manuais da equipe e comparações por período em um só lugar.</p>
      </div>
      <div className="flex gap-2">
        {periods.map((value)=><Link key={value} href={`/cliente/resultados?tab=${tab}&period=${value}`} className={`rounded-full px-4 py-2 text-sm font-black transition ${period===value?"brand-gradient text-white shadow-md":"border border-zinc-200 bg-white text-zinc-600 hover:border-blue-200"}`}>{value} dias</Link>)}
      </div>
    </div>

    <ResultsTabs active={tab} period={period}/>

    {migrationMissing&&<div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">A estrutura de analytics ainda não foi ativada no banco. A equipe Zenfy precisa executar a migration 008.</div>}

    {tab==="ga" ? (
      <section className="surface overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="eyebrow">Google Analytics 4</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Tráfego do site e comportamento vão ficar separados da mídia paga.</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">Esta aba está preparada para receber sessões, usuários, origem do tráfego, páginas mais acessadas, eventos e conversões do GA4. Ela não mistura esses números com Meta Ads para evitar leitura errada.</p>
          </div>
          <div className="rounded-[1.5rem] bg-[#06114f] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[.14em] text-cyan-100">Próxima integração</p>
            <div className="mt-5 grid gap-3">
              {["Sessões e usuários","Origem / mídia","Páginas e landing pages","Eventos e conversões","Engajamento"].map(item=><div key={item} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold">{item}</div>)}
            </div>
          </div>
        </div>
      </section>
    ) : tab==="manual" ? (
      <ManualSection reports={manual}/>
    ) : (
      <>
        <section className="mb-6 flex flex-col gap-3 rounded-[1.5rem] border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#09113f]">{metaIntegration?.status==="active"?"Meta Ads conectado":"Meta Ads ainda não conectado"}</p>
            <p className="mt-1 text-xs text-zinc-500">{metaIntegration?.account_name||metaIntegration?.external_account_id||"A equipe Zenfy pode conectar a conta de anúncios no painel administrativo."}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-zinc-400">Última sincronização</p>
            <p className="mt-1 text-sm font-black text-[#09113f]">{metaIntegration?.last_synced_at?new Date(metaIntegration.last_synced_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"—"}</p>
          </div>
        </section>

        {currentRows.length ? <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsMetricCard label="Investimento" value={brl(totals.spend)} comparison={comparisonPercent(totals.spend,previous.spend)} hint={`Últimos ${period} dias`}/>
            <AnalyticsMetricCard label="Resultados" value={numberBr(totals.leads)+" leads"} comparison={comparisonPercent(totals.leads,previous.leads)} hint={numberBr(totals.clicks)+" cliques · CPL "+(totals.leads?brl(totals.cpl):"—")}/>
            <AnalyticsMetricCard label="Alcance" value={numberBr(totals.reach)} comparison={comparisonPercent(totals.reach,previous.reach)} hint={numberBr(totals.impressions)+" impressões"}/>
            <AnalyticsMetricCard label="Retorno" value={totals.roas?totals.roas.toFixed(2)+"x":"—"} comparison={comparisonPercent(totals.roas,previous.roas)} hint={totals.revenue?`Faturamento atribuído ${brl(totals.revenue)}`:"Sem faturamento atribuído"}/>
          </div>

          {tab==="meta"&&<div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Small label="Impressões" value={numberBr(totals.impressions)}/>
            <Small label="Cliques" value={numberBr(totals.clicks)}/>
            <Small label="CTR" value={totals.ctr.toFixed(2)+"%"}/>
            <Small label="CPC" value={brl(totals.cpc)}/>
            <Small label="CPM" value={brl(totals.cpm)}/>
            <Small label="Frequência" value={totals.frequency.toFixed(2)+"x"}/>
            <Small label="Conversões" value={numberBr(totals.conversions)}/>
            <Small label="Compras" value={numberBr(totals.purchases)}/>
          </div>}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <PerformanceChart title="Leads por dia" description="Evolução diária registrada pela Meta." data={dailyLeads}/>
            <PerformanceChart title="Investimento por dia" description="Valor investido em mídia ao longo do período." data={dailySpend} format="currency"/>
          </div>

          {tab==="meta"&&<>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="CPC" value={brl(totals.cpc)} text="Custo médio por clique."/>
              <Detail label="CPL" value={totals.leads?brl(totals.cpl):"—"} text="Custo médio por lead."/>
              <Detail label="CTR" value={totals.ctr.toFixed(2)+"%"} text="Cliques em relação às impressões."/>
              <Detail label="Frequência" value={totals.frequency.toFixed(2)+"x"} text="Média de vezes que cada pessoa foi impactada."/>
            </div>
            <div className="mt-6"><CampaignPerformanceTable campaigns={campaigns as any}/></div>
            <div className="mt-6"><CreativePerformanceTable items={creatives as any}/></div>
          </>}
        </> : (
          <section className="surface p-8 text-center">
            <p className="eyebrow">Aguardando dados</p>
            <h2 className="mt-3 text-2xl font-black text-[#09113f]">Ainda não há métricas automáticas neste período.</h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">Quando a conta Meta Ads estiver conectada e sincronizada, os gráficos e estatísticas aparecem aqui automaticamente.</p>
          </section>
        )}
      </>
    )}
  </div>;
}

function ManualSection({reports}:{reports:any[]}) {
  return <section className="surface overflow-hidden">
    <div className="border-b border-zinc-100 p-5 sm:p-6"><p className="eyebrow">Complemento manual</p><h2 className="mt-2 text-2xl font-black text-[#09113f]">Dados publicados pela equipe Zenfy</h2><p className="mt-1 text-sm text-zinc-500">Útil para corrigir ou incluir números que não vêm automaticamente das plataformas.</p></div>
    {reports.length?<div className="overflow-x-auto"><table className="min-w-[800px] w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-4">Período</th><th className="p-4">Plataforma</th><th className="p-4">Investido</th><th className="p-4">Cliques</th><th className="p-4">Leads</th><th className="p-4">Faturamento</th></tr></thead><tbody>{reports.map(r=><tr key={r.id} className="border-t border-zinc-100"><td className="p-4">{dateBr(r.period_start)} – {dateBr(r.period_end)}</td><td className="p-4 font-bold">{r.platform}</td><td className="p-4">{brl(r.spend)}</td><td className="p-4">{numberBr(r.clicks)}</td><td className="p-4 font-black text-brand">{numberBr(r.leads)}</td><td className="p-4">{brl(r.revenue)}</td></tr>)}</tbody></table></div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhum dado manual publicado.</div>}
  </section>;
}

function Small({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-1 text-lg font-black text-[#09113f]">{value}</p></div>}
function Detail({label,value,text}:{label:string;value:string;text:string}){return <div className="surface p-5"><p className="eyebrow">{label}</p><p className="mt-2 text-2xl font-black text-[#09113f]">{value}</p><p className="mt-2 text-sm text-zinc-500">{text}</p></div>}
function shortDate(value:string){const d=new Date(value+"T12:00:00");return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
