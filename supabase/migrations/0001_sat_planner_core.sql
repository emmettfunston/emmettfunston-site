-- =============================================================================
-- 0001_sat_planner_core.sql — SAT Planner core schema
-- =============================================================================
-- Creates every table, trigger, index, constraint, and Row Level Security
-- policy for the SAT Study Planner product.
--
-- Conventions:
--   * All user-owned tables carry `user_id uuid references public.profiles(id)`
--     and RLS policies scoped to `auth.uid() = user_id`. No `using (true)`
--     policies exist on user-owned data.
--   * `purchases` and `webhook_events` have NO write policies: only the
--     server-side service role (which bypasses RLS) may write them. Students
--     therefore cannot grant themselves access or forge completed purchases.
--   * `products`, `books`, and `book_chapters` are read-only catalogs for
--     users; editing happens via the service role only.
--   * "Overdue" is intentionally NOT a stored column. It is derived in
--     application code as: completed_at IS NULL AND assignment_date < the
--     student's current local date. No cron required.
--   * Weekday numbering follows JavaScript Date#getDay(): 0 = Sunday ...
--     6 = Saturday. Saturday (6) is permanently reserved for practice tests,
--     enforced by a CHECK constraint on weekly_availability.
--
-- Idempotent: safe to re-run.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared trigger function: keep updated_at fresh on every UPDATE.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- =============================================================================
-- 1. profiles — one row per auth user, created automatically by trigger.
-- =============================================================================
create table if not exists public.profiles (
    id                    uuid        primary key references auth.users (id) on delete cascade,
    email                 text        not null,
    display_name          text,
    timezone              text        not null default 'America/Los_Angeles',
    onboarding_completed  boolean     not null default false,
    created_at            timestamptz not null default now(),
    updated_at            timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();

-- Automatic profile creation when a new auth user is inserted.
-- SECURITY DEFINER because auth.users triggers run as supabase_auth_admin,
-- which has no direct INSERT grant on public tables.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email, display_name)
    values (
        new.id,
        coalesce(new.email, ''),
        nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
    for select to authenticated
    using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
    for update to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- No insert/delete policies: rows are created by the auth trigger and removed
-- by the ON DELETE CASCADE from auth.users.

-- =============================================================================
-- 2. products — purchasable products (catalog; service-role writes only).
-- =============================================================================
create table if not exists public.products (
    id                 uuid        primary key default gen_random_uuid(),
    slug               text        not null unique,
    name               text        not null,
    description        text        not null default '',
    stripe_product_id  text,
    stripe_price_id    text,
    amount_cents       integer     not null check (amount_cents >= 0),
    currency           text        not null default 'usd',
    active             boolean     not null default true,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();

alter table public.products enable row level security;

-- Anyone (including logged-out visitors on the sales page) may read active
-- products. This is public marketing data; writes remain service-role only.
drop policy if exists "products_select_active" on public.products;
create policy "products_select_active" on public.products
    for select to anon, authenticated
    using (active = true);

-- =============================================================================
-- 3. purchases — entitlements. Written EXCLUSIVELY by the service role
--    (Stripe webhook fulfillment). Students may only read their own rows.
-- =============================================================================
create table if not exists public.purchases (
    id                          uuid        primary key default gen_random_uuid(),
    user_id                     uuid        not null references public.profiles (id) on delete cascade,
    product_id                  uuid        not null references public.products (id),
    stripe_checkout_session_id  text        unique,
    stripe_customer_id          text,
    stripe_payment_intent_id    text,
    customer_email              text,
    amount_total                integer,
    currency                    text,
    payment_status              text        not null default 'pending',
    access_granted              boolean     not null default false,
    purchased_at                timestamptz,
    created_at                  timestamptz not null default now(),
    updated_at                  timestamptz not null default now()
);

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at
    before update on public.purchases
    for each row execute function public.set_updated_at();

-- One active entitlement per (user, product). Multiple failed/pending
-- checkout attempts may exist, but only one row can ever grant access.
create unique index if not exists purchases_one_entitlement_per_user_product
    on public.purchases (user_id, product_id)
    where access_granted = true;

create index if not exists purchases_user_id_idx on public.purchases (user_id);

alter table public.purchases enable row level security;

drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
    for select to authenticated
    using (auth.uid() = user_id);

-- Deliberately NO insert/update/delete policies: students cannot create fake
-- purchases or set access_granted. Fulfillment happens through the service
-- role in the Stripe webhook handler.

-- =============================================================================
-- 4. books — master prep-book catalog (service-role writes only).
-- =============================================================================
create table if not exists public.books (
    id             uuid        primary key default gen_random_uuid(),
    slug           text        not null unique,
    title          text        not null,
    category       text        not null check (category in ('math', 'grammar', 'reading')),
    description    text        not null default '',
    affiliate_url  text,
    active         boolean     not null default true,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
    before update on public.books
    for each row execute function public.set_updated_at();

alter table public.books enable row level security;

drop policy if exists "books_select_active" on public.books;
create policy "books_select_active" on public.books
    for select to anon, authenticated
    using (active = true);

-- =============================================================================
-- 5. book_chapters — ordered chapters per book (service-role writes only).
-- =============================================================================
create table if not exists public.book_chapters (
    id                 uuid        primary key default gen_random_uuid(),
    book_id            uuid        not null references public.books (id) on delete cascade,
    chapter_number     integer     not null check (chapter_number >= 1),
    title              text        not null,
    estimated_minutes  integer     not null default 60 check (estimated_minutes > 0),
    active             boolean     not null default true,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    unique (book_id, chapter_number)
);

drop trigger if exists book_chapters_set_updated_at on public.book_chapters;
create trigger book_chapters_set_updated_at
    before update on public.book_chapters
    for each row execute function public.set_updated_at();

create index if not exists book_chapters_book_id_idx
    on public.book_chapters (book_id, chapter_number);

alter table public.book_chapters enable row level security;

drop policy if exists "book_chapters_select_active" on public.book_chapters;
create policy "book_chapters_select_active" on public.book_chapters
    for select to anon, authenticated
    using (active = true);

-- =============================================================================
-- 6. student_settings — onboarding scores/dates (one row per user).
-- =============================================================================
create table if not exists public.student_settings (
    id                  uuid        primary key default gen_random_uuid(),
    user_id             uuid        not null unique references public.profiles (id) on delete cascade,
    current_math_score  integer     not null check (current_math_score between 200 and 800 and current_math_score % 10 = 0),
    current_rw_score    integer     not null check (current_rw_score between 200 and 800 and current_rw_score % 10 = 0),
    target_total_score  integer     not null check (target_total_score between 400 and 1600 and target_total_score % 10 = 0),
    test_date           date        not null,
    plan_start_date     date        not null,
    timezone            text        not null default 'America/Los_Angeles',
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    check (plan_start_date <= test_date)
);

drop trigger if exists student_settings_set_updated_at on public.student_settings;
create trigger student_settings_set_updated_at
    before update on public.student_settings
    for each row execute function public.set_updated_at();

alter table public.student_settings enable row level security;

drop policy if exists "student_settings_select_own" on public.student_settings;
create policy "student_settings_select_own" on public.student_settings
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "student_settings_insert_own" on public.student_settings;
create policy "student_settings_insert_own" on public.student_settings
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "student_settings_update_own" on public.student_settings;
create policy "student_settings_update_own" on public.student_settings
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "student_settings_delete_own" on public.student_settings;
create policy "student_settings_delete_own" on public.student_settings
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 7. weekly_availability — per-weekday study hours.
--    Weekday numbering: 0 = Sunday ... 6 = Saturday (JS Date#getDay()).
--    Saturday is Practice Test Day: never available for chapter study.
-- =============================================================================
create table if not exists public.weekly_availability (
    id           uuid        primary key default gen_random_uuid(),
    user_id      uuid        not null references public.profiles (id) on delete cascade,
    weekday      integer     not null check (weekday between 0 and 6),
    available    boolean     not null default false,
    study_hours  integer     not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    unique (user_id, weekday),
    -- Available days carry 1-6 chapter-hours; unavailable days carry exactly 0.
    check (
        (available = true  and study_hours between 1 and 6)
        or
        (available = false and study_hours = 0)
    ),
    -- Saturday (6) is reserved for the weekly practice test: it must be stored
    -- as unavailable-for-chapters with zero chapter hours. Planner logic
    -- schedules the practice test there.
    check (weekday <> 6 or (available = false and study_hours = 0))
);

drop trigger if exists weekly_availability_set_updated_at on public.weekly_availability;
create trigger weekly_availability_set_updated_at
    before update on public.weekly_availability
    for each row execute function public.set_updated_at();

create index if not exists weekly_availability_user_id_idx
    on public.weekly_availability (user_id);

alter table public.weekly_availability enable row level security;

drop policy if exists "weekly_availability_select_own" on public.weekly_availability;
create policy "weekly_availability_select_own" on public.weekly_availability
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "weekly_availability_insert_own" on public.weekly_availability;
create policy "weekly_availability_insert_own" on public.weekly_availability
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "weekly_availability_update_own" on public.weekly_availability;
create policy "weekly_availability_update_own" on public.weekly_availability
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "weekly_availability_delete_own" on public.weekly_availability;
create policy "weekly_availability_delete_own" on public.weekly_availability
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 8. student_books — which catalog books the student includes in their plan.
-- =============================================================================
create table if not exists public.student_books (
    id                     uuid        primary key default gen_random_uuid(),
    user_id                uuid        not null references public.profiles (id) on delete cascade,
    book_id                uuid        not null references public.books (id),
    recommendation_level   text        not null check (recommendation_level in ('highly_recommended', 'recommended', 'optional')),
    recommendation_reason  text        not null default '',
    included_in_plan       boolean     not null default true,
    created_at             timestamptz not null default now(),
    updated_at             timestamptz not null default now(),
    unique (user_id, book_id)
);

drop trigger if exists student_books_set_updated_at on public.student_books;
create trigger student_books_set_updated_at
    before update on public.student_books
    for each row execute function public.set_updated_at();

create index if not exists student_books_user_id_idx
    on public.student_books (user_id);

alter table public.student_books enable row level security;

drop policy if exists "student_books_select_own" on public.student_books;
create policy "student_books_select_own" on public.student_books
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "student_books_insert_own" on public.student_books;
create policy "student_books_insert_own" on public.student_books
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "student_books_update_own" on public.student_books;
create policy "student_books_update_own" on public.student_books
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "student_books_delete_own" on public.student_books;
create policy "student_books_delete_own" on public.student_books
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 9. study_plans — a generated plan. At most one ACTIVE plan per user.
-- =============================================================================
create table if not exists public.study_plans (
    id                      uuid        primary key default gen_random_uuid(),
    user_id                 uuid        not null references public.profiles (id) on delete cascade,
    status                  text        not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
    starts_on               date        not null,
    test_date               date        not null,
    generated_at            timestamptz not null default now(),
    activated_at            timestamptz,
    generation_version      integer     not null default 1,
    configuration_snapshot  jsonb       not null default '{}'::jsonb,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now(),
    check (starts_on <= test_date)
);

drop trigger if exists study_plans_set_updated_at on public.study_plans;
create trigger study_plans_set_updated_at
    before update on public.study_plans
    for each row execute function public.set_updated_at();

create unique index if not exists study_plans_one_active_per_user
    on public.study_plans (user_id)
    where status = 'active';

create index if not exists study_plans_user_id_idx
    on public.study_plans (user_id);

alter table public.study_plans enable row level security;

drop policy if exists "study_plans_select_own" on public.study_plans;
create policy "study_plans_select_own" on public.study_plans
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "study_plans_insert_own" on public.study_plans;
create policy "study_plans_insert_own" on public.study_plans
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "study_plans_update_own" on public.study_plans;
create policy "study_plans_update_own" on public.study_plans
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_plans_delete_own" on public.study_plans;
create policy "study_plans_delete_own" on public.study_plans
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 10. assignments — persisted daily work items for an activated plan.
--     Overdue is DERIVED (completed_at is null AND assignment_date < local
--     today), never stored.
-- =============================================================================
create table if not exists public.assignments (
    id                 uuid        primary key default gen_random_uuid(),
    study_plan_id      uuid        not null references public.study_plans (id) on delete cascade,
    user_id            uuid        not null references public.profiles (id) on delete cascade,
    assignment_date    date        not null,
    assignment_type    text        not null check (assignment_type in ('chapter', 'practice_test', 'review', 'mistake_review')),
    book_id            uuid        references public.books (id),
    chapter_id         uuid        references public.book_chapters (id),
    sequence_on_day    integer     not null default 1 check (sequence_on_day >= 1),
    title              text        not null,
    instructions       text        not null default '',
    estimated_minutes  integer     not null default 60 check (estimated_minutes > 0),
    completed_at       timestamptz,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    -- A chapter assignment must reference a chapter; other types must not.
    check (
        (assignment_type = 'chapter' and chapter_id is not null and book_id is not null)
        or
        (assignment_type <> 'chapter' and chapter_id is null)
    ),
    unique (study_plan_id, assignment_date, sequence_on_day)
);

drop trigger if exists assignments_set_updated_at on public.assignments;
create trigger assignments_set_updated_at
    before update on public.assignments
    for each row execute function public.set_updated_at();

-- A chapter may be scheduled at most once within a single plan.
create unique index if not exists assignments_unique_chapter_per_plan
    on public.assignments (study_plan_id, chapter_id)
    where chapter_id is not null;

create index if not exists assignments_user_date_idx
    on public.assignments (user_id, assignment_date);

create index if not exists assignments_plan_date_idx
    on public.assignments (study_plan_id, assignment_date, sequence_on_day);

-- Fast catch-up queries: incomplete assignments by date.
create index if not exists assignments_incomplete_idx
    on public.assignments (user_id, assignment_date)
    where completed_at is null;

alter table public.assignments enable row level security;

drop policy if exists "assignments_select_own" on public.assignments;
create policy "assignments_select_own" on public.assignments
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "assignments_insert_own" on public.assignments;
create policy "assignments_insert_own" on public.assignments
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "assignments_update_own" on public.assignments;
create policy "assignments_update_own" on public.assignments
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "assignments_delete_own" on public.assignments;
create policy "assignments_delete_own" on public.assignments
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 11. practice_tests — recorded practice-exam results.
-- =============================================================================
create table if not exists public.practice_tests (
    id                 uuid        primary key default gen_random_uuid(),
    user_id            uuid        not null references public.profiles (id) on delete cascade,
    assignment_id      uuid        references public.assignments (id) on delete set null,
    test_date          date        not null,
    test_name          text        not null,
    total_score        integer     not null check (total_score between 400 and 1600 and total_score % 10 = 0),
    math_score         integer     not null check (math_score between 200 and 800 and math_score % 10 = 0),
    rw_score           integer     not null check (rw_score between 200 and 800 and rw_score % 10 = 0),
    mistakes_reviewed  boolean     not null default false,
    notes              text,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    -- SAT total is the sum of the two section scores.
    check (total_score = math_score + rw_score)
);

drop trigger if exists practice_tests_set_updated_at on public.practice_tests;
create trigger practice_tests_set_updated_at
    before update on public.practice_tests
    for each row execute function public.set_updated_at();

create index if not exists practice_tests_user_date_idx
    on public.practice_tests (user_id, test_date desc);

alter table public.practice_tests enable row level security;

drop policy if exists "practice_tests_select_own" on public.practice_tests;
create policy "practice_tests_select_own" on public.practice_tests
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "practice_tests_insert_own" on public.practice_tests;
create policy "practice_tests_insert_own" on public.practice_tests
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "practice_tests_update_own" on public.practice_tests;
create policy "practice_tests_update_own" on public.practice_tests
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "practice_tests_delete_own" on public.practice_tests;
create policy "practice_tests_delete_own" on public.practice_tests
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 12. mistakes — the mistake journal.
-- =============================================================================
create table if not exists public.mistakes (
    id                  uuid        primary key default gen_random_uuid(),
    user_id             uuid        not null references public.profiles (id) on delete cascade,
    practice_test_id    uuid        references public.practice_tests (id) on delete set null,
    assignment_id       uuid        references public.assignments (id) on delete set null,
    source_type         text        not null check (source_type in ('practice_test', 'book')),
    section             text        not null check (section in ('math', 'reading_writing')),
    topic               text        not null,
    question_reference  text,
    error_category      text        not null,
    why_error           text        not null default '',
    correct_reasoning   text        not null default '',
    lesson_to_remember  text        not null default '',
    was_guessed         boolean     not null default false,
    was_retried         boolean     not null default false,
    retry_correct       boolean,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    -- retry_correct only makes sense after a retry.
    check (was_retried = true or retry_correct is null)
);

drop trigger if exists mistakes_set_updated_at on public.mistakes;
create trigger mistakes_set_updated_at
    before update on public.mistakes
    for each row execute function public.set_updated_at();

create index if not exists mistakes_user_created_idx
    on public.mistakes (user_id, created_at desc);

alter table public.mistakes enable row level security;

drop policy if exists "mistakes_select_own" on public.mistakes;
create policy "mistakes_select_own" on public.mistakes
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "mistakes_insert_own" on public.mistakes;
create policy "mistakes_insert_own" on public.mistakes
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "mistakes_update_own" on public.mistakes;
create policy "mistakes_update_own" on public.mistakes
    for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "mistakes_delete_own" on public.mistakes;
create policy "mistakes_delete_own" on public.mistakes
    for delete to authenticated using (auth.uid() = user_id);

-- =============================================================================
-- 13. webhook_events — idempotency ledger for payment webhooks.
--     Service-role only; the unique provider_event_id makes reprocessing safe.
-- =============================================================================
create table if not exists public.webhook_events (
    id                 uuid        primary key default gen_random_uuid(),
    provider           text        not null,
    provider_event_id  text        not null unique,
    event_type         text        not null,
    processed_at       timestamptz,
    payload_reference  text,
    processing_status  text        not null default 'received' check (processing_status in ('received', 'processed', 'skipped', 'failed')),
    error_message      text,
    created_at         timestamptz not null default now()
);

create index if not exists webhook_events_provider_type_idx
    on public.webhook_events (provider, event_type);

alter table public.webhook_events enable row level security;

-- Deliberately NO policies: webhook processing is service-role only.

-- =============================================================================
-- Access-check helper.
-- SECURITY DEFINER + fixed search_path so it can be used safely from RLS
-- policies or server code. Grants execute to authenticated users only.
-- =============================================================================
create or replace function public.has_sat_planner_access(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.purchases pu
        join public.products pr on pr.id = pu.product_id
        where pu.user_id = p_user_id
          and pu.access_granted = true
          and pu.payment_status = 'paid'
          and pr.slug = 'sat-planner'
    );
$$;

revoke all on function public.has_sat_planner_access(uuid) from public;
grant execute on function public.has_sat_planner_access(uuid) to authenticated, service_role;
