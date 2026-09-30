-- Zenfy · Preferências de notificações por usuário
-- Rode depois da 006_notifications.sql.

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  in_app_enabled boolean not null default true,
  browser_enabled boolean not null default false,
  messages boolean not null default true,
  files boolean not null default true,
  billing boolean not null default true,
  traffic boolean not null default true,
  projects boolean not null default true,
  support boolean not null default true,
  leads boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

drop policy if exists "own notification preferences read" on public.notification_preferences;
create policy "own notification preferences read" on public.notification_preferences
  for select using (user_id = auth.uid());

drop policy if exists "own notification preferences insert" on public.notification_preferences;
create policy "own notification preferences insert" on public.notification_preferences
  for insert with check (user_id = auth.uid());

drop policy if exists "own notification preferences update" on public.notification_preferences;
create policy "own notification preferences update" on public.notification_preferences
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

insert into public.notification_preferences(user_id)
select id from public.profiles
on conflict (user_id) do nothing;

create or replace function public.zenfy_create_notification_preferences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_preferences(user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists zenfy_create_notification_preferences on public.profiles;
create trigger zenfy_create_notification_preferences
after insert on public.profiles
for each row execute function public.zenfy_create_notification_preferences();
