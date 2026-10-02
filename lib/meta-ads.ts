import { createServiceClient } from "@/lib/supabase/server";

type MetaAction = { action_type?: string; value?: string };
type MetaInsight = Record<string, any>;

const LEAD_ACTIONS = new Set([
  "lead",
  "onsite_conversion.lead_grouped",
  "offsite_conversion.fb_pixel_lead",
  "omni_lead",
]);

const PURCHASE_ACTIONS = new Set([
  "purchase",
  "omni_purchase",
  "offsite_conversion.fb_pixel_purchase",
]);

function graphVersion() {
  const version = process.env.META_GRAPH_VERSION?.trim();
  if (!version) throw new Error("META_GRAPH_VERSION não configurado na Vercel.");
  return version;
}

function accessToken() {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("META_ACCESS_TOKEN não configurado na Vercel.");
  return token;
}

export function normalizeMetaAccountId(value: string) {
  const clean = value.trim();
  return clean.startsWith("act_") ? clean : `act_${clean.replace(/\D/g, "")}`;
}

function numeric(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function actionValue(actions: MetaAction[] | undefined, accepted: Set<string>) {
  return (actions ?? []).reduce((total, action) => accepted.has(action.action_type || "") ? total + numeric(action.value) : total, 0);
}

function firstActionValue(actions: MetaAction[] | undefined, accepted: Set<string>) {
  for (const action of actions ?? []) {
    if (accepted.has(action.action_type || "")) return numeric(action.value);
  }
  return 0;
}

async function fetchInsights(accountId: string, since: string, until: string, level: "account" | "campaign" | "ad") {
  const fields = [
    "date_start","date_stop","account_id","account_name",
    ...(level === "campaign" ? ["campaign_id","campaign_name"] : []),
    ...(level === "ad" ? ["campaign_id","campaign_name","adset_id","adset_name","ad_id","ad_name"] : []),
    "spend","impressions","reach","clicks","unique_clicks","inline_link_clicks",
    "ctr","cpc","cpm","frequency","actions","action_values","purchase_roas"
  ].join(",");

  const params = new URLSearchParams({
    access_token: accessToken(),
    fields,
    level,
    time_increment: "1",
    limit: "500",
    time_range: JSON.stringify({ since, until }),
  });

  let next: string | null = `https://graph.facebook.com/${graphVersion()}/${normalizeMetaAccountId(accountId)}/insights?${params.toString()}`;
  const rows: MetaInsight[] = [];

  while (next) {
    const response: Response = await fetch(next as string, { cache: "no-store" });
    const json: any = await response.json();

    if (!response.ok || json?.error) {
      throw new Error(json?.error?.message || "A Meta não retornou os insights da conta.");
    }

    if (Array.isArray(json?.data)) rows.push(...json.data);
    next = json?.paging?.next || null;

    if (rows.length > 10000) break;
  }

  return rows;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function mapInsight(row: MetaInsight, clientId: string, integrationId: string, level: "account" | "campaign" | "ad") {
  const leads = Math.round(actionValue(row.actions, LEAD_ACTIONS));
  const purchases = Math.round(actionValue(row.actions, PURCHASE_ACTIONS));
  const revenue = actionValue(row.action_values, PURCHASE_ACTIONS);
  const spend = numeric(row.spend);
  const externalId = level === "ad"
    ? String(row.ad_id || row.campaign_id || row.account_id || "ad")
    : level === "campaign"
      ? String(row.campaign_id || row.account_id || "campaign")
      : String(row.account_id || "account");

  return {
    client_id: clientId,
    integration_id: integrationId,
    provider: "meta_ads",
    date: row.date_start,
    level,
    external_id: externalId,
    account_id: row.account_id || null,
    account_name: row.account_name || null,
    campaign_id: row.campaign_id || null,
    campaign_name: row.campaign_name || null,
    adset_id: row.adset_id || null,
    adset_name: row.adset_name || null,
    ad_id: row.ad_id || null,
    ad_name: row.ad_name || null,
    spend,
    impressions: Math.round(numeric(row.impressions)),
    reach: Math.round(numeric(row.reach)),
    clicks: Math.round(numeric(row.clicks)),
    unique_clicks: Math.round(numeric(row.unique_clicks)),
    link_clicks: Math.round(numeric(row.inline_link_clicks)),
    ctr: numeric(row.ctr),
    cpc: numeric(row.cpc),
    cpm: numeric(row.cpm),
    frequency: numeric(row.frequency),
    leads,
    conversions: leads,
    purchases,
    revenue,
    roas: spend > 0 ? revenue / spend : firstActionValue(row.purchase_roas, new Set(["omni_purchase","purchase"])),
    raw: row,
    updated_at: new Date().toISOString(),
  };
}

export async function syncMetaClient(clientId: string, options?: { days?: number }) {
  const service = createServiceClient();
  const startedAt = new Date().toISOString();

  const { data: integration, error: integrationError } = await service
    .from("analytics_integrations")
    .select("*")
    .eq("client_id", clientId)
    .eq("provider", "meta_ads")
    .eq("status", "active")
    .maybeSingle();

  if (integrationError) throw new Error(integrationError.message);
  if (!integration) return { ok: false as const, skipped: true as const, message: "Meta Ads não conectado para este cliente." };

  const log = await service.from("analytics_sync_logs").insert({
    client_id: clientId,
    integration_id: integration.id,
    provider: "meta_ads",
    status: "success",
    rows_synced: 0,
    started_at: startedAt,
  }).select("id").single();

  try {
    const days = Math.max(7, Math.min(options?.days || 35, 90));
    const untilDate = new Date();
    const sinceDate = new Date();
    sinceDate.setUTCDate(sinceDate.getUTCDate() - days + 1);

    const since = formatDate(sinceDate);
    const until = formatDate(untilDate);

    const [accountRows, campaignRows, adRows] = await Promise.all([
      fetchInsights(integration.external_account_id, since, until, "account"),
      fetchInsights(integration.external_account_id, since, until, "campaign"),
      fetchInsights(integration.external_account_id, since, until, "ad"),
    ]);

    const rows = [
      ...accountRows.map((row) => mapInsight(row, clientId, integration.id, "account")),
      ...campaignRows.map((row) => mapInsight(row, clientId, integration.id, "campaign")),
      ...adRows.map((row) => mapInsight(row, clientId, integration.id, "ad")),
    ];

    if (rows.length) {
      for (let index = 0; index < rows.length; index += 400) {
        const chunk = rows.slice(index, index + 400);
        const { error: upsertError } = await service
          .from("ad_daily_metrics")
          .upsert(chunk, { onConflict: "client_id,provider,date,level,external_id" });
        if (upsertError) throw new Error(upsertError.message);
      }
    }

    const accountName = accountRows.find((row) => row.account_name)?.account_name || integration.account_name || null;
    const syncedAt = new Date().toISOString();

    await service.from("analytics_integrations").update({
      account_name: accountName,
      last_synced_at: syncedAt,
      last_error: null,
      status: "active",
      updated_at: syncedAt,
    }).eq("id", integration.id);

    if (log.data?.id) {
      await service.from("analytics_sync_logs").update({
        status: "success",
        rows_synced: rows.length,
        message: `Sincronização concluída: ${since} até ${until}.`,
        finished_at: syncedAt,
      }).eq("id", log.data.id);
    }

    return { ok: true as const, rows: rows.length, accountName, syncedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao sincronizar Meta Ads.";
    const finishedAt = new Date().toISOString();

    await service.from("analytics_integrations").update({
      status: "error",
      last_error: message,
      updated_at: finishedAt,
    }).eq("id", integration.id);

    if (log.data?.id) {
      await service.from("analytics_sync_logs").update({
        status: "error",
        message,
        finished_at: finishedAt,
      }).eq("id", log.data.id);
    }

    throw error;
  }
}

export async function syncAllMetaClients() {
  const service = createServiceClient();
  const { data, error } = await service
    .from("analytics_integrations")
    .select("client_id")
    .eq("provider", "meta_ads")
    .eq("status", "active")
    .eq("sync_mode", "auto");

  if (error) throw new Error(error.message);

  const results = [];
  for (const row of data ?? []) {
    try {
      results.push({ client_id: row.client_id, ...(await syncMetaClient(row.client_id)) });
    } catch (error) {
      results.push({ client_id: row.client_id, ok: false, message: error instanceof Error ? error.message : "Erro" });
    }
  }
  return results;
}

export async function syncMetaIfStale(clientId: string, minutes = 20) {
  if (!process.env.META_ACCESS_TOKEN) return;

  const service = createServiceClient();
  const { data } = await service
    .from("analytics_integrations")
    .select("status,last_synced_at")
    .eq("client_id", clientId)
    .eq("provider", "meta_ads")
    .maybeSingle();

  if (!data || data.status !== "active") return;

  const last = data.last_synced_at ? new Date(data.last_synced_at).getTime() : 0;
  if (Date.now() - last < minutes * 60_000) return;

  try {
    await syncMetaClient(clientId, { days: 35 });
  } catch {
    // O dashboard continua usando os últimos dados salvos mesmo se a Meta estiver indisponível.
  }
}
