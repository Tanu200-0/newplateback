alter table profiles enable row level security;
alter table listings enable row level security;
alter table stats    enable row level security;

create policy "profiles readable"  on profiles for select to authenticated using (true);
create policy "own profile insert" on profiles for insert to authenticated
  with check (id = auth.uid() and verified = false);
create policy "own profile update" on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "listings readable" on listings for select to authenticated using (true);
create policy "donor creates" on listings for insert to authenticated with check (donor_id = auth.uid());
create policy "donor cancels own posted" on listings for delete to authenticated
  using (donor_id = auth.uid() and status = 'posted');

create policy "stats readable" on stats for select to authenticated using (true);

create policy "auth upload photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'food-photos');

-- Users cannot promote themselves or verify themselves (SQL Editor edits still work)
create or replace function public.protect_profile() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and (new.role <> old.role or new.verified <> old.verified) then
    raise exception 'role and verified cannot be changed';
  end if;
  return new;
end $$;
create trigger trg_protect_profile before update on profiles
  for each row execute function protect_profile();
