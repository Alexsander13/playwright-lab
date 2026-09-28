create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  github_username text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_id text not null,
  task_id text not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  constraint user_progress_user_module_task_key unique (user_id, module_id, task_id),
  constraint user_progress_completion_timestamp_check
    check (is_completed = (completed_at is not null))
);

create index user_progress_user_module_idx
  on public.user_progress (user_id, module_id);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read their own progress"
  on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own progress"
  on public.user_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.user_progress to authenticated;