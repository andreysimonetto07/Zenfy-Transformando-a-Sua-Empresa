-- Zenfy · Relatórios diários + som + marcos importantes
-- Rode depois da 008_meta_ads_analytics.sql.

alter table public.notification_preferences
  add column if not exists sound_enabled boolean not null default true;

create table if not exists public.client_daily_updates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  update_date date not null,
  title text not null default 'Atualização do dia',
  work_done text not null,
  results text,
  next_steps text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(client_id, update_date)
);

create index if not exists client_daily_updates_client_date_idx
  on public.client_daily_updates(client_id, update_date desc);

alter table public.client_daily_updates enable row level security;

drop policy if exists "admin all daily updates" on public.client_daily_updates;
create policy "admin all daily updates" on public.client_daily_updates
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client own daily updates" on public.client_daily_updates;
create policy "client own daily updates" on public.client_daily_updates
  for select using (
    client_id in (select id from public.clients where profile_id = auth.uid())
  );

create or replace function public.zenfy_notification_daily_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid;
begin
  select profile_id into v_profile from public.clients where id = new.client_id;

  perform public.zenfy_notify_user(
    v_profile,
    'daily_update',
    'Nova atualização da Zenfy',
    'O relatório do dia ' || to_char(new.update_date,'DD/MM') || ' já está disponível para sua empresa.',
    '/cliente/dashboard',
    jsonb_build_object('daily_update_id',new.id,'date',new.update_date)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_daily_update on public.client_daily_updates;
create trigger zenfy_notification_daily_update
after insert on public.client_daily_updates
for each row execute function public.zenfy_notification_daily_update();

create or replace function public.zenfy_notification_lead_milestone()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid;
  v_new_milestone integer;
  v_old_milestone integer;
  v_today date;
begin
  if new.provider <> 'meta_ads' or new.level <> 'account' then
    return new;
  end if;

  v_today := (now() at time zone 'America/Sao_Paulo')::date;
  if new.date <> v_today then
    return new;
  end if;

  v_new_milestone := floor(coalesce(new.leads,0)::numeric / 10)::integer * 10;
  v_old_milestone := case
    when tg_op = 'UPDATE' then floor(coalesce(old.leads,0)::numeric / 10)::integer * 10
    else 0
  end;

  if v_new_milestone >= 10 and v_new_milestone > v_old_milestone then
    select profile_id into v_profile from public.clients where id = new.client_id;

    perform public.zenfy_notify_user(
      v_profile,
      'lead_milestone',
      v_new_milestone || ' leads alcançados 🎯',
      'As campanhas da sua empresa atingiram um novo marco hoje. Abra os resultados para acompanhar.',
      '/cliente/resultados?tab=meta&period=7',
      jsonb_build_object(
        'metric_id',new.id,
        'milestone',v_new_milestone,
        'date',new.date,
        'provider',new.provider
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists zenfy_notification_lead_milestone on public.ad_daily_metrics;
create trigger zenfy_notification_lead_milestone
after insert or update of leads on public.ad_daily_metrics
for each row execute function public.zenfy_notification_lead_milestone();
