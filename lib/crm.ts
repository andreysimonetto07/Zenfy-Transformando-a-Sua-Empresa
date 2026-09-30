export const LEAD_STATUSES = [
  "new",
  "contacted",
  "waiting_response",
  "responded",
  "interested",
  "meeting_scheduled",
  "proposal_sent",
  "negotiation",
  "client",
  "future_contact",
  "not_interested",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Novo Lead",
  contacted: "Contato Realizado",
  waiting_response: "Aguardando Resposta",
  responded: "Respondeu",
  interested: "Interessado",
  meeting_scheduled: "Reunião Marcada",
  proposal_sent: "Proposta Enviada",
  negotiation: "Negociação",
  client: "Cliente",
  future_contact: "Contato Futuro",
  not_interested: "Sem Interesse",
};

export const LEAD_SERVICES = [
  "Site Institucional",
  "Landing Page",
  "Desenvolvimento Web",
  "Tráfego Pago",
  "Automação",
  "Criativos",
  "Copywriting",
  "Consultoria Digital",
  "Outro",
] as const;

export const LEAD_SOURCES = [
  "Site Zenfy",
  "Prospecção manual",
  "Instagram",
  "WhatsApp",
  "Indicação",
  "Google",
  "E-mail",
  "Outro",
] as const;

export const CONTACT_TYPES = ["WhatsApp", "Ligação", "E-mail", "Instagram", "Reunião", "Outro"] as const;

export function leadStatusLabel(status: string) {
  return LEAD_STATUS_LABELS[status as LeadStatus] ?? status;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

export function isOverdue(nextContact?: string | null, status?: string) {
  if (!nextContact || status === "client" || status === "not_interested") return false;
  return new Date(nextContact).getTime() < Date.now();
}
