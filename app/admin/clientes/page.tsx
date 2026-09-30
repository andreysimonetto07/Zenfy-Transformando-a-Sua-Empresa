import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { brl, dateBr } from "@/lib/client-portal";

export default async function ClientesPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);

  const [{data,error},{data:reports}] = await Promise.all([
    supabase
      .from("clients")
      .select("id,profile_id,company_id,plan,status,value,created_at,profiles(name,email,phone),companies(name,whatsapp,city,state)")
      .order("created_at",{ascending:false}),
    supabase
      .from("traffic_reports")
      .select("client_id,platform,period_end,leads,spend,created_at")
      .order("period_end",{ascending:false})
      .order("created_at",{ascending:false})
      .limit(300),
  ]);

  if(error)throw new Error(error.message);

  const clients=data ?? [];
  const latestByClient=new Map<string,any>();
  for(const report of reports??[]){
    if(!latestByClient.has(report.client_id)) latestByClient.set(report.client_id,report);
  }

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7">
      <p className="eyebrow">Relacionamento</p>
      <h1 className="mt-2 text-3xl font-black text-[#09113f]">Painéis das empresas</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">Abra uma empresa para atualizar leads, investimento, cliques, faturamento, projetos, sites, cobranças e mensagens.</p>
    </div>

    {clients.length ? (
      <div className="grid gap-4 lg:grid-cols-2">
        {clients.map((client:any)=>{
          const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;
          const company=Array.isArray(client.companies)?client.companies[0]:client.companies;
          const latest=latestByClient.get(client.id);

          return <article key={client.id} className="surface group p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.12em] text-brand">{client.status||"cliente"}</p>
                <h2 className="mt-1 text-xl font-black text-[#09113f]">{company?.name||profile?.name||"Cliente"}</h2>
                <p className="mt-1 text-sm text-zinc-500">{profile?.name} · {profile?.email}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-brand">{client.plan||"Sem plano"}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="Mensalidade" value={client.value!=null?brl(client.value):"—"}/>
              <Info label="WhatsApp" value={company?.whatsapp||"—"}/>
              <Info label="Cidade" value={[company?.city,company?.state].filter(Boolean).join(" - ")||"—"}/>
              <Info label="Último dado" value={latest ? String(latest.leads)+" leads · "+dateBr(latest.period_end) : "Sem métricas"}/>
            </div>

            {latest && (
              <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-[#09113f]">{latest.platform}</p>
                  <p className="text-xs font-bold text-zinc-500">{brl(latest.spend)} investidos</p>
                </div>
              </div>
            )}

            <Link href={"/admin/clientes/"+client.id} className="btn btn-primary mt-4 w-full">
              Abrir painel da empresa →
            </Link>
          </article>
        })}
      </div>
    ) : (
      <div className="surface p-10 text-center text-sm text-zinc-500">Nenhum cliente cadastrado ainda.</div>
    )}
  </div>;
}

function Info({label,value}:{label:string;value:string}){
  return <div className="rounded-xl bg-zinc-50 p-3"><p className="text-xs font-bold text-zinc-400">{label}</p><p className="mt-1 truncate font-bold text-[#09113f]">{value}</p></div>
}
