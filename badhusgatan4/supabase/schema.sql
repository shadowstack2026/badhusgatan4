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

-- Din admin (byt e-post om du vill använda en annan) --------------------------------
insert into public.admins (email) values ('shadowstack2026@gmail.com')
on conflict do nothing;
