-- =============================================================================
-- emmettfunston.com — Supabase schema
-- =============================================================================
-- Two intake tables:
--   * workshop_registrations — free workshop signups (soft-signal leads)
--   * cohort_applications    — cohort intake applications (high-signal leads)
--
-- Row Level Security is enabled on both tables with NO public policies.
-- Writes and reads happen exclusively through the server-only service role key
-- (which bypasses RLS). The public anon key must never touch these tables.
--
-- Idempotent: safe to re-run.
-- =============================================================================

-- gen_random_uuid() lives in pgcrypto on older PG versions; it ships in core
-- on modern Supabase projects. Enable defensively.
create extension if not exists pgcrypto;

-- =============================================================================
-- workshop_registrations
-- =============================================================================

create table if not exists public.workshop_registrations (
    id                  uuid        primary key default gen_random_uuid(),
    student_first_name  text        not null,
    student_last_name   text        not null,
    student_email       text        not null,
    parent_name         text        not null,
    parent_email        text        not null,
    grade               text        not null,
    high_school         text        not null,
    current_score       text,
    target_score        text,
    target_colleges     text,
    main_interest       text        not null,
    referral_source     text,
    created_at          timestamptz not null default now()
);

create index if not exists workshop_registrations_created_at_idx
    on public.workshop_registrations (created_at desc);

create index if not exists workshop_registrations_student_email_idx
    on public.workshop_registrations (student_email);

alter table public.workshop_registrations enable row level security;

-- Explicitly no anon/authenticated policies. All writes flow through the
-- server-only service role, which bypasses RLS by design.

-- =============================================================================
-- cohort_applications
-- =============================================================================

create table if not exists public.cohort_applications (
    id                          uuid        primary key default gen_random_uuid(),

    -- Student info
    student_first_name          text        not null,
    student_last_name           text        not null,
    student_email               text        not null,
    student_phone               text,
    parent_name                 text        not null,
    parent_email                text        not null,
    grade                       text        not null,
    high_school                 text        not null,

    -- Academic info
    current_score               text        not null,
    target_score                text        not null,
    next_test_date              text,
    gpa                         text,
    course_rigor                text,

    -- College goals
    target_colleges             text        not null,
    intended_major              text        not null,
    early_application_plans     text,

    -- Activities
    extracurriculars            text        not null,
    strongest_activity          text,
    weakest_application_area    text,

    -- Program fit
    package_interest            text        not null,
    why_join                    text        not null,
    hours_per_week              text        not null,
    biggest_goal                text        not null,
    willing_to_join_community   boolean     not null,
    additional_info             text,

    -- Pipeline state
    status                      text        not null default 'new',
    notes                       text,

    created_at                  timestamptz not null default now()
);

-- Ensure the notes column exists on databases that were created before it was
-- introduced. Safe to re-run.
alter table public.cohort_applications
    add column if not exists notes text;

create index if not exists cohort_applications_created_at_idx
    on public.cohort_applications (created_at desc);

create index if not exists cohort_applications_status_idx
    on public.cohort_applications (status);

create index if not exists cohort_applications_student_email_idx
    on public.cohort_applications (student_email);

alter table public.cohort_applications enable row level security;

-- Constrain `status` to the values used by the admin dashboard. This block is
-- idempotent AND self-healing: it drops any prior version of the constraint
-- before recreating it, so re-running the file picks up the new value set.
do $$
begin
    alter table public.cohort_applications
        drop constraint if exists cohort_applications_status_check;

    alter table public.cohort_applications
        add constraint cohort_applications_status_check
        check (status in ('new', 'contacted', 'interview', 'accepted', 'rejected', 'enrolled'));
end
$$;

-- Explicitly no anon/authenticated policies. All writes flow through the
-- server-only service role, which bypasses RLS by design.
