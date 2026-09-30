import { requireClientPortal, brl, dateBr, statusLabel } from "@/lib/client-portal";

export default async function FaturamentoPage() {
  const { supabase, client }=await requireClientPortal();
  const clientId=client?.id || "00000000-0000-0000-0000-000000000000";
  const {data}=await supabase.from("invoices").select("*").eq("client_id",clientId).order("created_at",{ascending:false});
  const invoices=data ?? [];

  return <div className="mx-auto max-w-6xl">
    <div className="mb-7"><p className="eyebrow">Financeiro</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Faturamento</h1><p className="mt-2 text-zinc-600">Acompanhe cobranças, vencimentos e pagamentos relacionados aos serviços da Zenfy.</p></div>
    <div className="mb-5 grid gap-4 sm:grid-cols-3"><Summary label="Plano" value={client?.plan || "Não definido"}/><Summary label="Valor recorrente" value={client?.value!=null ? brl(client.value) : "—"}/><Summary label="Status da conta" value={client?.status || "—"}/></div>
    <section className="surface overflow-hidden">{invoices.length ? <div className="divide-y divide-zinc-100">{invoices.map(i=><article key={i.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="font-black text-[#09113f]">{i.description}</p><p className="mt-1 text-sm text-zinc-500">Vencimento: {dateBr(i.due_date)}</p><span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand">{statusLabel(i.status)}</span></div><div className="sm:text-right"><p className="text-2xl font-black text-[#09113f]">{brl(i.amount)}</p>{i.payment_url&&i.status!=="pago"&&<a href={i.payment_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3">Pagar / abrir cobrança ↗</a>}</div></article>)}</div> : <div className="p-10 text-center text-sm text-zinc-500">Nenhuma cobrança registrada.</div>}</section>
  </div>;
}
function Summary({label,value}:{label:string;value:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-xl font-black text-[#09113f]">{value}</p></div>}
