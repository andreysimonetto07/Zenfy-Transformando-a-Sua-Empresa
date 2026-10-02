-- Zenfy · Integrações de marketing e métricas automáticas
-- Rode depois da 007_notification_preferences.sql.

create table if not exists public.analytics_integrations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  provider text not null check (provider in ('meta_ads','google_analytics','google_ads')),
  external_account_id text not null,
  account_name text,
  status text not null default 'active' check (status in ('active','paused','error','disconnected')),
  sync_mode text not null default 'auto' check (sync_mode in ('auto','manual')),
  settings jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, provider)
);

create table if not exists public.ad_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  integration_id uuid references public.analytics_integrations(id) on delete cascade,
  provider text not null check (provider in ('meta_ads','google_ads')),
  date date not null,
  level text not null check (level in ('account','campaign','adset','ad')),
  external_id text not null,
  account_id text,
  account_name text,
  campaign_id text,
  campaign_name text,
  adset_id text,
  adset_name text,
  ad_id text,
  ad_name text,
  spend numeric not null default 0,
  impressions bigint not null default 0,
  reach bigint not null default 0,
  clicks bigint not null default 0,
  unique_clicks bigint not null default 0,
  link_clicks bigint not null default 0,
  ctr numeric not null default 0,
  cpc numeric not null default 0,
  cpm numeric not null default 0,
  frequency numeric not null default 0,
  leads integer not null default 0,
  conversions integer not null default 0,
  purchases integer not null default 0,
  revenue numeric not null default 0,
  roas numeric not null default 0,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, provider, date, level, external_id)
);

create table if not exists public.analytics_sync_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  integration_id uuid references public.analytics_integrations(id) on delete cascade,
  provider text not null,
  status text not null check (status in ('success','error')),
  rows_synced integer not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists analytics_integrations_client_idx
  on public.analytics_integrations(client_id, provider);

create index if not exists ad_daily_metrics_client_date_idx
  on public.ad_daily_metrics(client_id, provider, date desc);

create index if not exists ad_daily_metrics_campaign_idx
  on public.ad_daily_metrics(client_id, provider, campaign_id, date desc);

create index if not exists analytics_sync_logs_client_idx
  on public.analytics_sync_logs(client_id, started_at desc);

alter table public.analytics_integrations enable row level security;
alter table public.ad_daily_metrics enable row level security;
alter table public.analytics_sync_logs enable row level security;

drop policy if exists "admin all analytics integrations" on public.analytics_integrations;
create policy "admin all analytics integrations" on public.analytics_integrations
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client own analytics integrations" on public.analytics_integrations;
create policy "client own analytics integrations" on public.analytics_integrations
  for select using (
    client_id in (select id from public.clients where profile_id = auth.uid())
  );

drop policy if exists "admin all ad daily metrics" on public.ad_daily_metrics;
create policy "admin all ad daily metrics" on public.ad_daily_metrics
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client own ad daily metrics" on public.ad_daily_metrics;
create policy "client own ad daily metrics" on public.ad_daily_metrics
  for select using (
    client_id in (select id from public.clients where profile_id = auth.uid())
  );

drop policy if exists "admin analytics sync logs" on public.analytics_sync_logs;
create policy "admin analytics sync logs" on public.analytics_sync_logs
  for all using (public.is_admin()) with check (public.is_admin());
