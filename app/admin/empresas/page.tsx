import Link from "next/link";
import CompanyCreateButton from "@/components/CompanyCreateButton";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { formatDate } from "@/lib/crm";

type CompanyListRow = {
  id: string;
  name: string;
  industry?: string | null;
  city?: string | null;
  state?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  leads?: { id: string; last_contact?: string | null }[] | null;
};

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const params = await searchParams;
  const first = (key: string) => Array.isArray(params[key]) ? params[key]?.[0] : params[key];
  const q = first("q") || "";
  const city = first("city") || "";
  const industry = first("industry") || "";
  const website = first("website") || "";

  const { data, error } = await supabase.from("companies").select("*, leads(id,last_contact)").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(`Não foi possível carregar as empresas: ${error.message}`);
  const rows = (data ?? []) as CompanyListRow[];
  const companies = rows.filter((company: CompanyListRow) => {
    if (q && !company.name.toLocaleLowerCase("pt-BR").includes(q.toLocaleLowerCase("pt-BR"))) return false;
    if (city && !(company.city || "").toLocaleLowerCase("pt-BR").includes(city.toLocaleLowerCase("pt-BR"))) return false;
    if (industry && !(company.industry || "").toLocaleLowerCase("pt-BR").includes(industry.toLocaleLowerCase("pt-BR"))) return false;
    if (website === "yes" && !company.website) return false;
    if (website === "no" && company.website) return false;
    return true;
  });

  return <div>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold">Empresas</h1><p className="mt-1 text-sm text-zinc-600">Empresas prospectadas e vinculadas aos leads.</p></div><CompanyCreateButton /></div>
    <form className="mb-5 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
      <input name="q" defaultValue={q} placeholder="Buscar empresa" className="input lg:col-span-2" />
      <input name="city" defaultValue={city} placeholder="Cidade" className="input" />
      <input name="industry" defaultValue={industry} placeholder="Nicho" className="input" />
      <select name="website" defaultValue={website} className="input"><option value="">Site: todos</option><option value="yes">Possui site</option><option value="no">Sem site</option></select>
      <div className="flex gap-2 lg:col-span-5"><button className="btn btn-primary">Filtrar</button><Link href="/admin/empresas" className="btn btn-ghost">Limpar</Link></div>
    </form>
    {companies.length === 0 ? <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-600">Nenhuma empresa encontrada.</div> : <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-3">Empresa</th><th className="p-3">Nicho</th><th className="p-3">Cidade</th><th className="p-3">WhatsApp</th><th className="p-3">Site</th><th className="p-3">Leads</th><th className="p-3">Último contato</th></tr></thead><tbody>{companies.map((company: CompanyListRow) => { const leads = company.leads ?? []; const last = leads.map((l) => l.last_contact).filter((v): v is string => Boolean(v)).sort().at(-1); return <tr key={company.id} className="border-t hover:bg-zinc-50"><td className="p-3 font-medium"><Link href={`/admin/empresas/${company.id}`} className="hover:text-brand">{company.name}</Link></td><td className="p-3">{company.industry || "—"}</td><td className="p-3">{[company.city,company.state].filter(Boolean).join(" - ") || "—"}</td><td className="p-3">{company.whatsapp || "—"}</td><td className="p-3">{company.website || "—"}</td><td className="p-3">{leads.length}</td><td className="p-3">{formatDate(last)}</td></tr>; })}</tbody></table></div>}
  </div>;
}
