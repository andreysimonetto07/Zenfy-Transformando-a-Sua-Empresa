"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClientPortal } from "@/lib/client-portal";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

const messageSchema = z.object({
  content: z.string().trim().min(1, "Escreva uma mensagem.").max(3000),
  project_id: z.string().uuid().optional().or(z.literal("")),
});

const supportSchema = z.object({
  subject: z.string().trim().min(3).max(160),
  kind: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(5000),
  priority: z.enum(["baixa","normal","alta","urgente"]),
  project_id: z.string().uuid().optional().or(z.literal("")),
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  company_name: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().max(40).optional(),
  website: z.string().trim().max(300).optional(),
  instagram: z.string().trim().max(160).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(80).optional(),
});

export async function sendClientMessageAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = messageSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Mensagem inválida." };

    const { profile } = await requireClientPortal();
    const service = createServiceClient();

    const { data: admin, error: adminError } = await service
      .from("profiles")
      .select("id")
      .in("role", ["super_admin","admin"])
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (adminError || !admin?.id) return { ok: false, error: "A equipe Zenfy ainda não possui um responsável configurado para mensagens." };

    const { error } = await service.from("messages").insert({
      sender_id: profile.id,
      receiver_id: admin.id,
      project_id: parsed.data.project_id || null,
      content: parsed.data.content,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/cliente/mensagens");
    revalidatePath("/admin/mensagens");
    return { ok: true, message: "Mensagem enviada para a equipe Zenfy." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível enviar a mensagem." };
  }
}

export async function createSupportRequestAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = supportSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os dados da solicitação." };

    const { supabase, profile } = await requireClientPortal();
    const { error } = await supabase.from("service_requests").insert({
      client_id: profile.id,
      project_id: parsed.data.project_id || null,
      subject: parsed.data.subject,
      kind: parsed.data.kind,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: "aberta",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/cliente/suporte");
    revalidatePath("/admin/tarefas");
    return { ok: true, message: "Solicitação aberta. A equipe Zenfy já consegue acompanhar." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível abrir a solicitação." };
  }
}

export async function updateClientProfileAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira os dados da sua conta." };

    const { supabase, profile, client } = await requireClientPortal();
    const d = parsed.data;

    const { error: profileError } = await supabase.from("profiles").update({
      name: d.name,
      phone: d.phone || null,
      updated_at: new Date().toISOString(),
    }).eq("id", profile.id);
    if (profileError) throw new Error(profileError.message);

    if (client?.company_id) {
      const service = createServiceClient();
      const { error: companyError } = await service.from("companies").update({
        name: d.company_name,
        whatsapp: d.whatsapp || null,
        website: d.website || null,
        instagram: d.instagram || null,
        city: d.city || null,
        state: d.state || null,
        updated_at: new Date().toISOString(),
      }).eq("id", client.company_id);
      if (companyError) throw new Error(companyError.message);
    }

    revalidatePath("/cliente/perfil");
    revalidatePath("/cliente/dashboard");
    return { ok: true, message: "Dados atualizados." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível atualizar os dados." };
  }
}

export async function uploadClientFileAction(formData: FormData): Promise<ActionResult> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Escolha um arquivo." };
    if (file.size > 10 * 1024 * 1024) return { ok: false, error: "O arquivo deve ter no máximo 10 MB." };

    const projectId = String(formData.get("project_id") || "").trim();
    const { profile, client } = await requireClientPortal();
    if (!client) return { ok: false, error: "Sua conta de cliente ainda não está vinculada corretamente." };

    const service = createServiceClient();
    const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${profile.id}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await service.storage.from("client-files").upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) {
      if (uploadError.message.toLowerCase().includes("bucket")) {
        return { ok: false, error: "O armazenamento ainda não foi ativado. Rode a migration 004_client_portal.sql no Supabase." };
      }
      throw new Error(uploadError.message);
    }

    const { error: dbError } = await service.from("files").insert({
      owner_id: profile.id,
      client_id: client.id,
      project_id: projectId || null,
      path,
      name: file.name,
    });

    if (dbError) {
      await service.storage.from("client-files").remove([path]);
      throw new Error(dbError.message);
    }

    revalidatePath("/cliente/arquivos");
    return { ok: true, message: "Arquivo enviado para a Zenfy." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível enviar o arquivo." };
  }
}
