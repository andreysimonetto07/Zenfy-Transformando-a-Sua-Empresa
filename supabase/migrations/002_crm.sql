-- Zenfy · Companhia A & P — CRM de leads
-- Pode ser executada após supabase/schema.sql.

update leads set status = 'new' where status = 'novo_lead';
update leads set source = 'Site Zenfy' where source = 'site';
update leads set service = 'Site Institucional' where service = 'Site completo';
update leads set service = 'Consultoria Digital' where service = 'Consultoria';

alter table leads alter column status set default 'new';
alter table leads drop constraint if exists leads_status_check;
alter table leads add constraint leads_status_check check (status in (
  'new','contacted','waiting_response','responded','interested',
  'meeting_scheduled','proposal_sent','negotiation','client',
  'future_contact','not_interested'
));

alter table clients add column if not exists lead_id uuid references leads(id) on delete set null;
create unique index if not exists clients_lead_id_unique on clients(lead_id) where lead_id is not null;

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_assigned_to_idx on leads(assigned_to);
create index if not exists leads_next_contact_idx on leads(next_contact);
create index if not exists leads_company_id_idx on leads(company_id);
create index if not exists activities_lead_id_created_at_idx on activities(lead_id, created_at desc);
