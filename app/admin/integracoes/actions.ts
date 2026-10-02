"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { normalizeMetaAccountId, syncMetaClient } from "@/lib/meta-ads";

type Result = { ok: true; message: string } | { ok: false; error: string };

const schema = z.object({
  client_id: z.string().uuid(),
  account_id: z.string().trim().min(5).max(80),
  account_name: z.string().trim().max(160).optional(),
});

function refresh(clientId:string) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${clientId}`);
  revalidatePath("/cliente/dashboard");
  revalidatePath("/cliente/resultados");
  revalidatePath("/cliente/trafego");
}

export async function saveMetaIntegrationAction(raw: unknown): Promise<Result> {
  try {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return { ok:false, error:"Confira o ID da conta de anúncios." };

    const { supabase } = await requireProfile(ADMIN_ROLES);
    const data = parsed.data;

    const { error } = await supabase.from("analytics_integrations").upsert({
      client_id: data.client_id,
      provider: "meta_ads",
      external_account_id: normalizeMetaAccountId(data.account_id),
      account_name: data.account_name || null,
      status: "active",
      sync_mode: "auto",
      last_error: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "client_id,provider" });

    if (error) throw new Error(error.message);
    refresh(data.client_id);
    return { ok:true, message:"Conta Meta Ads conectada ao cliente." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível salvar.";
    if (message.includes("analytics_integrations")) return { ok:false, error:"Rode a migration 008_meta_ads_analytics.sql no Supabase." };
    return { ok:false, error:message };
  }
}

export async function syncMetaIntegrationAction(raw: unknown): Promise<Result> {
  try {
    const clientId = z.string().uuid().parse((raw as any)?.client_id);
    await requireProfile(ADMIN_ROLES);
    const result = await syncMetaClient(clientId);
    if (!result.ok) return { ok:false, error:result.message };
    refresh(clientId);
    return { ok:true, message:`Meta Ads sincronizado: ${result.rows} linhas atualizadas.` };
  } catch (error) {
    return { ok:false, error:error instanceof Error ? error.message : "Falha ao sincronizar Meta Ads." };
  }
}

export async function disconnectMetaIntegrationAction(raw: unknown): Promise<Result> {
  try {
    const clientId = z.string().uuid().parse((raw as any)?.client_id);
    const { supabase } = await requireProfile(ADMIN_ROLES);
    const { error } = await supabase.from("analytics_integrations").update({
      status:"disconnected",
      updated_at:new Date().toISOString(),
    }).eq("client_id",clientId).eq("provider","meta_ads");
    if(error)throw new Error(error.message);
    refresh(clientId);
    return {ok:true,message:"Meta Ads desconectado deste cliente."};
  } catch(error) {
    return {ok:false,error:error instanceof Error?error.message:"Não foi possível desconectar."};
  }
}
