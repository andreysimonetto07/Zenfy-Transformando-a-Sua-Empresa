-- Zenfy · Central de notificações
-- Rode depois da 004_client_portal.sql.

alter table public.notifications
  add column if not exists link text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists notifications_user_read_created_idx
  on public.notifications(user_id, read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "own notifications read" on public.notifications;
create policy "own notifications read" on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists "own notifications update" on public.notifications;
create policy "own notifications update" on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admin all" on public.notifications;
create policy "admin all" on public.notifications
  for all using (public.is_admin())
  with check (public.is_admin());

create or replace function public.zenfy_notify_user(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null then
    return;
  end if;

  insert into public.notifications(user_id,type,title,body,link,metadata)
  values (p_user_id,p_type,p_title,p_body,p_link,coalesce(p_metadata,'{}'::jsonb));
end;
$$;

create or replace function public.zenfy_notify_admins(
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications(user_id,type,title,body,link,metadata)
  select id,p_type,p_title,p_body,p_link,coalesce(p_metadata,'{}'::jsonb)
  from public.profiles
  where role in ('admin','super_admin');
end;
$$;

create or replace function public.zenfy_notification_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sender_name text;
  v_sender_role text;
  v_receiver_role text;
begin
  select name, role into v_sender_name, v_sender_role
  from public.profiles where id = new.sender_id;

  select role into v_receiver_role
  from public.profiles where id = new.receiver_id;

  if new.receiver_id is null then
    return new;
  end if;

  if v_sender_role in ('admin','super_admin') then
    perform public.zenfy_notify_user(
      new.receiver_id,
      'message',
      'Nova mensagem da Zenfy',
      coalesce(v_sender_name,'Equipe Zenfy') || ' enviou uma mensagem para você.',
      '/cliente/mensagens',
      jsonb_build_object('message_id',new.id)
    );
  else
    perform public.zenfy_notify_user(
      new.receiver_id,
      'message',
      'Nova mensagem de cliente',
      coalesce(v_sender_name,'Um cliente') || ' enviou uma mensagem.',
      '/admin/mensagens',
      jsonb_build_object('message_id',new.id)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists zenfy_notification_message on public.messages;
create trigger zenfy_notification_message
after insert on public.messages
for each row execute function public.zenfy_notification_message();

create or replace function public.zenfy_notification_file()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_name text;
  v_owner_role text;
  v_client_profile uuid;
begin
  select name, role into v_owner_name, v_owner_role
  from public.profiles where id = new.owner_id;

  if v_owner_role in ('admin','super_admin') then
    select profile_id into v_client_profile
    from public.clients where id = new.client_id;

    perform public.zenfy_notify_user(
      v_client_profile,
      'file',
      'Novo arquivo da Zenfy',
      coalesce(new.name,'Um arquivo') || ' foi disponibilizado na sua área.',
      '/cliente/arquivos',
      jsonb_build_object('file_id',new.id)
    );
  else
    perform public.zenfy_notify_admins(
      'file',
      'Cliente enviou um arquivo',
      coalesce(v_owner_name,'Um cliente') || ' enviou ' || coalesce(new.name,'um arquivo') || '.',
      '/admin/arquivos',
      jsonb_build_object('file_id',new.id,'client_id',new.client_id)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists zenfy_notification_file on public.files;
create trigger zenfy_notification_file
after insert on public.files
for each row execute function public.zenfy_notification_file();

create or replace function public.zenfy_notification_invoice()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid;
  v_title text;
begin
  select profile_id into v_profile from public.clients where id = new.client_id;
  v_title := case when tg_op = 'INSERT' then 'Nova cobrança disponível' else 'Cobrança atualizada' end;

  perform public.zenfy_notify_user(
    v_profile,
    'invoice',
    v_title,
    coalesce(new.description,'Uma cobrança') || ' · R$ ' || to_char(coalesce(new.amount,0),'FM999G999G990D00'),
    '/cliente/faturamento',
    jsonb_build_object('invoice_id',new.id,'status',new.status)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_invoice on public.invoices;
create trigger zenfy_notification_invoice
after insert or update on public.invoices
for each row execute function public.zenfy_notification_invoice();

create or replace function public.zenfy_notification_traffic()
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
    'traffic',
    'Resultados atualizados',
    coalesce(new.platform,'Campanha') || ': ' || coalesce(new.leads,0) || ' leads registrados no período.',
    '/cliente/trafego',
    jsonb_build_object('report_id',new.id,'leads',new.leads,'platform',new.platform)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_traffic on public.traffic_reports;
create trigger zenfy_notification_traffic
after insert or update on public.traffic_reports
for each row execute function public.zenfy_notification_traffic();

create or replace function public.zenfy_notification_project()
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
    'project',
    case when tg_op='INSERT' then 'Novo projeto na sua área' else 'Projeto atualizado' end,
    coalesce(new.name,'Projeto') || ' · ' || coalesce(new.status,'em andamento'),
    '/cliente/projetos',
    jsonb_build_object('project_id',new.id,'progress',new.progress)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_project on public.projects;
create trigger zenfy_notification_project
after insert or update of status,progress,deadline on public.projects
for each row execute function public.zenfy_notification_project();

create or replace function public.zenfy_notification_site()
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
    'site',
    case when tg_op='INSERT' then 'Novo site na sua área' else 'Site atualizado' end,
    coalesce(new.name,'Site') || ' · ' || coalesce(new.status,'em andamento'),
    '/cliente/sites',
    jsonb_build_object('site_id',new.id,'status',new.status)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_site on public.client_sites;
create trigger zenfy_notification_site
after insert or update of status,url,domain on public.client_sites
for each row execute function public.zenfy_notification_site();

create or replace function public.zenfy_notification_support()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  select name into v_name from public.profiles where id = new.client_id;

  perform public.zenfy_notify_admins(
    'support',
    'Nova solicitação de suporte',
    coalesce(v_name,'Um cliente') || ': ' || coalesce(new.subject,'Nova solicitação'),
    '/admin/tarefas',
    jsonb_build_object('request_id',new.id,'priority',new.priority)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_support on public.service_requests;
create trigger zenfy_notification_support
after insert on public.service_requests
for each row execute function public.zenfy_notification_support();

create or replace function public.zenfy_notification_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  select name into v_name from public.profiles where id = new.profile_id;

  perform public.zenfy_notify_admins(
    'client',
    'Novo cliente cadastrado',
    coalesce(v_name,'Novo cliente') || ' criou uma conta na Zenfy.',
    '/admin/clientes',
    jsonb_build_object('client_id',new.id)
  );

  return new;
end;
$$;

drop trigger if exists zenfy_notification_client on public.clients;
create trigger zenfy_notification_client
after insert on public.clients
for each row execute function public.zenfy_notification_client();

create or replace function public.zenfy_notification_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.source,'') ilike '%site%' then
    perform public.zenfy_notify_admins(
      'lead',
      'Novo lead pelo site',
      coalesce(new.contact_name,'Novo contato') || coalesce(' · '||new.service,''),
      '/admin/leads/' || new.id::text,
      jsonb_build_object('lead_id',new.id)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists zenfy_notification_lead on public.leads;
create trigger zenfy_notification_lead
after insert on public.leads
for each row execute function public.zenfy_notification_lead();
