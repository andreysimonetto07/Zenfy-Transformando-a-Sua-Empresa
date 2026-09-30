-- Zenfy · autenticação de clientes/empresas
-- Rode esta migration no SQL Editor do Supabase já existente.

create unique index if not exists clients_profile_id_unique
  on public.clients(profile_id)
  where profile_id is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_company_name text;
  v_whatsapp text;
  v_company_id uuid;
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1), 'Usuário'),
    new.email,
    'client'
  )
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email,
        updated_at = now();

  v_company_name := nullif(trim(coalesce(new.raw_user_meta_data->>'company_name', '')), '');
  v_whatsapp := nullif(trim(coalesce(new.raw_user_meta_data->>'whatsapp', '')), '');

  if v_company_name is not null then
    select c.id into v_company_id
    from public.companies c
    where lower(c.name) = lower(v_company_name)
      and lower(coalesce(c.email, '')) = lower(coalesce(new.email, ''))
    limit 1;

    if v_company_id is null then
      insert into public.companies (name, email, whatsapp)
      values (v_company_name, new.email, v_whatsapp)
      returning id into v_company_id;
    end if;

    if not exists (select 1 from public.clients c where c.profile_id = new.id) then
      insert into public.clients (profile_id, company_id, status)
      values (new.id, v_company_id, 'ativo');
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
