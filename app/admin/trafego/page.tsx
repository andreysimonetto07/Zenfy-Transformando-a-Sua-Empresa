import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, dateBr, numberBr } from "@/lib/client-portal";

export default async function TrafegoAdminPage() {
  const { supabase } = await requireProfile(ADMIN_ROLES);

  const [{ data: reports }, { data: clients }] = await Promise.all([
    supabase
      .from("traffic_reports")
      .select("id,client_id,platform,period_start,period_end,spend,impressions,clicks,leads,conversions,revenue")
      .order("period_end", { ascending: false })
      .limit(100),
    supabase
      .from("clients")
      .select("id,profiles(name,email),companies(name)")
      .order("created_at", { ascending: false }),
  ]);

  const clientMap = new Map((clients ?? []).map((client: any) => {
    const profile = Array.isArray(client.profiles) ? client.profiles[0] : client.profiles;
    const company = Array.isArray(client.companies) ? client.companies[0] : client.companies;
    return [client.id, { name: company?.name || profile?.name || "Cliente", email: profile?.email || "" }];
  }));

  const rows = reports ?? [];
  const clientsWithDaily = new Set(rows.filter((r: any) => r.period_start === r.period_end).map((r: any) => r.client_id));
  const rowsForTotals = rows.filter((r: any) => clientsWithDaily.has(r.client_id) ? r.period_start === r.period_end : true);

  const totals = rowsForTotals.reduce((acc: any, r: any) => ({
    spend: acc.spend + Number(r.spend || 0),
    leads: acc.leads + Number(r.leads || 0),
    clicks: acc.clicks + Number(r.clicks || 0),
    revenue: acc.revenue + Number(r.revenue || 0),
  }), { spend: 0, leads: 0, clicks: 0, revenue: 0 });

  const cpl = totals.leads ? totals.spend / totals.leads : 0;
  const roas = totals.spend ? totals.revenue / totals.spend : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <p className="eyebrow">Gestão de tráfego</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#09113f]">Campanhas e resultados</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Visão consolidada dos dados publicados para os clientes. Quando um cliente possui lançamentos diários, os totais priorizam esses registros para evitar contagem duplicada.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Investimento registrado" value={brl(totals.spend)} />
        <Kpi label="Leads registrados" value={numberBr(totals.leads)} />
        <Kpi label="CPL médio" value={totals.leads ? brl(cpl) : "—"} />
        <Kpi label="ROAS registrado" value={roas ? roas.toFixed(2) + "x" : "—"} />
      </div>

      <section className="surface mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div><h2 className="text-xl font-black text-[#09113f]">Relatórios recentes</h2><p className="mt-1 text-sm text-zinc-500">Meta Ads, Google Ads e outras plataformas.</p></div>
          <Link href="/admin/clientes" className="btn btn-primary">Abrir clientes</Link>
        </div>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr><th className="p-4">Cliente</th><th className="p-4">Período</th><th className="p-4">Plataforma</th><th className="p-4">Investido</th><th className="p-4">Cliques</th><th className="p-4">Leads</th><th className="p-4">CPL</th><th className="p-4">Faturamento</th></tr>
              </thead>
              <tbody>
                {rows.map((r: any) => {
                  const client = clientMap.get(r.client_id);
                  const localCpl = Number(r.leads) > 0 ? Number(r.spend) / Number(r.leads) : 0;
                  return (
                    <tr key={r.id} className="border-t border-zinc-100 hover:bg-blue-50/30">
                      <td className="p-4"><Link href={r.client_id ? `/admin/clientes/${r.client_id}` : "#"} className="font-black text-[#09113f] hover:text-brand">{client?.name || "Cliente"}</Link><p className="text-xs text-zinc-400">{client?.email}</p></td>
                      <td className="whitespace-nowrap p-4">{dateBr(r.period_start)} – {dateBr(r.period_end)}</td>
                      <td className="p-4 font-semibold">{r.platform}</td>
                      <td className="p-4">{brl(r.spend)}</td>
                      <td className="p-4">{numberBr(r.clicks)}</td>
                      <td className="p-4 font-black">{numberBr(r.leads)}</td>
                      <td className="p-4">{Number(r.leads) ? brl(localCpl) : "—"}</td>
                      <td className="p-4">{brl(r.revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-zinc-500">Nenhum relatório de tráfego foi publicado ainda.</div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-black text-[#09113f]">{value}</p></div>;
}
