import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { formatDate, leadStatusLabel } from "@/lib/crm";

type CompanyDetail = {
  id: string; name: string; document?: string | null; industry?: string | null; city?: string | null; state?: string | null;
  phone?: string | null; whatsapp?: string | null; email?: string | null; instagram?: string | null; facebook?: string | null;
  website?: string | null; notes?: string | null;
};
type CompanyLead = { id: string; contact_name: string; status: string; service?: string | null; last_contact?: string | null; created_at?: string | null };
type CompanyActivity = { id: string; lead_id?: string | null; description?: string | null; created_at?: string | null };
type CompanyProject = { id: string; name: string; status?: string | null; progress?: number | null };

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const { id } = await params;
  const { data: rawCompany } = await supabase.from("companies").select("*").eq("id", id).single();
  const company = rawCompany as CompanyDetail | null;
  if (!company) notFound();
  const currentCompany = company!;
  const [{ data: rawLeads }, { data: rawProjects }] = await Promise.all([
    supabase.from("leads").select("id,contact_name,status,service,last_contact,created_at").eq("company_id", id).order("created_at", { ascending: false }),
    supabase.from("projects").select("id,name,status,progress").eq("company_id", id).order("created_at", { ascending: false }),
  ]);
  const leads = (rawLeads ?? []) as CompanyLead[];
  const projects = (rawProjects ?? []) as CompanyProject[];
  const leadIds = leads.map((lead: CompanyLead) => lead.id);
  const { data: rawActivities } = leadIds.length ? await supabase.from("activities").select("id,lead_id,description,created_at").in("lead_id", leadIds).order("created_at", { ascending: false }).limit(20) : { data: [] };
  const activities = (rawActivities ?? []) as CompanyActivity[];

  return <div className="mx-auto max-w-6xl">
    <Link href="/admin/empresas" className="mb-4 inline-block text-sm text-zinc-500 hover:text-brand">← Voltar para empresas</Link>
    <div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-sm text-zinc-500">Empresa</p><h1 className="text-2xl font-bold">{currentCompany.name}</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info label="CNPJ/documento" value={currentCompany.document} /><Info label="Nicho" value={currentCompany.industry} /><Info label="Cidade" value={[currentCompany.city,currentCompany.state].filter(Boolean).join(" - ")} /><Info label="Telefone" value={currentCompany.phone} /><Info label="WhatsApp" value={currentCompany.whatsapp} /><Info label="E-mail" value={currentCompany.email} /><Info label="Instagram" value={currentCompany.instagram} /><Info label="Facebook" value={currentCompany.facebook} /><Info label="Site" value={currentCompany.website} /></div>{currentCompany.notes && <div className="mt-5 border-t pt-5"><p className="text-xs uppercase text-zinc-400">Observações</p><p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">{currentCompany.notes}</p></div>}</div>

    <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Leads relacionados</h2>{!leads.length ? <p className="mt-3 text-sm text-zinc-500">Nenhum lead vinculado.</p> : <div className="mt-4 divide-y">{leads.map((lead: CompanyLead) => <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex flex-col gap-1 py-3 hover:text-brand sm:flex-row sm:items-center sm:justify-between"><span><strong>{lead.contact_name}</strong> · {lead.service || "—"}</span><span className="text-sm text-zinc-500">{leadStatusLabel(lead.status)} · {formatDate(lead.last_contact)}</span></Link>)}</div>}</section>

    <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Atividades recentes</h2>{!activities.length ? <p className="mt-3 text-sm text-zinc-500">Nenhuma atividade registrada.</p> : <div className="mt-4 space-y-3">{activities.map((activity: CompanyActivity) => <div key={activity.id} className="border-l-2 border-zinc-200 pl-4"><p className="text-xs text-zinc-500">{activity.created_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(activity.created_at)) : ""}</p><p className="text-sm text-zinc-700">{activity.description || "Atividade registrada."}</p></div>)}</div>}</section>

    <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Projetos</h2>{!projects.length ? <p className="mt-3 text-sm text-zinc-500">Nenhum projeto vinculado.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{projects.map((project: CompanyProject) => <div key={project.id} className="rounded-lg border border-zinc-200 p-4"><p className="font-medium">{project.name}</p><p className="mt-1 text-sm text-zinc-500">{project.status || "—"} · {project.progress ?? 0}%</p></div>)}</div>}</section>
  </div>;
}

function Info({ label, value }: { label: string; value?: string | null }) { return <div><p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p><p className="mt-1 break-words text-sm text-zinc-700">{value || "—"}</p></div>; }
