-- Zenfy · Portfólio, cases, provas sociais e timestamps de relatórios
-- Rode depois das migrations anteriores. É seguro rodar uma vez.

alter table public.portfolio_projects
  add column if not exists category text default 'site',
  add column if not exists media_type text default 'image',
  add column if not exists video_url text,
  add column if not exists objective text,
  add column if not exists work_done text,
  add column if not exists featured boolean default false,
  add column if not exists created_at timestamptz default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'portfolio_projects_category_check'
  ) then
    alter table public.portfolio_projects
      add constraint portfolio_projects_category_check
      check (category in ('site','landing_page','sistema','video','criativo','case'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'portfolio_projects_media_type_check'
  ) then
    alter table public.portfolio_projects
      add constraint portfolio_projects_media_type_check
      check (media_type in ('image','video'));
  end if;
end $$;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  quote text not null,
  avatar_url text,
  rating integer check (rating between 1 and 5),
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials public" on public.testimonials;
create policy "testimonials public" on public.testimonials
  for select using (published = true);

drop policy if exists "admin all testimonials" on public.testimonials;
create policy "admin all testimonials" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

alter table if exists public.traffic_reports
  add column if not exists updated_at timestamptz default now();

create index if not exists portfolio_published_category_idx
  on public.portfolio_projects(published, category);

create index if not exists testimonials_published_idx
  on public.testimonials(published, featured);
