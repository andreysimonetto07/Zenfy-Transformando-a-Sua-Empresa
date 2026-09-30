import { requireProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export type ClientPortalContext = {
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"];
  profile: Awaited<ReturnType<typeof requireProfile>>["profile"];
  client: {
    id: string;
    company_id: string | null;
    plan: string | null;
    status: string | null;
    value: number | null;
  } | null;
  company: {
    id: string;
    name: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    instagram: string | null;
    website: string | null;
    city: string | null;
    state: string | null;
  } | null;
};

export async function requireClientPortal(): Promise<ClientPortalContext> {
  const { supabase, profile } = await requireProfile(["client"]);

  const { data: client } = await supabase
    .from("clients")
    .select("id,company_id,plan,status,value")
    .eq("profile_id", profile.id)
    .maybeSingle();

  let company = null;
  if (client?.company_id) {
    const service = createServiceClient();
    const { data } = await service
      .from("companies")
      .select("id,name,phone,whatsapp,email,instagram,website,city,state")
      .eq("id", client.company_id)
      .maybeSingle();
    company = data ?? null;
  }

  return { supabase, profile, client: client ?? null, company };
}

export function brl(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(amount) ? amount : 0);
}

export function numberBr(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR").format(Number.isFinite(amount) ? amount : 0);
}

export function dateBr(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : value + "T12:00:00");
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export function statusLabel(value?: string | null) {
  const labels: Record<string,string> = {
    planejamento: "Planejamento",
    desenvolvimento: "Em desenvolvimento",
    ativo: "Ativo",
    pausado: "Pausado",
    arquivado: "Arquivado",
    pendente: "Pendente",
    pago: "Pago",
    atrasado: "Atrasado",
    cancelado: "Cancelado",
    aberta: "Aberta",
    em_andamento: "Em andamento",
    concluida: "Concluída",
  };
  return labels[value || ""] || value || "—";
}
