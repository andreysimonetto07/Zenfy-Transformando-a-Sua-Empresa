import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, dateBr, numberBr } from "@/lib/client-portal";

export default async function TrafegoAdminPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const {data:raw}=await supabase.from("traffic_reports").select("id,client_id,period_start,period_end,platform,spend,impressions,clicks,leads,conversions,revenue,notes").order("period_end",{ascending:false}).limit(200);
  const reports=(raw??[]) as any[];

  const clientIds=[...new Set(reports.map(r=>r.client_id).filter(Boolean))];
  const {data:rawClients}=clientIds.length
    ? await supabase.from("clients").select("id,profiles(name,email),companies(name)").in("id",clientIds)
    : {data:[]};
  const clientMap=new Map<string,string>();
  for(const c of (rawClients??[]) as any[]){
    const profile=Array.isArray(c.profiles)?c.profiles[0]:c.profiles;
    const company=Array.isArray(c.companies)?c.companies[0]:c.companies;
    clientMap.set(c.id,company?.name||profile?.name||"Cliente");
  }

  const total=reports.reduce((a,r)=>({
    spend:a.spend+Number(r.spend||0),
    leads:a.leads+Number(r.leads||0),
    clicks:a.clicks+Number(r.clicks||0),
    revenue:a.revenue+Number(r.revenue||0),
  }),{spend:0,leads:0,clicks:0,revenue:0});
  const cpl=total.leads?total.spend/total.leads:0;
  const roas=total.spend?total.revenue/total.spend:0;

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Gestão de tráfego</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Tráfego pago</h1><p className="mt-2 max-w-2xl text-zinc-600">Visão consolidada dos relatórios publicados para seus clientes.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <K label="Investido" value={brl(total.spend)}/><K label="Cliques" value={numberBr(total.clicks)}/><K label="Leads" value={numberBr(total.leads)}/><K label="CPL médio" value={brl(cpl)}/><K label="ROAS registrado" value={roas?roas.toFixed(2)+"x":"—"}/>
    </div>
    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black text-[#09113f]">Relatórios recentes</h2></div>
      {reports.length?<div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-4">Cliente</th><th className="p-4">Período</th><th className="p-4">Plataforma</th><th className="p-4">Investido</th><th className="p-4">Leads</th><th className="p-4">CPL</th><th className="p-4">Faturamento</th></tr></thead><tbody>{reports.map(r=>{const localCpl=Number(r.leads)>0?Number(r.spend)/Number(r.leads):0;return <tr key={r.id} className="border-t border-zinc-100"><td className="p-4 font-bold"><Link href={`/admin/clientes/${r.client_id}`} className="hover:text-brand">{clientMap.get(r.client_id)||"Cliente"}</Link></td><td className="p-4 whitespace-nowrap">{dateBr(r.period_start)} – {dateBr(r.period_end)}</td><td className="p-4">{r.platform}</td><td className="p-4">{brl(r.spend)}</td><td className="p-4 font-bold">{numberBr(r.leads)}</td><td className="p-4">{brl(localCpl)}</td><td className="p-4">{brl(r.revenue)}</td></tr>})}</tbody></table></div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhum relatório ainda. Abra um cliente e publique o primeiro relatório de tráfego.</div>}
    </section>
  </div>;
}
function K({label,value}:{label:string;value:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-black text-[#09113f]">{value}</p></div>}
