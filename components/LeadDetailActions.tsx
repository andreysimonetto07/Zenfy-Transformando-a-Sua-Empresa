"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import LeadForm from "@/components/LeadForm";
import { CONTACT_TYPES, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/crm";
import { convertLeadToClientAction, registerContactAction, updateLeadStatusAction } from "@/app/admin/leads/actions";
import type { AdminProfile, LeadRow } from "@/types/lead";

function isoOrEmpty(value: FormDataEntryValue | string | null) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title}><div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} className="text-xl text-zinc-500" aria-label="Fechar">×</button></div>{children}</div></div>;
}

export default function LeadDetailActions({ lead, profiles }: { lead: LeadRow; profiles: AdminProfile[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [contact, setContact] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  function changeStatus(status: string) {
    startTransition(async () => {
      const result = await updateLeadStatusAction({ id: lead.id, status });
      setFeedback({ ok: result.ok, text: result.ok ? "Status atualizado." : result.error });
      if (result.ok) router.refresh();
    });
  }

  function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = String(fd.get("date") || "");
    const next = String(fd.get("next_contact") || "");
    startTransition(async () => {
      const result = await registerContactAction({
        lead_id: lead.id,
        type: String(fd.get("type") || ""),
        description: String(fd.get("description") || ""),
        date: isoOrEmpty(date),
        next_contact: isoOrEmpty(next),
      });
      setFeedback({ ok: result.ok, text: result.ok ? "Contato registrado." : result.error });
      if (result.ok) { setContact(false); router.refresh(); }
    });
  }

  function convert() {
    startTransition(async () => {
      const result = await convertLeadToClientAction(lead.id);
      setFeedback({ ok: result.ok, text: result.ok ? "Lead convertido em cliente." : result.error });
      if (result.ok) { setConfirmConvert(false); router.refresh(); }
    });
  }

  return <>
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => setEdit(true)} className="btn btn-ghost">Editar</button>
      <button onClick={() => setContact(true)} className="btn btn-ghost">Registrar contato</button>
      <select value={lead.status} disabled={pending} onChange={(e) => changeStatus(e.target.value)} className="input w-auto min-w-48">
        {LEAD_STATUSES.map((status) => <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>)}
      </select>
      {lead.status !== "client" && <button onClick={() => setConfirmConvert(true)} className="btn btn-primary">Converter em cliente</button>}
    </div>

    {feedback && <p className={`mt-3 rounded-md p-3 text-sm ${feedback.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.text}</p>}

    {edit && <Modal title="Editar lead" onClose={() => setEdit(false)}><LeadForm profiles={profiles} initial={lead} onDone={() => { setEdit(false); setFeedback({ ok: true, text: "Lead atualizado." }); }} /></Modal>}

    {contact && <Modal title="Registrar contato" onClose={() => setContact(false)}>
      <form onSubmit={register} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm"><span className="mb-1 block font-medium">Tipo</span><select name="type" className="input">{CONTACT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="text-sm"><span className="mb-1 block font-medium">Data *</span><input name="date" required type="datetime-local" className="input" /></label>
        <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Descrição *</span><textarea name="description" required rows={4} className="input" placeholder="Ex.: Enviei apresentação da Zenfy." /></label>
        <label className="text-sm"><span className="mb-1 block font-medium">Próximo contato</span><input name="next_contact" type="datetime-local" className="input" /></label>
        <div className="flex items-end justify-end gap-3 md:col-span-2"><button type="button" onClick={() => setContact(false)} className="btn btn-ghost">Cancelar</button><button disabled={pending} className="btn btn-primary">{pending ? "Salvando..." : "Registrar contato"}</button></div>
      </form>
    </Modal>}

    {confirmConvert && <Modal title="Converter lead em cliente?" onClose={() => setConfirmConvert(false)}>
      <p className="text-sm text-zinc-600">O lead continuará com todo o histórico comercial e será vinculado a um registro de cliente. A operação evita duplicação pelo lead de origem.</p>
      <div className="mt-6 flex justify-end gap-3"><button onClick={() => setConfirmConvert(false)} className="btn btn-ghost">Cancelar</button><button disabled={pending} onClick={convert} className="btn btn-primary">{pending ? "Convertendo..." : "Confirmar conversão"}</button></div>
    </Modal>}
  </>;
}
