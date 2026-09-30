"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createLeadAction, updateLeadAction } from "@/app/admin/leads/actions";
import { LEAD_SERVICES, LEAD_SOURCES, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/crm";
import { one } from "@/lib/leads-query";
import type { AdminProfile, LeadRow } from "@/types/lead";

function toLocalDateTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoOrEmpty(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export default function LeadForm({ profiles, initial, onDone }: { profiles: AdminProfile[]; initial?: LeadRow; onDone?: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const company = initial ? one(initial.companies) : null;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      id: initial?.id,
      company_id: company?.id ?? "",
      company: String(fd.get("company") ?? ""),
      contact_name: String(fd.get("contact_name") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      website: String(fd.get("website") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      service: String(fd.get("service") ?? ""),
      source: String(fd.get("source") ?? ""),
      status: String(fd.get("status") ?? ""),
      assigned_to: String(fd.get("assigned_to") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      last_contact: isoOrEmpty(fd.get("last_contact")),
      next_contact: isoOrEmpty(fd.get("next_contact")),
    };

    startTransition(async () => {
      const result = initial ? await updateLeadAction(payload) : await createLeadAction(payload);
      if (!result.ok) return setError(result.error);
      router.refresh();
      onDone?.();
    });
  }

  const field = (name: string, label: string, value?: string | null, type = "text") => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      <input name={name} type={type} defaultValue={value ?? ""} className="input" />
    </label>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      {field("company", "Empresa *", company?.name, "text")}
      {field("contact_name", "Contato *", initial?.contact_name, "text")}
      {field("whatsapp", "WhatsApp", initial?.whatsapp, "tel")}
      {field("phone", "Telefone", initial?.phone, "tel")}
      {field("email", "E-mail", initial?.email, "email")}
      {field("instagram", "Instagram", company?.instagram)}
      {field("website", "Site", company?.website)}
      {field("industry", "Nicho", company?.industry)}
      {field("city", "Cidade", company?.city)}
      {field("state", "Estado", company?.state)}

      <label className="block text-sm"><span className="mb-1 block font-medium text-zinc-700">Serviço</span><select name="service" defaultValue={initial?.service || LEAD_SERVICES[0]} className="input">{LEAD_SERVICES.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="block text-sm"><span className="mb-1 block font-medium text-zinc-700">Origem</span><select name="source" defaultValue={initial?.source || "Prospecção manual"} className="input">{LEAD_SOURCES.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="block text-sm"><span className="mb-1 block font-medium text-zinc-700">Status</span><select name="status" defaultValue={initial?.status || "new"} className="input">{LEAD_STATUSES.map((value) => <option key={value} value={value}>{LEAD_STATUS_LABELS[value]}</option>)}</select></label>
      <label className="block text-sm"><span className="mb-1 block font-medium text-zinc-700">Responsável</span><select name="assigned_to" defaultValue={initial?.assigned_to || ""} className="input"><option value="">Não atribuído</option>{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select></label>
      {field("last_contact", "Último contato", toLocalDateTime(initial?.last_contact), "datetime-local")}
      {field("next_contact", "Próximo contato", toLocalDateTime(initial?.next_contact), "datetime-local")}
      <label className="block text-sm md:col-span-2"><span className="mb-1 block font-medium text-zinc-700">Observações</span><textarea name="notes" defaultValue={initial?.notes ?? ""} rows={4} className="input" /></label>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
      <div className="flex justify-end gap-3 md:col-span-2">{onDone && <button type="button" onClick={onDone} className="btn btn-ghost">Cancelar</button>}<button disabled={pending} className="btn btn-primary">{pending ? "Salvando..." : initial ? "Salvar alterações" : "Cadastrar lead"}</button></div>
    </form>
  );
}
