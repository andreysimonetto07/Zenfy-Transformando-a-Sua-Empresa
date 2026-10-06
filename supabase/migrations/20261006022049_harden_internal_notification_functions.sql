-- Internal notification helpers are called by trusted triggers/server code only.
-- Removing API EXECUTE does not disable triggers, RLS or client table access.
alter function public.is_admin() set search_path = public, pg_temp;

do $migration$
declare routine record;
begin
  for routine in
    select p.oid::regprocedure as signature
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
      and (p.proname = 'handle_new_user' or p.proname like 'zenfy\_%' escape '\')
      and (p.prorettype = 'trigger'::regtype or p.proname in ('zenfy_notify_user', 'zenfy_notify_admins'))
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', routine.signature);
    execute format('grant execute on function %s to service_role', routine.signature);
  end loop;
end;
$migration$;
