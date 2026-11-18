-- First schema migration (#30, ADR-022, docs/datos/esquema.md).

-- Shared: keeps updated_at current on every edited row. Synced tables use it
-- as the download cursor (docs/arquitectura/sincronizacion.md).
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- One profile per Auth account. Goals stay empty until the welcome (RF-08).
create table public.profile (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (char_length(username) between 3 and 30),
  age_confirmed_at timestamptz not null,
  privacy_accepted_at timestamptz not null,
  timezone text,
  minutes_per_day smallint check (minutes_per_day > 0),
  new_per_day smallint check (new_per_day > 0),
  rest_days_per_week smallint not null default 2 check (rest_days_per_week between 0 and 6),
  study_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_updated_at timestamptz not null default now()
);

create unique index profile_username_key on public.profile (lower(username));

create trigger set_updated_at
before update on public.profile
for each row execute function public.set_updated_at();
