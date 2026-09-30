"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { companySchema, contactActivitySchema, leadSchema, statusSchema } from "@/lib/validators";
import { leadStatusLabel } from "@/lib/crm";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function nullable(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

async function addActivity(
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"],
  userId: string,
  leadId: string,
  action: string,
  description: string,
) {
  await supabase.from("activities").insert({ user_id: userId, lead_id: leadId, action, description });
}

async function findOrCreateCompany(
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"],
  input: { company: string; city?: string; state?: string; industry?: string; whatsapp?: string; phone?: string; email?: string; instagram?: string; website?: string },
  companyId?: string,
) {
  const payload = {
    name: input.company,
    city: nullable(input.city),
    state: nullable(input.state),
    industry: nullable(input.industry),
    whatsapp: nullable(input.whatsapp),
    phone: nullable(input.phone),
    email: nullable(input.email),
    instagram: nullable(input.instagram),
    website: nullable(input.website),
    updated_at: new Date().toISOString(),
  };

  if (companyId) {
    const { error } = await supabase.from("companies").update(payload).eq("id", companyId);
    if (error) throw new Error(error.message);
    return companyId;
  }

  let query = supabase.from("companies").select("id").ilike("name", input.company).limit(1);
  if (input.city?.trim()) query = query.ilike("city", input.city.trim());
  const { data: existing, error: existingError } = await query.maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing?.id) return existing.id as string;

  const { data, error } = await supabase.from("companies").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function createLeadAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os campos do lead." };
    const d = parsed.data;
    const { supabase, profile } = await requireProfile(ADMIN_ROLES);
    const companyId = await findOrCreateCompany(supabase, d, d.company_id || undefined);

    const { data, error } = await supabase
      .from("leads")
      .insert({
        company_id: companyId,
        contact_name: d.contact_name,
        phone: nullable(d.phone),
        whatsapp: nullable(d.whatsapp),
        email: nullable(d.email),
        service: d.service,
        source: d.source,
        status: d.status,
        notes: nullable(d.notes),
        assigned_to: nullable(d.assigned_to),
        last_contact: nullable(d.last_contact),
        next_contact: nullable(d.next_contact),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await addActivity(supabase, profile.id, data.id, "lead_criado", `Lead cadastrado por ${profile.name}.`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin/empresas");
    revalidatePath("/admin/dashboard");
    return { ok: true, id: data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível cadastrar o lead." };
  }
}

export async function updateLeadAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os campos do lead." };
    const d = parsed.data;
    if (!leadId) return { ok: false, error: "Lead inválido." };
    const leadId = leadId;
    const { supabase, profile } = await requireProfile(ADMIN_ROLES);
    const { data: before, error: beforeError } = await supabase.from("leads").select("assigned_to,status").eq("id", leadId).single();
    if (beforeError) throw new Error(beforeError.message);

    const companyId = await findOrCreateCompany(supabase, d, d.company_id || undefined);
    const { error } = await supabase
      .from("leads")
      .update({
        company_id: companyId,
        contact_name: d.contact_name,
        phone: nullable(d.phone),
        whatsapp: nullable(d.whatsapp),
        email: nullable(d.email),
        service: d.service,
        source: d.source,
        status: d.status,
        notes: nullable(d.notes),
        assigned_to: nullable(d.assigned_to),
        last_contact: nullable(d.last_contact),
        next_contact: nullable(d.next_contact),
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);
    if (error) throw new Error(error.message);

    await addActivity(supabase, profile.id, leadId, "lead_atualizado", "Dados do lead atualizados.");
    if (before.assigned_to !== nullable(d.assigned_to)) {
      await addActivity(supabase, profile.id, leadId, "responsavel_alterado", "Responsável do lead alterado.");
    }
    if (before.status !== d.status) {
      await addActivity(supabase, profile.id, leadId, "status_alterado", `Status alterado de ${leadStatusLabel(before.status)} para ${leadStatusLabel(d.status)}.`);
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/empresas");
    revalidatePath("/admin/dashboard");
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível salvar as alterações." };
  }
}

export async function updateLeadStatusAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = statusSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Status inválido." };
    const { supabase, profile } = await requireProfile(ADMIN_ROLES);
    const { data: lead, error: readError } = await supabase.from("leads").select("status").eq("id", parsed.data.id).single();
    if (readError) throw new Error(readError.message);
    if (lead.status === parsed.data.status) return { ok: true, id: parsed.data.id };

    const { error } = await supabase.from("leads").update({ status: parsed.data.status, updated_at: new Date().toISOString() }).eq("id", parsed.data.id);
    if (error) throw new Error(error.message);
    await addActivity(
      supabase,
      profile.id,
      parsed.data.id,
      "status_alterado",
      `Status alterado de ${leadStatusLabel(lead.status)} para ${leadStatusLabel(parsed.data.status)}.`,
    );
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${parsed.data.id}`);
    revalidatePath("/admin/dashboard");
    return { ok: true, id: parsed.data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível atualizar o status." };
  }
}

export async function registerContactAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = contactActivitySchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os dados do contato." };
    const d = parsed.data;
    const { supabase, profile } = await requireProfile(ADMIN_ROLES);
    const { error } = await supabase
      .from("leads")
      .update({ last_contact: d.date, next_contact: nullable(d.next_contact), updated_at: new Date().toISOString() })
      .eq("id", d.lead_id);
    if (error) throw new Error(error.message);
    await addActivity(supabase, profile.id, d.lead_id, "contato_registrado", `${d.type}: ${d.description}`);
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${d.lead_id}`);
    revalidatePath("/admin/dashboard");
    return { ok: true, id: d.lead_id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível registrar o contato." };
  }
}

export async function convertLeadToClientAction(leadId: string): Promise<ActionResult> {
  try {
    const id = statusSchema.shape.id.parse(leadId);
    const { supabase, profile } = await requireProfile(ADMIN_ROLES);
    const { data: lead, error: leadError } = await supabase.from("leads").select("id,company_id,contact_name").eq("id", id).single();
    if (leadError) throw new Error(leadError.message);

    const { data: existing, error: existingError } = await supabase.from("clients").select("id").eq("lead_id", id).maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (!existing) {
      const { error } = await supabase.from("clients").insert({ lead_id: id, company_id: lead.company_id, status: "ativo", notes: `Convertido do lead ${lead.contact_name}.` });
      if (error) throw new Error(error.message);
    }
    const { error: updateError } = await supabase.from("leads").update({ status: "client", updated_at: new Date().toISOString() }).eq("id", id);
    if (updateError) throw new Error(updateError.message);
    await addActivity(supabase, profile.id, id, "lead_convertido", "Lead convertido em cliente.");
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/admin/dashboard");
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível converter o lead." };
  }
}

export async function createCompanyAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = companySchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os dados da empresa." };
    const d = parsed.data;
    const { supabase } = await requireProfile(ADMIN_ROLES);
    const { data, error } = await supabase.from("companies").insert({
      name: d.name,
      document: nullable(d.document),
      industry: nullable(d.industry),
      phone: nullable(d.phone),
      whatsapp: nullable(d.whatsapp),
      email: nullable(d.email),
      instagram: nullable(d.instagram),
      facebook: nullable(d.facebook),
      website: nullable(d.website),
      city: nullable(d.city),
      state: nullable(d.state),
      notes: nullable(d.notes),
    }).select("id").single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/empresas");
    return { ok: true, id: data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível cadastrar a empresa." };
  }
}
