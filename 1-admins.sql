-- STEP 1 (and any time you change admins): run this in Supabase -> SQL Editor.
-- Put one admin email per line, lowercase, in quotes, separated by commas.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (array[
    'padelshuffle@gmail.com',
    'nassermh.alharthy@gmail.com'
  ]);
$$;
