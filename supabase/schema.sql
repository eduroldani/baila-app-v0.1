create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.class_enrollments (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles (id) on delete cascade,
  airtable_class_id text not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create unique index if not exists class_enrollments_student_class_unique
on public.class_enrollments (student_id, airtable_class_id);

alter table public.class_enrollments enable row level security;

create policy "Students can view own enrollments"
on public.class_enrollments
for select
to authenticated
using (auth.uid() = student_id);

create policy "Students can insert own enrollments"
on public.class_enrollments
for insert
to authenticated
with check (auth.uid() = student_id);

create policy "Students can update own enrollments"
on public.class_enrollments
for update
to authenticated
using (auth.uid() = student_id);
