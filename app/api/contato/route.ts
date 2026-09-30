import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const d = parsed.data;
  const db = createServiceClient();
  const companyName = d.company || d.name;

  const { data: existingCompany } = await db.from("companies").select("id").ilike("name", companyName).limit(1).maybeSingle();
  let companyId = existingCompany?.id as string | undefined;
  if (!companyId) {
    const { data: company, error: companyError } = await db.from("companies").insert({
      name: companyName, whatsapp: d.whatsapp, email: d.email, instagram: d.instagram || null, website: d.website || null,
    }).select("id").single();
    if (companyError) return NextResponse.json({ error: "Não foi possível enviar." }, { status: 500 });
    companyId = company.id;
  }

  const serviceMap: Record<string, string> = { "Site completo": "Site Institucional", "Consultoria": "Consultoria Digital" };
  const { data: lead, error } = await db.from("leads").insert({
    company_id: companyId,
    contact_name: d.name,
    whatsapp: d.whatsapp,
    email: d.email,
    service: serviceMap[d.service] || d.service,
    source: "Site Zenfy",
    status: "new",
    notes: d.message || null,
  }).select("id").single();
  if (error) return NextResponse.json({ error: "Não foi possível enviar." }, { status: 500 });

  await db.from("contact_requests").insert({ lead_id: lead.id, payload: d });
  await db.from("activities").insert({ lead_id: lead.id, action: "lead_criado", description: "Lead recebido pelo formulário do site." });
  await db.from("notifications").insert({ type: "novo_lead", title: "Novo lead recebido", body: `${d.name} — ${d.service}` });
  return NextResponse.json({ ok: true });
}
