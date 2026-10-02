import CompanyCreateButton from "@/components/CompanyCreateButton";
import CompanyDirectory from "@/components/CompanyDirectory";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

type CompanyListRow = {
  id:string;name:string;industry?:string|null;city?:string|null;state?:string|null;
  whatsapp?:string|null;website?:string|null;
  leads?:{id:string;last_contact?:string|null}[]|null;
};

export default async function CompaniesPage() {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const { data, error } = await supabase
    .from("companies")
    .select("id,name,industry,city,state,whatsapp,website,created_at,leads(id,last_contact)")
    .order("created_at",{ascending:false})
    .limit(500);

  if(error) throw new Error("Não foi possível carregar as empresas.");

  const items=((data??[]) as CompanyListRow[]).map(company=>{
    const leads=company.leads??[];
    const lastContact=leads.map(l=>l.last_contact).filter((v):v is string=>Boolean(v)).sort().at(-1)||null;
    return {
      id:company.id,
      name:company.name,
      industry:company.industry||"",
      city:company.city||"",
      state:company.state||"",
      whatsapp:company.whatsapp||"",
      website:company.website||"",
      leads:leads.length,
      lastContact,
    };
  });

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">Base comercial</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Empresas</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Encontre rápido quem já tem site, quem ainda é oportunidade e quais empresas têm leads vinculados.</p>
      </div>
      <CompanyCreateButton />
    </div>
    <CompanyDirectory items={items}/>
  </div>;
}
