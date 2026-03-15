create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

create table if not exists public.class_recoveries (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles (id) on delete cascade,
  airtable_class_id text not null,
  recovery_date date not null,
  attendee_type text not null default 'self' check (attendee_type in ('self', 'dependent')),
  attendee_name text not null,
  attendee_age integer,
  attendee_dependent_id bigint,
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now()
);

create unique index if not exists class_recoveries_student_date_class_unique
on public.class_recoveries (student_id, recovery_date, airtable_class_id, attendee_type, attendee_name);

create index if not exists class_recoveries_recovery_date_idx
on public.class_recoveries (recovery_date);

create index if not exists class_recoveries_student_id_idx
on public.class_recoveries (student_id);

alter table public.class_recoveries enable row level security;

alter table public.profiles enable row level security;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Students can view own recoveries" on public.class_recoveries;
create policy "Students can view own recoveries"
on public.class_recoveries
for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Students can insert own recoveries" on public.class_recoveries;
create policy "Students can insert own recoveries"
on public.class_recoveries
for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "Students can update own recoveries" on public.class_recoveries;
create policy "Students can update own recoveries"
on public.class_recoveries
for update
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Students can delete own recoveries" on public.class_recoveries;
create policy "Students can delete own recoveries"
on public.class_recoveries
for delete
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Admins can manage all recoveries" on public.class_recoveries;
create policy "Admins can manage all recoveries"
on public.class_recoveries
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create or replace view public.admin_class_recoveries as
select
  cr.id,
  cr.recovery_date,
  cr.status,
  cr.created_at,
  cr.airtable_class_id,
  cr.attendee_type,
  cr.attendee_name,
  cr.attendee_age,
  cr.attendee_dependent_id,
  p.id as student_id,
  p.full_name,
  p.email,
  p.role
from public.class_recoveries cr
join public.profiles p on p.id = cr.student_id
order by cr.recovery_date asc, cr.created_at desc;

create table if not exists public.dependents (
  id bigint generated always as identity primary key,
  guardian_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  age integer,
  created_at timestamptz not null default now()
);

create index if not exists dependents_guardian_id_idx
on public.dependents (guardian_id);

alter table public.dependents enable row level security;

drop policy if exists "Users can view own dependents" on public.dependents;
create policy "Users can view own dependents"
on public.dependents
for select
to authenticated
using (auth.uid() = guardian_id);

drop policy if exists "Users can insert own dependents" on public.dependents;
create policy "Users can insert own dependents"
on public.dependents
for insert
to authenticated
with check (auth.uid() = guardian_id);

drop policy if exists "Users can update own dependents" on public.dependents;
create policy "Users can update own dependents"
on public.dependents
for update
to authenticated
using (auth.uid() = guardian_id);

drop policy if exists "Users can delete own dependents" on public.dependents;
create policy "Users can delete own dependents"
on public.dependents
for delete
to authenticated
using (auth.uid() = guardian_id);
