create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('donor','ngo')),
  name text, phone text, address text,
  lat float8, lng float8,
  capacity int default 0,
  accepts text[] default '{}',
  verified boolean default false
);
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references profiles(id),
  type text not null check (type in ('cooked','packaged','bakery','fresh')),
  quantity int not null check (quantity > 0),
  kg numeric,
  cooked_at timestamptz not null default now(),
  safe_until timestamptz not null,
  address text, lat float8 not null, lng float8 not null,
  is_event boolean default false,
  pickup_at timestamptz, photo_url text, ai_result jsonb,
  status text not null default 'posted'
    check (status in ('posted','accepted','on_the_way','picked_up','expired','unmatched')),
  rank uuid[] default '{}',
  assigned_ngo uuid references profiles(id),
  offered_at timestamptz default now(),
  escalations int default 0,
  created_at timestamptz default now()
);
create table if not exists stats (
  id int primary key default 1 check (id = 1),
  meals int default 0, kg numeric default 0, co2 numeric default 0
);
insert into stats default values on conflict do nothing;
alter publication supabase_realtime add table listings, stats;
