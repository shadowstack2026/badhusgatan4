-- ============================================================================
--  Badhuset – databas för event, anmälningar och adminpanelen
--
--  Så kör du den (en gång):
--   1. Öppna Supabase -> ditt projekt -> SQL Editor -> New query.
--   2. Klistra in hela filen och tryck Run.
--   3. Gå till Authentication -> Users -> Add user -> Create new user.
--      Skriv e-post + lösenord och kryssa i "Auto Confirm User".
--      Använd samma e-post som i raden "insert into admins" längst ner.
--   4. Gå in på /admin på sajten och logga in.
--
--  Säkerhet: bara e-postadresser i tabellen "admins" kan ändra event och se
--  anmälningar. Alla andra kan bara läsa publicerade event och skicka in en
--  anmälan via funktionen register_for_event.
-- ============================================================================

-- Vilka som är admin ----------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Event -------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  category    text not null default 'Socialt',
  date        date not null,
  start_time  text not null default '',
  end_time    text not null default '',
  location    text not null default 'Badhusgatan 4, Helsingborg',
  image       text not null default '',
  summary     text not null default '',
  description text not null default '',              -- stycken skiljs åt med en tom rad
  agenda      jsonb not null default '[]'::jsonb,    -- [{ "time": "18:00", "text": "..." }]
  for_whom    text not null default '',
  price       text not null default 'Gratis',
  host_name   text not null default '',
  host_role   text not null default '',
  spots_total integer not null default 0 check (spots_total >= 0),  -- 0 = obegränsat
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.events enable row level security;

drop policy if exists "events: läsa" on public.events;
create policy "events: läsa" on public.events
  for select using (published or public.is_admin());

drop policy if exists "events: admin skriver" on public.events;
create policy "events: admin skriver" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- Anmälningar ---------------------------------------------------------------------
create table if not exists public.registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  email      text not null,
  phone      text not null default '',
  message    text not null default '',
  kind       text not null default 'anmalan' check (kind in ('anmalan', 'vantelista')),
  status     text not null default 'ny' check (status in ('ny', 'bekraftad', 'avbokad')),
  created_at timestamptz not null default now()
);
create unique index if not exists registrations_unique_email
  on public.registrations (event_id, lower(email));
alter table public.registrations enable row level security;

-- Ingen insert-policy: besökare anmäler sig bara via register_for_event nedan.
drop policy if exists "registrations: admin" on public.registrations;
create policy "registrations: admin" on public.registrations
  for all using (public.is_admin()) with check (public.is_admin());

-- Antal upptagna platser per event (syns för alla, innehåller inga personuppgifter)
create or replace view public.event_counts as
  select event_id,
         count(*) filter (where kind = 'anmalan' and status <> 'avbokad')::int as taken
  from public.registrations
  group by event_id;
grant select on public.event_counts to anon, authenticated;

-- Anmäl dig: kollar platser och lägger dig på väntelista om det är fullt ------------
create or replace function public.register_for_event(
  p_event uuid,
  p_name text,
  p_email text,
  p_phone text default '',
  p_message text default ''
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ev public.events%rowtype;
  taken integer;
  k text;
begin
  select * into ev from public.events where id = p_event and published for update;
  if not found then raise exception 'event_not_found'; end if;
  if ev.date < current_date then raise exception 'event_past'; end if;
  if length(trim(p_name)) = 0 or p_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'invalid';
  end if;
  if exists (
    select 1 from public.registrations
    where event_id = p_event and lower(email) = lower(trim(p_email))
  ) then
    raise exception 'duplicate';
  end if;

  select count(*) into taken from public.registrations
    where event_id = p_event and kind = 'anmalan' and status <> 'avbokad';

  if ev.spots_total > 0 and taken >= ev.spots_total then
    k := 'vantelista';
  else
    k := 'anmalan';
  end if;

  insert into public.registrations (event_id, name, email, phone, message, kind)
  values (p_event, trim(p_name), trim(p_email), trim(coalesce(p_phone, '')), trim(coalesce(p_message, '')), k);

  return k;
end;
$$;
grant execute on function public.register_for_event(uuid, text, text, text, text) to anon, authenticated;

-- Bilder till event ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "event-images: alla läser" on storage.objects;
create policy "event-images: alla läser" on storage.objects
  for select using (bucket_id = 'event-images');

drop policy if exists "event-images: admin skriver" on storage.objects;
create policy "event-images: admin skriver" on storage.objects
  for all using (bucket_id = 'event-images' and public.is_admin())
  with check (bucket_id = 'event-images' and public.is_admin());

-- När bekräftelsemejlet skickades (lades till senare – körs säkert om och om igen)
alter table public.registrations add column if not exists confirmed_at timestamptz;

-- Din admin (byt e-post om du vill använda en annan) --------------------------------
insert into public.admins (email) values ('shadowstack2026@gmail.com')
on conflict do nothing;

-- ============================================================================
--  CRM: platstyper, intresseanmälningar, medlemmar och historik
--  (körs säkert om och om igen)
-- ============================================================================

-- Platstyper med antal platser. Du ändrar "capacity" i adminpanelen.
create table if not exists public.space_types (
  id         text primary key,
  title      text not null,
  capacity   integer not null default 0 check (capacity >= 0),
  sort       integer not null default 0
);
alter table public.space_types enable row level security;

drop policy if exists "space_types: läsa" on public.space_types;
create policy "space_types: läsa" on public.space_types for select using (true);
drop policy if exists "space_types: admin skriver" on public.space_types;
create policy "space_types: admin skriver" on public.space_types
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.space_types (id, title, capacity, sort) values
  ('oppet-bord', 'Öppet bord', 10, 1),
  ('fast-plats', 'Fast plats', 6, 2),
  ('eget-rum',   'Eget rum',    1, 3)
on conflict (id) do nothing;

-- Intresseanmälningar (och "prova en dag" / "boka besök") ----------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  space_type  text references public.space_types(id) on delete set null,
  kind        text not null default 'intresse' check (kind in ('intresse', 'prova-dag', 'besok')),
  name        text not null,
  email       text not null,
  phone       text not null default '',
  company     text not null default '',
  work        text not null default '',
  start_date  text not null default '',
  message     text not null default '',
  status      text not null default 'ny' check (status in ('ny', 'kontaktad', 'godkand', 'ko', 'avbojd')),
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  approved_at timestamptz
);
create index if not exists leads_status_idx on public.leads (status, created_at);
alter table public.leads enable row level security;
drop policy if exists "leads: admin" on public.leads;
create policy "leads: admin" on public.leads
  for all using (public.is_admin()) with check (public.is_admin());

-- Medlemmar: den som sitter på en plats just nu har ended_at = null ------------------
create table if not exists public.members (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid references public.leads(id) on delete set null,
  space_type text not null references public.space_types(id),
  name       text not null,
  email      text not null default '',
  phone      text not null default '',
  company    text not null default '',
  notes      text not null default '',
  since      date not null default current_date,
  ended_at   date
);
create index if not exists members_active_idx on public.members (space_type) where ended_at is null;
alter table public.members enable row level security;
drop policy if exists "members: admin" on public.members;
create policy "members: admin" on public.members
  for all using (public.is_admin()) with check (public.is_admin());

-- Enkel historik ("Anna godkändes", "Erik sa upp sig") --------------------------------
create table if not exists public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  created_at timestamptz not null default now()
);
alter table public.activity_log enable row level security;
drop policy if exists "activity_log: admin" on public.activity_log;
create policy "activity_log: admin" on public.activity_log
  for all using (public.is_admin()) with check (public.is_admin());

-- Antal upptagna / köade per typ (utan personuppgifter, syns för sajten) ---------------
create or replace view public.space_counts as
  select s.id,
         s.capacity,
         (select count(*) from public.members m where m.space_type = s.id and m.ended_at is null)::int as taken,
         (select count(*) from public.leads l where l.space_type = s.id and l.status = 'ko')::int as queued
  from public.space_types s;
grant select on public.space_counts to anon, authenticated;

-- Skicka intresseanmälan: hamnar i kö om platstypen är full -----------------------------
create or replace function public.submit_lead(
  p_space text,
  p_kind text,
  p_name text,
  p_email text,
  p_phone text default '',
  p_company text default '',
  p_work text default '',
  p_start text default '',
  p_message text default ''
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  st public.space_types%rowtype;
  taken integer;
  s text := 'ny';
  sp text := nullif(p_space, '');
begin
  if length(trim(p_name)) = 0 or p_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'invalid';
  end if;
  if p_kind not in ('intresse', 'prova-dag', 'besok') then raise exception 'invalid'; end if;

  if sp is not null then
    select * into st from public.space_types where id = sp for update;
    if not found then raise exception 'invalid'; end if;
    select count(*) into taken from public.members where space_type = sp and ended_at is null;
    if taken >= st.capacity then s := 'ko'; end if;
  end if;

  -- Samma person som redan väntar på samma sak läggs inte till två gånger
  if exists (
    select 1 from public.leads
    where lower(email) = lower(trim(p_email)) and space_type is not distinct from sp
      and kind = p_kind and status in ('ny', 'kontaktad', 'ko')
  ) then
    return 'duplicate';
  end if;

  insert into public.leads (space_type, kind, name, email, phone, company, work, start_date, message, status)
  values (sp, p_kind, trim(p_name), trim(p_email), trim(coalesce(p_phone, '')), trim(coalesce(p_company, '')),
          trim(coalesce(p_work, '')), trim(coalesce(p_start, '')), trim(coalesce(p_message, '')), s);
  return s;
end;
$$;
grant execute on function public.submit_lead(text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- ============================================================================
--  LIVE: adminpanelen uppdateras direkt när något ändras (Supabase Realtime)
--  (körs säkert om och om igen)
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array['leads', 'members', 'space_types', 'activity_log', 'events', 'registrations']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
