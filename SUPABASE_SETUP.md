# Supabase Setup — SAT Planner

How to apply the SAT-planner database migrations, configure auth, and verify
Row Level Security.

> **WARNING — PLACEHOLDER CONTENT**
> The seeded prep books and every chapter title are **placeholders**
> (`SAT Math Book (PLACEHOLDER)`, `Math Chapter 1 (PLACEHOLDER — …)`, and
> `https://example.com/...` affiliate links). You **must** replace the book
> titles, descriptions, affiliate URLs, chapter counts, and chapter titles in
> `supabase/migrations/0002_sat_planner_seed.sql` (then re-run it) before
> launch. The migration upserts by slug / chapter number, so re-running it
> updates rows in place.

## 1. Migration files

Migrations live in `supabase/migrations/` and are plain SQL, numbered
sequentially. Both are **idempotent** — safe to re-run.

| File | Contents |
| --- | --- |
| `0001_sat_planner_core.sql` | All 13 planner tables, `updated_at` triggers, auto-profile-creation trigger on `auth.users`, indexes, check constraints, RLS policies, and the `has_sat_planner_access()` helper function. |
| `0002_sat_planner_seed.sql` | Seed data: the `sat-planner` product ($30), 3 placeholder books, and placeholder chapters (Math 20, Grammar 15, Reading 12). |

The pre-existing `supabase/schema.sql` (workshop registrations + cohort
applications) is unchanged and independent.

## 2. Applying the migrations

### Option A — SQL Editor (simplest; matches how schema.sql was applied)

1. Open the Supabase dashboard -> your project -> **SQL Editor**.
2. Paste the full contents of `supabase/migrations/0001_sat_planner_core.sql`
   and run it.
3. Paste and run `supabase/migrations/0002_sat_planner_seed.sql`.
4. Re-run either file any time it changes.

### Option B — Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push        # applies supabase/migrations/*.sql in order
```

Note: this project was not previously initialized with the Supabase CLI. If
`db push` complains about migration naming, the timestamped convention is
`YYYYMMDDHHMMSS_name.sql`; rename the files accordingly (keep their order) or
use Option A.

## 3. Auth configuration (Supabase dashboard)

1. **Authentication -> Providers -> Email**: ensure Email/Password is enabled.
   Leave "Confirm email" ON (recommended).
2. **Authentication -> URL Configuration**:
   - Site URL: `https://emmettfunston.com` (production) or
     `http://localhost:3000` (development).
   - Redirect URLs: add both
     - `http://localhost:3000/auth/confirm`
     - `https://emmettfunston.com/auth/confirm`
3. Optional but recommended: customize the email templates
   (Authentication -> Emails). If you edit them, point links at
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}` —
   the `/auth/confirm` route also handles the default `?code=` links.

## 4. Environment variables

Set in `.env` (see `.env.example`):

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Bare project origin, e.g. `https://<ref>.supabase.co`. (The code tolerates a trailing `/rest/v1/` path and normalizes it, but store the bare origin.) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **New — required for auth.** Dashboard -> Project Settings -> API -> `anon` `public` key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Already set. Server-only; bypasses RLS. |

Restart the dev server after changing `.env`.

## 5. Manual RLS verification checklist

Run these checks after applying migrations. Use two test accounts
(Student A, Student B) created through `/signup`.

Dashboard spot checks (Table Editor -> table -> "RLS enabled" badge):

- [ ] RLS is enabled on ALL of: `profiles`, `products`, `purchases`, `books`,
      `book_chapters`, `student_settings`, `weekly_availability`,
      `student_books`, `study_plans`, `assignments`, `practice_tests`,
      `mistakes`, `webhook_events`.

SQL Editor checks (run as shown; the editor runs as `postgres`, so use
`set role`/`request.jwt.claims` impersonation as below):

```sql
-- Impersonate Student A (replace the UUID with their auth.users id):
set role authenticated;
select set_config('request.jwt.claims',
  json_build_object('sub', '<STUDENT_A_UUID>', 'role', 'authenticated')::text,
  true);
```

- [ ] `select * from profiles;` returns ONLY Student A's row.
- [ ] `update profiles set display_name = 'hacked' where id = '<STUDENT_B_UUID>';`
      updates **0 rows**.
- [ ] `select * from purchases;` returns only Student A's purchases (none yet).
- [ ] `insert into purchases (user_id, product_id, payment_status, access_granted)
      values ('<STUDENT_A_UUID>', (select id from products limit 1), 'paid', true);`
      **fails** (no insert policy) — students cannot forge purchases.
- [ ] `update purchases set access_granted = true;` updates **0 rows**.
- [ ] `select * from products;` / `books` / `book_chapters` succeed (read-only
      catalogs) but `update products set amount_cents = 0;` updates **0 rows**.
- [ ] `insert into student_settings (user_id, ...)` with Student B's user_id
      **fails** the `with check` policy.
- [ ] `select * from webhook_events;` returns **0 rows** (no select policy).
- [ ] `reset role;` afterwards.

App-level checks:

- [ ] Signed out, visiting `/planner` redirects to `/signin`.
- [ ] Signed in without a purchase, `/planner` redirects to `/sat-planner`.
- [ ] After manually inserting a paid purchase for your own test user **via the
      service role** (SQL Editor as postgres):

```sql
insert into purchases (user_id, product_id, payment_status, access_granted, purchased_at)
select '<YOUR_TEST_USER_UUID>', id, 'paid', true, now()
from products where slug = 'sat-planner';
```

  `/planner` then loads and redirects to `/planner/onboarding` (onboarding is
  not yet completed). Setting `profiles.onboarding_completed = true` routes
  `/planner` to the dashboard instead.

## 6. Regenerating TypeScript types

`lib/supabase/database.types.ts` is hand-maintained to match the migrations.
If you authenticate the CLI you can regenerate it instead:

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public \
  > lib/supabase/database.types.ts
```
