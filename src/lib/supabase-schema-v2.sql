-- TradeSim v2 — run this in Supabase SQL Editor (after the original schema)

-- User progress: XP, level, streak
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  xp integer not null default 0,
  level integer not null default 1,
  streak_count integer not null default 0,
  last_active_date date,
  total_lessons_completed integer not null default 0,
  total_trades integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_progress enable row level security;
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);

-- Lesson completions
create table if not exists public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  quiz_score integer,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
alter table public.lesson_completions enable row level security;
create policy "Users can manage own lesson completions" on public.lesson_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User missions progress
create table if not exists public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  mission_id text not null,
  progress integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  unique(user_id, mission_id)
);
alter table public.user_missions enable row level security;
create policy "Users can manage own missions" on public.user_missions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily challenge logs
create table if not exists public.daily_challenge_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id text not null,
  completed_date date not null default current_date,
  xp_earned integer not null default 0,
  unique(user_id, challenge_id, completed_date)
);
alter table public.daily_challenge_logs enable row level security;
create policy "Users can manage own challenges" on public.daily_challenge_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create user_progress on signup (update existing trigger)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into public.portfolios (user_id, cash_balance)
  values (new.id, 100000.00);

  insert into public.user_progress (user_id, xp, level, streak_count)
  values (new.id, 0, 1, 0);

  return new;
end;
$$;
