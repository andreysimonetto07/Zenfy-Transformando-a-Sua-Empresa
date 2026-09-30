import { requireClientPortal, brl, numberBr, dateBr } from "@/lib/client-portal";

export default async function TrafegoPage() {
  const { supabase, client } = await requireClientPortal();
  const clientId = client?.id || "00000000-0000-0000-0000-000000000000";
  const { data } = await supabase.from("traffic_reports").select("*").eq("client_id",clientId).order("period_end",{ascending:false}).limit(24);
  const reports = data ?? [];

  if (!reports.length) {
    return <div className="mx-auto max-w-7xl">
      <div className="mb-7"><p className="eyebrow">Gestão de tráfego</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#09113f]">Tráfego pago</h1><p className="mt-2 max-w-2xl text-zinc-600">Este espaço recebe os relatórios publicados manualmente pela equipe Zenfy.</p></div>
      <section className="surface overflow-hidden p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="eyebrow">Em preparação</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Seu primeiro relatório ainda não foi publicado.</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">Quando a gestão cadastrar os dados da campanha, você verá investimento, impressões, cliques, leads, CPL, faturamento atribuído e ROAS. Até lá, não exibimos números zerados como se fossem resultados reais.</p>
          </div>
          <div className="rounded-[1.5rem] bg-[#06114f] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[.14em] text-cyan-100">Quando houver dados</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Investimento","Cliques","Leads","CPL","Faturamento","ROAS"].map((item)=><div key={item} className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-sm font-bold">{item}</p><p className="mt-1 text-xs text-blue-50/55">Publicado pela Zenfy</p></div>)}
            </div>
          </div>
        </div>
      </section>
    </div>;
  }

  const totals = reports.reduce((acc,r)=>({
    spend:acc.spend+Number(r.spend||0),
    impressions:acc.impressions+Number(r.impressions||0),
    clicks:acc.clicks+Number(r.clicks||0),
    leads:acc.leads+Number(r.leads||0),
    revenue:acc.revenue+Number(r.revenue||0),
  }),{spend:0,impressions:0,clicks:0,leads:0,revenue:0});
  const cpl = totals.leads ? totals.spend / totals.leads : 0;
  const roas = totals.spend ? totals.revenue / totals.spend : 0;

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Gestão de tráfego</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#09113f]">Tráfego pago</h1><p className="mt-2 max-w-2xl text-zinc-600">Acompanhe quanto foi investido, quantos cliques e leads vieram das campanhas e o retorno registrado pela gestão.</p><p className="mt-2 text-xs font-semibold text-zinc-400">Atualizado pela Zenfy em {new Date(reports[0].created_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})}</p></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Kpi label="Investimento" value={brl(totals.spend)} />
      <Kpi label="Impressões" value={numberBr(totals.impressions)} />
      <Kpi label="Cliques" value={numberBr(totals.clicks)} />
      <Kpi label="Leads" value={numberBr(totals.leads)} />
      <Kpi label="Custo por lead" value={brl(cpl)} />
    </div>

    <section className="mt-6 rounded-[2rem] bg-[#06114f] p-6 text-white shadow-xl sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div><p className="text-xs font-black uppercase tracking-[.16em] text-cyan-100">Faturamento atribuído</p><p className="mt-2 text-4xl font-black">{brl(totals.revenue)}</p><p className="mt-2 text-sm text-blue-50/70">Valor informado nos relatórios publicados pela equipe.</p></div>
        <div><p className="text-xs font-black uppercase tracking-[.16em] text-cyan-100">ROAS registrado</p><p className="mt-2 text-4xl font-black">{roas ? roas.toFixed(2)+"x" : "—"}</p><p className="mt-2 text-sm text-blue-50/70">Faturamento atribuído ÷ investimento em mídia.</p></div>
      </div>
    </section>

    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black text-[#09113f]">Relatórios</h2><p className="mt-1 text-sm text-zinc-500">Dados publicados pelo gestor de tráfego.</p></div>
      {reports.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-4">Período</th><th className="p-4">Plataforma</th><th className="p-4">Investido</th><th className="p-4">Cliques</th><th className="p-4">Leads</th><th className="p-4">CPL</th><th className="p-4">Faturamento</th></tr></thead><tbody>{reports.map(r=>{const localCpl=Number(r.leads)>0?Number(r.spend)/Number(r.leads):0;return <tr key={r.id} className="border-t border-zinc-100"><td className="p-4 whitespace-nowrap">{dateBr(r.period_start)} – {dateBr(r.period_end)}</td><td className="p-4 font-semibold">{r.platform}</td><td className="p-4">{brl(r.spend)}</td><td className="p-4">{numberBr(r.clicks)}</td><td className="p-4 font-bold">{numberBr(r.leads)}</td><td className="p-4">{brl(localCpl)}</td><td className="p-4">{brl(r.revenue)}</td></tr>})}</tbody></table></div> : <div className="p-10 text-center text-sm text-zinc-500">Ainda não há relatório de tráfego publicado para sua conta.</div>}
    </section>
  </div>;
}

function Kpi({label,value}:{label:string;value:string}) { return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-black text-[#09113f]">{value}</p></div>; }
