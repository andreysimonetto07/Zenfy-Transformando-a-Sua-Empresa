import ClientDirectory from "@/components/ClientDirectory";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

export default async function ClientesPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);

  const [{data,error},{data:reports}] = await Promise.all([
    supabase.from("clients").select("id,profile_id,company_id,plan,status,value,created_at,profiles(name,email,phone),companies(name,whatsapp,city,state)").order("created_at",{ascending:false}),
    supabase.from("traffic_reports").select("client_id,platform,period_end,leads,spend,created_at").order("period_end",{ascending:false}).order("created_at",{ascending:false}).limit(500),
  ]);

  if(error) throw new Error("Não foi possível carregar os clientes.");

  const latestByClient=new Map<string,any>();
  for(const report of reports??[]) if(!latestByClient.has(report.client_id)) latestByClient.set(report.client_id,report);

  const items=(data??[]).map((client:any)=>{
    const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;
    const company=Array.isArray(client.companies)?client.companies[0]:client.companies;
    const latest=latestByClient.get(client.id);
    return {
      id:client.id,
      company:company?.name||profile?.name||"Cliente",
      contact:profile?.name||"—",
      email:profile?.email||"",
      whatsapp:company?.whatsapp||profile?.phone||"",
      city:company?.city||"",
      state:company?.state||"",
      status:client.status||"cliente",
      plan:client.plan||"",
      value:client.value!=null?Number(client.value):null,
      leads:latest?Number(latest.leads||0):null,
      spend:latest?Number(latest.spend||0):null,
      lastDate:latest?.period_end||null,
      platform:latest?.platform||null,
    };
  });

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7">
      <p className="eyebrow">Clientes Zenfy</p>
      <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Painéis das empresas</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">Busque, filtre e abra rapidamente cada cliente da Zenfy sem precisar procurar card por card.</p>
    </div>
    <ClientDirectory items={items}/>
  </div>;
}
