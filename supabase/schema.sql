-- Rincón Te Escucha · Oficina de la Juventud – Intendencia Departamental de Flores
-- Diseñado para convivir con el proyecto compartido JUVENTUD FLORES – GESTIÓN.
-- Las tablas de contenido usan prefijo rte_ porque el proyecto ya contiene public.resources.

create extension if not exists pgcrypto;

create table if not exists public.youth_proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  age_range text,
  location text,
  category text not null,
  proposal text not null,
  importance text,
  implementation_idea text,
  wants_to_participate text,
  contact_requested boolean not null default false,
  name text,
  email text,
  phone text,
  status text not null default 'new',
  admin_notes text,
  is_archived boolean not null default false,
  source text not null default 'web',
  constraint youth_proposals_age_range_check check (
    age_range is null or age_range in ('12 a 14','15 a 17','18 a 20','21 a 24','25 a 29','Prefiero no decirlo')
  ),
  constraint youth_proposals_location_check check (
    location is null or location in ('Trinidad','Ismael Cortinas','Andresito','La Casilla','Otra localidad','Prefiero no decirlo')
  ),
  constraint youth_proposals_category_check check (
    category in ('Educación','Trabajo','Emprendimientos','Deportes','Cultura','Música','Arte','Tecnología','Salud y bienestar','Medio ambiente','Espacios públicos','Recreación','Vivienda','Movilidad','Actividades juveniles','Otro')
  ),
  constraint youth_proposals_status_check check (status in ('new','reviewing','considered','implemented','archived')),
  constraint youth_proposals_participation_check check (
    wants_to_participate is null or wants_to_participate in ('Sí','Tal vez','Solo quería compartir la idea')
  ),
  constraint youth_proposals_proposal_length check (char_length(proposal) between 1 and 1500),
  constraint youth_proposals_importance_length check (importance is null or char_length(importance) <= 1200),
  constraint youth_proposals_implementation_length check (implementation_idea is null or char_length(implementation_idea) <= 1200),
  constraint youth_proposals_name_length check (name is null or char_length(name) <= 120),
  constraint youth_proposals_email_length check (email is null or char_length(email) <= 180),
  constraint youth_proposals_phone_length check (phone is null or char_length(phone) <= 60),
  constraint youth_proposals_admin_notes_length check (admin_notes is null or char_length(admin_notes) <= 3000),
  constraint youth_proposals_contact_privacy_check check (
    contact_requested = true or (name is null and email is null and phone is null)
  )
);

create index if not exists youth_proposals_created_at_idx on public.youth_proposals (created_at desc);
create index if not exists youth_proposals_category_idx on public.youth_proposals (category);
create index if not exists youth_proposals_status_idx on public.youth_proposals (status);
create index if not exists youth_proposals_location_idx on public.youth_proposals (location);

create table if not exists public.rte_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  summary text not null default '',
  content text not null default '',
  icon text,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rte_tips (
  id uuid primary key default gen_random_uuid(),
  text text not null unique,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rte_faq (
  id uuid primary key default gen_random_uuid(),
  question text not null unique,
  answer text not null,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.rte_site_settings (
  key text primary key,
  label text not null,
  value text not null default '',
  is_public boolean not null default true
);

create or replace function public.rte_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rte_resources_set_updated_at on public.rte_resources;
create trigger rte_resources_set_updated_at
before update on public.rte_resources
for each row execute function public.rte_set_updated_at();

-- Reutiliza Auth + profiles del sistema institucional existente.
create or replace function public.rte_is_staff()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role::text in ('admin', 'equipo')
  );
$$;

revoke all on function public.rte_is_staff() from public;
revoke execute on function public.rte_is_staff() from anon;
grant execute on function public.rte_is_staff() to authenticated;

alter table public.youth_proposals enable row level security;
alter table public.rte_resources enable row level security;
alter table public.rte_tips enable row level security;
alter table public.rte_faq enable row level security;
alter table public.rte_site_settings enable row level security;

-- Formulario público: puede insertar, nunca leer/modificar/borrar propuestas.
drop policy if exists "rte public can submit proposals" on public.youth_proposals;
create policy "rte public can submit proposals"
on public.youth_proposals
for insert
to anon, authenticated
with check (
  status = 'new'
  and admin_notes is null
  and is_archived = false
  and source = 'web'
);

-- Equipo autorizado: acceso de gestión.
drop policy if exists "rte staff can read proposals" on public.youth_proposals;
create policy "rte staff can read proposals"
on public.youth_proposals
for select
to authenticated
using (public.rte_is_staff());

drop policy if exists "rte staff can update proposals" on public.youth_proposals;
create policy "rte staff can update proposals"
on public.youth_proposals
for update
to authenticated
using (public.rte_is_staff())
with check (public.rte_is_staff());

-- Contenido público: solo registros publicados.
drop policy if exists "rte public reads published resources" on public.rte_resources;
create policy "rte public reads published resources"
on public.rte_resources for select to anon, authenticated
using (published = true);

drop policy if exists "rte public reads published tips" on public.rte_tips;
create policy "rte public reads published tips"
on public.rte_tips for select to anon, authenticated
using (published = true);

drop policy if exists "rte public reads published faq" on public.rte_faq;
create policy "rte public reads published faq"
on public.rte_faq for select to anon, authenticated
using (published = true);

drop policy if exists "rte public reads public settings" on public.rte_site_settings;
create policy "rte public reads public settings"
on public.rte_site_settings for select to anon, authenticated
using (is_public = true);

-- Equipo autorizado: puede administrar contenido y configuración.
drop policy if exists "rte staff manages resources" on public.rte_resources;
create policy "rte staff manages resources" on public.rte_resources
for all to authenticated using (public.rte_is_staff()) with check (public.rte_is_staff());

drop policy if exists "rte staff manages tips" on public.rte_tips;
create policy "rte staff manages tips" on public.rte_tips
for all to authenticated using (public.rte_is_staff()) with check (public.rte_is_staff());

drop policy if exists "rte staff manages faq" on public.rte_faq;
create policy "rte staff manages faq" on public.rte_faq
for all to authenticated using (public.rte_is_staff()) with check (public.rte_is_staff());

drop policy if exists "rte staff manages settings" on public.rte_site_settings;
create policy "rte staff manages settings" on public.rte_site_settings
for all to authenticated using (public.rte_is_staff()) with check (public.rte_is_staff());

-- Privilegios de tablas. RLS sigue siendo la autoridad final.
grant insert on public.youth_proposals to anon, authenticated;
grant select, update on public.youth_proposals to authenticated;
grant select on public.rte_resources, public.rte_tips, public.rte_faq, public.rte_site_settings to anon, authenticated;
grant insert, update, delete on public.rte_resources, public.rte_tips, public.rte_faq, public.rte_site_settings to authenticated;
