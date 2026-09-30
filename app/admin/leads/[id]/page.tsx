import Link from "next/link";
import { notFound } from "next/navigation";
import LeadDetailActions from "@/components/LeadDetailActions";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { formatDate, isOverdue, leadStatusLabel } from "@/lib/crm";
import { getAdminProfiles, getLeadActivities, getLeadById, one } from "@/lib/leads-query";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const { id } = await params;
  const [lead, profiles] = await Promise.all([getLeadById(supabase, id), getAdminProfiles(supabase)]);
  if (!lead) notFound();
  const currentLead = lead!;
  const activities = await getLeadActivities(supabase, id);
  const company = one(currentLead.companies);
  const assignee = one(currentLead.assignee);

  return <div className="mx-auto max-w-6xl">
    <Link href="/admin/leads" className="mb-4 inline-block text-sm text-zinc-500 hover:text-brand">← Voltar para leads</Link>
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 lg:flex-row lg:items-start lg:justify-between">
      <div><p className="text-sm text-zinc-500">{leadStatusLabel(currentLead.status)}</p><h1 className="text-2xl font-bold">{company?.name || currentLead.contact_name}</h1><p className="mt-1 text-zinc-600">{currentLead.contact_name} · {currentLead.service || "Serviço não informado"}</p></div>
      <LeadDetailActions lead={currentLead} profiles={profiles} />
    </div>

    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Contato</h2><dl className="mt-4 space-y-3 text-sm"><Info label="Nome" value={currentLead.contact_name} /><Info label="WhatsApp" value={currentLead.whatsapp} /><Info label="Telefone" value={currentLead.phone} /><Info label="E-mail" value={currentLead.email} /></dl></section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Empresa</h2><dl className="mt-4 space-y-3 text-sm"><Info label="Empresa" value={company?.name} /><Info label="Nicho" value={company?.industry} /><Info label="Cidade" value={[company?.city, company?.state].filter(Boolean).join(" - ")} /><Info label="Site" value={company?.website} /><Info label="Instagram" value={company?.instagram} /></dl>{company?.id && <Link href={`/admin/empresas/${company.id}`} className="mt-4 inline-block text-sm font-medium text-brand">Abrir empresa →</Link>}</section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Comercial</h2><dl className="mt-4 space-y-3 text-sm"><Info label="Serviço" value={currentLead.service} /><Info label="Origem" value={currentLead.source} /><Info label="Status" value={leadStatusLabel(currentLead.status)} /><Info label="Responsável" value={assignee?.name} /><Info label="Último contato" value={formatDate(currentLead.last_contact)} /><div className={isOverdue(currentLead.next_contact, currentLead.status) ? "rounded-md bg-red-50 p-2 text-red-700" : ""}><Info label="Próximo contato" value={formatDate(currentLead.next_contact)} /></div></dl></section>
    </div>

    <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Observações</h2><p className="mt-3 whitespace-pre-wrap text-sm text-zinc-600">{currentLead.notes || "Nenhuma observação registrada."}</p></section>

    <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold">Histórico</h2>{activities.length === 0 ? <p className="mt-3 text-sm text-zinc-500">Nenhuma atividade registrada.</p> : <div className="mt-4 space-y-4">{activities.map((activity) => { const author = one(activity.author); return <div key={activity.id} className="border-l-2 border-zinc-200 pl-4"><p className="text-xs text-zinc-500">{activity.created_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(activity.created_at)) : ""}{author?.name ? ` · ${author.name}` : ""}</p><p className="mt-1 text-sm text-zinc-700">{activity.description || activity.action}</p></div>; })}</div>}</section>
  </div>;
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return <div><dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt><dd className="mt-0.5 break-words text-zinc-700">{value || "—"}</dd></div>;
}
