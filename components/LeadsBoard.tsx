"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatusAction } from "@/app/admin/leads/actions";
import LeadForm from "@/components/LeadForm";
import { LEAD_SERVICES, LEAD_SOURCES, LEAD_STATUSES, LEAD_STATUS_LABELS, formatDate, isOverdue, type LeadStatus } from "@/lib/crm";
import { one } from "@/lib/leads-query";
import type { AdminProfile, LeadRow } from "@/types/lead";

type Filters = { q?: string; status?: string; assigned?: string; service?: string; source?: string; city?: string; industry?: string; overdue?: string; view?: string };

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-md px-3 py-1 text-xl text-zinc-500 hover:bg-mist" aria-label="Fechar">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LeadCard({ lead, onMove }: { lead: LeadRow; onMove: (id: string, status: LeadStatus) => Promise<void> }) {
  const company = one(lead.companies);
  const assignee = one(lead.assignee);
  const overdue = isOverdue(lead.next_contact, lead.status);
  return (
    <article
      draggable
      onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/lead-id", lead.id); }}
      className="rounded-lg border bg-white p-3 shadow-sm active:cursor-grabbing md:cursor-grab"
    >
      <Link href={`/admin/leads/${lead.id}`} className="block">
        <p className="font-semibold text-ink hover:text-brand">{company?.name || "Empresa não informada"}</p>
        <p className="mt-0.5 text-sm text-zinc-600">{lead.contact_name}</p>
        <div className="mt-3 space-y-1 text-xs text-zinc-500">
          <p>{lead.service || "Serviço não informado"}</p>
          <p>{[company?.city, company?.state].filter(Boolean).join(" - ") || "Local não informado"}</p>
          <p className={overdue ? "font-semibold text-red-600" : ""}>Próximo contato: {formatDate(lead.next_contact)}{overdue ? " • atrasado" : ""}</p>
          <p>Responsável: {assignee?.name || "Não atribuído"}</p>
        </div>
      </Link>
      <label className="mt-3 block text-xs text-zinc-500 md:hidden">
        Mover para
        <select value={lead.status} onChange={(e) => void onMove(lead.id, e.target.value as LeadStatus)} className="input mt-1 text-xs">
          {LEAD_STATUSES.map((status) => <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>)}
        </select>
      </label>
    </article>
  );
}

function Column({ status, leads, onMove }: { status: LeadStatus; leads: LeadRow[]; onMove: (id: string, status: LeadStatus) => Promise<void> }) {
  const [over, setOver] = useState(false);
  return (
    <section
      onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => { event.preventDefault(); setOver(false); const id = event.dataTransfer.getData("text/lead-id"); if (id) void onMove(id, status); }}
      className={`w-[290px] shrink-0 rounded-xl border p-3 ${over ? "border-brand bg-indigo-50" : "border-zinc-200 bg-zinc-100/70"}`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{LEAD_STATUS_LABELS[status]}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-zinc-600">{leads.length}</span>
      </header>
      <div className="min-h-20 space-y-2">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} onMove={onMove} />)}</div>
    </section>
  );
}

export default function LeadsBoard({ leads: initialLeads, profiles, initialFilters }: { leads: LeadRow[]; profiles: AdminProfile[]; initialFilters: Filters }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setLeads(initialLeads), [initialLeads]);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  function sync(next: Filters, debounce = false) {
    setFilters(next);
    const run = () => {
      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => { if (value) params.set(key, value); });
      router.replace(`/admin/leads${params.size ? `?${params}` : ""}`, { scroll: false });
    };
    if (!debounce) return run();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(run, 350);
  }

  const filtered = useMemo(() => {
    const term = (filters.q || "").toLocaleLowerCase("pt-BR");
    return leads.filter((lead) => {
      const company = one(lead.companies);
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.assigned && lead.assigned_to !== filters.assigned) return false;
      if (filters.service && lead.service !== filters.service) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.city && !(company?.city || "").toLocaleLowerCase("pt-BR").includes(filters.city.toLocaleLowerCase("pt-BR"))) return false;
      if (filters.industry && !(company?.industry || "").toLocaleLowerCase("pt-BR").includes(filters.industry.toLocaleLowerCase("pt-BR"))) return false;
      if (filters.overdue === "1" && !isOverdue(lead.next_contact, lead.status)) return false;
      if (!term) return true;
      return [company?.name, lead.contact_name, lead.whatsapp, lead.email, company?.city].some((value) => (value || "").toLocaleLowerCase("pt-BR").includes(term));
    });
  }, [leads, filters]);

  async function moveLead(id: string, nextStatus: LeadStatus) {
    const current = leads.find((lead) => lead.id === id);
    if (!current || current.status === nextStatus) return;
    const previous = current.status;
    setLeads((items) => items.map((lead) => lead.id === id ? { ...lead, status: nextStatus } : lead));
    const result = await updateLeadStatusAction({ id, status: nextStatus });
    if (!result.ok) {
      setLeads((items) => items.map((lead) => lead.id === id ? { ...lead, status: previous } : lead));
      setFeedback({ type: "error", text: result.error });
      return;
    }
    setFeedback({ type: "ok", text: "Status atualizado." });
    router.refresh();
  }

  const view = filters.view === "list" ? "list" : "kanban";
  const grouped = Object.fromEntries(LEAD_STATUSES.map((status) => [status, filtered.filter((lead) => lead.status === status)])) as Record<LeadStatus, LeadRow[]>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><h1 className="text-2xl font-bold">Leads</h1><p className="mt-1 text-sm text-zinc-600">Gerencie contatos, oportunidades e negociações da Zenfy.</p></div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">+ Novo Lead</button>
      </div>

      <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <input value={filters.q || ""} onChange={(e) => sync({ ...filters, q: e.target.value }, true)} placeholder="Buscar..." className="input xl:col-span-2" />
          <select value={filters.status || ""} onChange={(e) => sync({ ...filters, status: e.target.value })} className="input"><option value="">Todos os status</option>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}</select>
          <select value={filters.assigned || ""} onChange={(e) => sync({ ...filters, assigned: e.target.value })} className="input"><option value="">Responsável</option>{profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={filters.service || ""} onChange={(e) => sync({ ...filters, service: e.target.value })} className="input"><option value="">Serviço</option>{LEAD_SERVICES.map((v) => <option key={v}>{v}</option>)}</select>
          <select value={filters.source || ""} onChange={(e) => sync({ ...filters, source: e.target.value })} className="input"><option value="">Origem</option>{LEAD_SOURCES.map((v) => <option key={v}>{v}</option>)}</select>
          <input value={filters.city || ""} onChange={(e) => sync({ ...filters, city: e.target.value }, true)} placeholder="Cidade" className="input" />
          <input value={filters.industry || ""} onChange={(e) => sync({ ...filters, industry: e.target.value }, true)} placeholder="Nicho" className="input" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => sync({ ...filters, overdue: filters.overdue === "1" ? "" : "1" })} className={`rounded-md border px-3 py-2 text-sm ${filters.overdue === "1" ? "border-brand bg-indigo-50 text-brand" : "border-zinc-300"}`}>Contato atrasado</button>
          <button onClick={() => sync({ view })} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">Limpar filtros</button>
          <div className="ml-auto flex overflow-hidden rounded-md border border-zinc-300 text-sm"><button onClick={() => sync({ ...filters, view: "kanban" })} className={`px-3 py-2 ${view === "kanban" ? "bg-ink text-white" : "bg-white"}`}>Kanban</button><button onClick={() => sync({ ...filters, view: "list" })} className={`px-3 py-2 ${view === "list" ? "bg-ink text-white" : "bg-white"}`}>Lista</button></div>
        </div>
      </div>

      {feedback && <div className={`mb-4 rounded-md p-3 text-sm ${feedback.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.text}</div>}

      {filtered.length === 0 ? <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center"><h2 className="font-semibold">Seu CRM ainda está vazio.</h2><p className="mt-2 text-sm text-zinc-600">Cadastre sua primeira oportunidade ou aguarde um novo contato pelo site.</p><button onClick={() => setShowCreate(true)} className="btn btn-primary mt-5">Cadastrar primeiro lead</button></div> : view === "kanban" ? <div className="flex gap-4 overflow-x-auto pb-5">{LEAD_STATUSES.map((status) => <Column key={status} status={status} leads={grouped[status]} onMove={moveLead} />)}</div> : <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-3">Empresa</th><th className="p-3">Contato</th><th className="p-3">Serviço</th><th className="p-3">Status</th><th className="p-3">Responsável</th><th className="p-3">Último contato</th><th className="p-3">Próximo contato</th></tr></thead><tbody>{filtered.map((lead) => { const company = one(lead.companies); const assignee = one(lead.assignee); return <tr key={lead.id} className="border-t hover:bg-zinc-50"><td className="p-3 font-medium"><Link className="hover:text-brand" href={`/admin/leads/${lead.id}`}>{company?.name || "—"}</Link></td><td className="p-3">{lead.contact_name}</td><td className="p-3">{lead.service || "—"}</td><td className="p-3">{LEAD_STATUS_LABELS[lead.status]}</td><td className="p-3">{assignee?.name || "—"}</td><td className="p-3">{formatDate(lead.last_contact)}</td><td className={`p-3 ${isOverdue(lead.next_contact, lead.status) ? "font-semibold text-red-600" : ""}`}>{formatDate(lead.next_contact)}</td></tr>; })}</tbody></table></div>}

      {showCreate && <Modal title="Novo lead" onClose={() => setShowCreate(false)}><LeadForm profiles={profiles} onDone={() => { setShowCreate(false); setFeedback({ type: "ok", text: "Lead cadastrado com sucesso." }); }} /></Modal>}
    </div>
  );
}
