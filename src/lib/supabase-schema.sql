-- Run this in your Supabase SQL editor

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Portfolios
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  cash_balance numeric(18,4) not null default 100000.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolios enable row level security;
create policy "Users can view own portfolio" on public.portfolios for select using (auth.uid() = user_id);
create policy "Users can update own portfolio" on public.portfolios for update using (auth.uid() = user_id);

-- Positions
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade not null,
  symbol text not null,
  shares numeric(18,8) not null,
  avg_cost numeric(18,4) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(portfolio_id, symbol)
);
alter table public.positions enable row level security;
create policy "Users can manage own positions" on public.positions
  using (exists (select 1 from public.portfolios p where p.id = portfolio_id and p.user_id = auth.uid()));

-- Trades
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade not null,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  shares numeric(18,8) not null,
  price numeric(18,4) not null,
  total numeric(18,4) not null,
  executed_at timestamptz not null default now()
);
alter table public.trades enable row level security;
create policy "Users can view own trades" on public.trades for select
  using (exists (select 1 from public.portfolios p where p.id = portfolio_id and p.user_id = auth.uid()));
create policy "Users can insert own trades" on public.trades for insert
  with check (exists (select 1 from public.portfolios p where p.id = portfolio_id and p.user_id = auth.uid()));

-- Leaderboard view (public)
create or replace view public.leaderboard as
select
  pr.id as user_id,
  pr.display_name,
  pr.username,
  pr.avatar_url,
  po.cash_balance,
  coalesce((
    select sum(pos.shares * pos.avg_cost) from public.positions pos where pos.portfolio_id = po.id
  ), 0) as positions_value,
  po.cash_balance + coalesce((
    select sum(pos.shares * pos.avg_cost) from public.positions pos where pos.portfolio_id = po.id
  ), 0) as portfolio_value,
  round(
    ((po.cash_balance + coalesce((
      select sum(pos.shares * pos.avg_cost) from public.positions pos where pos.portfolio_id = po.id
    ), 0) - 100000) / 100000) * 100, 2
  ) as total_return_pct,
  rank() over (order by (po.cash_balance + coalesce((
    select sum(pos.shares * pos.avg_cost) from public.positions pos where pos.portfolio_id = po.id
  ), 0)) desc) as rank
from public.profiles pr
join public.portfolios po on po.user_id = pr.id;

-- Auto-create profile + portfolio on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into public.portfolios (user_id, cash_balance)
  values (new.id, 100000.00);

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
