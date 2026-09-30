-- Zenfy · Companhia A & P — schema base + RLS. Execute no SQL Editor do Supabase.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null, email text, avatar_url text, phone text,
  role text not null default 'client' check (role in ('super_admin','admin','client')),
  created_at timestamptz default now(), updated_at timestamptz default now());
create table companies (id uuid primary key default gen_random_uuid(), name text not null, document text, phone text, whatsapp text, email text, instagram text, facebook text, website text, city text, state text, industry text, notes text, created_at timestamptz default now(), updated_at timestamptz default now());
create table leads (id uuid primary key default gen_random_uuid(), company_id uuid references companies, contact_name text not null, phone text, whatsapp text, email text, service text, source text, status text not null default 'new' check (status in ('new','contacted','waiting_response','responded','interested','meeting_scheduled','proposal_sent','negotiation','client','future_contact','not_interested')), notes text, assigned_to uuid references profiles, last_contact timestamptz, next_contact timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table clients (id uuid primary key default gen_random_uuid(), profile_id uuid references profiles, company_id uuid references companies, lead_id uuid references leads on delete set null, plan text, status text default 'ativo', value numeric, notes text, created_at timestamptz default now());
create table projects (id uuid primary key default gen_random_uuid(), client_id uuid references clients, company_id uuid references companies, name text not null, description text, type text, status text default 'planejamento', progress int default 0 check (progress between 0 and 100 and progress % 10 = 0), start_date date, deadline date, price numeric, assigned_to uuid references profiles, created_at timestamptz default now(), updated_at timestamptz default now());
create table project_members (project_id uuid references projects on delete cascade, user_id uuid references profiles on delete cascade, primary key (project_id, user_id));
create table proposals (id uuid primary key default gen_random_uuid(), client_id uuid references clients, service text, description text, price numeric, payment_terms text, deadline text, valid_until date, status text default 'rascunho', created_at timestamptz default now());
create table tasks (id uuid primary key default gen_random_uuid(), title text not null, description text, project_id uuid references projects, assigned_to uuid references profiles, priority text default 'normal', due_date date, status text default 'pendente', created_at timestamptz default now());
create table messages (id uuid primary key default gen_random_uuid(), sender_id uuid references profiles not null, receiver_id uuid references profiles, project_id uuid references projects, content text not null, read boolean default false, created_at timestamptz default now());
create table files (id uuid primary key default gen_random_uuid(), owner_id uuid references profiles, project_id uuid references projects, path text not null, name text, created_at timestamptz default now());
create table contact_requests (id uuid primary key default gen_random_uuid(), lead_id uuid references leads, payload jsonb, created_at timestamptz default now());
create table service_requests (id uuid primary key default gen_random_uuid(), client_id uuid references profiles, project_id uuid references projects, subject text, kind text, description text, priority text default 'normal', status text default 'aberta', created_at timestamptz default now());
create table activities (id uuid primary key default gen_random_uuid(), user_id uuid references profiles, lead_id uuid references leads, client_id uuid references clients, project_id uuid references projects, action text, description text, created_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid references profiles, type text, title text, body text, read boolean default false, created_at timestamptz default now());
create table message_templates (id uuid primary key default gen_random_uuid(), name text, industry text, message text, created_by uuid references profiles, created_at timestamptz default now());
create table portfolio_projects (id uuid primary key default gen_random_uuid(), name text, client_name text, image_url text, description text, service text, technologies text[], url text, date date, results text, published boolean default false);

create unique index clients_lead_id_unique on clients(lead_id) where lead_id is not null;
create unique index clients_profile_id_unique on clients(profile_id) where profile_id is not null;
create index leads_status_idx on leads(status);
create index leads_assigned_to_idx on leads(assigned_to);
create index leads_next_contact_idx on leads(next_contact);
create index leads_company_id_idx on leads(company_id);
create index activities_lead_id_created_at_idx on activities(lead_id, created_at desc);

create function is_admin() returns boolean language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','super_admin')) $$;

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $
declare
  v_company_name text;
  v_whatsapp text;
  v_company_id uuid;
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email,'@',1), 'Usuário'),
    new.email,
    'client'
  );

  v_company_name := nullif(trim(coalesce(new.raw_user_meta_data->>'company_name', '')), '');
  v_whatsapp := nullif(trim(coalesce(new.raw_user_meta_data->>'whatsapp', '')), '');

  if v_company_name is not null then
    insert into public.companies (name, email, whatsapp)
    values (v_company_name, new.email, v_whatsapp)
    returning id into v_company_id;

    insert into public.clients (profile_id, company_id, status)
    values (new.id, v_company_id, 'ativo');
  end if;

  return new;
end $;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

do $$ declare t text; begin
  foreach t in array array['profiles','companies','leads','clients','projects','project_members','proposals','tasks','messages','files','contact_requests','service_requests','activities','notifications','message_templates','portfolio_projects']
  loop execute format('alter table %I enable row level security', t);
       if t <> 'profiles' then execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t); end if;
  end loop; end $$;

create policy "admin all" on profiles for all using (is_admin()) with check (is_admin());
create policy "own profile read" on profiles for select using (id = auth.uid());
create policy "own profile update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

create policy "client own record" on clients for select using (profile_id = auth.uid());
create policy "client own projects" on projects for select using (client_id in (select id from clients where profile_id = auth.uid()));
create policy "client own messages read" on messages for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "client send message" on messages for insert with check (sender_id = auth.uid());
create policy "client own requests" on service_requests for all using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy "client own files" on files for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "portfolio public" on portfolio_projects for select using (published);

-- Promover fundadores após criarem conta:
-- update profiles set role='super_admin' where email in ('EMAIL_ANDREY','EMAIL_PEDRO');
