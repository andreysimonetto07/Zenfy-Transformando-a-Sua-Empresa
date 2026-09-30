-- Zenfy · Portal do cliente, gestão de tráfego e faturamento
-- Rode este arquivo no SQL Editor do Supabase depois do 003_auth_accounts.sql.

create table if not exists public.client_sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  url text,
  domain text,
  platform text,
  status text not null default 'ativo' check (status in ('planejamento','desenvolvimento','ativo','pausado','arquivado')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.traffic_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  period_start date not null,
  period_end date not null,
  platform text not null default 'Meta Ads',
  spend numeric not null default 0 check (spend >= 0),
  impressions bigint not null default 0 check (impressions >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  leads integer not null default 0 check (leads >= 0),
  conversions integer not null default 0 check (conversions >= 0),
  revenue numeric not null default 0 check (revenue >= 0),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  description text not null,
  amount numeric not null default 0 check (amount >= 0),
  due_date date,
  status text not null default 'pendente' check (status in ('pendente','pago','atrasado','cancelado')),
  payment_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.files add column if not exists client_id uuid references public.clients(id) on delete cascade;

create index if not exists client_sites_client_id_idx on public.client_sites(client_id);
create index if not exists traffic_reports_client_period_idx on public.traffic_reports(client_id, period_end desc);
create index if not exists invoices_client_status_idx on public.invoices(client_id, status);
create index if not exists files_client_id_idx on public.files(client_id);

alter table public.client_sites enable row level security;
alter table public.traffic_reports enable row level security;
alter table public.invoices enable row level security;

drop policy if exists "admin all" on public.client_sites;
drop policy if exists "admin all" on public.traffic_reports;
drop policy if exists "admin all" on public.invoices;

create policy "admin all" on public.client_sites for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.traffic_reports for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.invoices for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client own sites" on public.client_sites;
create policy "client own sites" on public.client_sites for select
  using (client_id in (select id from public.clients where profile_id = auth.uid()));

drop policy if exists "client own traffic" on public.traffic_reports;
create policy "client own traffic" on public.traffic_reports for select
  using (client_id in (select id from public.clients where profile_id = auth.uid()));

drop policy if exists "client own invoices" on public.invoices;
create policy "client own invoices" on public.invoices for select
  using (client_id in (select id from public.clients where profile_id = auth.uid()));

drop policy if exists "client mark own messages" on public.messages;
create policy "client mark own messages" on public.messages for update
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

drop policy if exists "client files by account" on public.files;
create policy "client files by account" on public.files for select
  using (
    owner_id = auth.uid()
    or client_id in (select id from public.clients where profile_id = auth.uid())
  );

insert into storage.buckets (id, name, public, file_size_limit)
values ('client-files', 'client-files', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists "client upload own files" on storage.objects;
create policy "client upload own files" on storage.objects for insert to authenticated
with check (
  bucket_id = 'client-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "client read own uploads" on storage.objects;
create policy "client read own uploads" on storage.objects for select to authenticated
using (
  bucket_id = 'client-files'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "admin manage client files storage" on storage.objects;
create policy "admin manage client files storage" on storage.objects for all to authenticated
using (bucket_id = 'client-files' and public.is_admin())
with check (bucket_id = 'client-files' and public.is_admin());
