-- =============================================================================
-- 0002_sat_planner_seed.sql — SAT Planner seed data
-- =============================================================================
-- !!! PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH !!!
--
-- The three books and every chapter below are PLACEHOLDERS. Before launch you
-- MUST replace:
--   * book titles (currently "SAT Math Book" etc.)
--   * book descriptions
--   * affiliate URLs if the recommended resources change
--   * chapter counts and chapter titles (currently "Math Chapter N (PLACEHOLDER)")
-- with the real prep books and their actual tables of contents.
--
-- Chapters are seeded 1..N per book. To change a book's chapter count, delete
-- its rows from book_chapters and re-insert (chapter ordering is the
-- chapter_number column).
--
-- Idempotent: rows are keyed by slug / (book, chapter_number) and re-running
-- updates titles in place without duplicating.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Product: the single SAT Planner one-time purchase ($30.00).
-- Stripe IDs stay null until Phase 2 wires up Stripe.
-- -----------------------------------------------------------------------------
insert into public.products (slug, name, description, amount_cents, currency, active)
values (
    'sat-planner',
    'SAT Study Planner',
    'A personalized day-by-day SAT study plan: chapter assignments from proven prep books, weekly practice tests, score tracking, and a mistake journal — from today through your test date.',
    3000,
    'usd',
    true
)
on conflict (slug) do update
set name         = excluded.name,
    description  = excluded.description,
    amount_cents = excluded.amount_cents,
    currency     = excluded.currency,
    active       = excluded.active;

-- -----------------------------------------------------------------------------
-- Books (titles, descriptions, and chapters remain placeholders).
-- -----------------------------------------------------------------------------
insert into public.books (slug, title, category, description, affiliate_url, active)
values
    (
        'sat-math-book',
        'SAT Math Book (PLACEHOLDER)',
        'math',
        'PLACEHOLDER — replace with the real Math prep book title and description before launch.',
        'https://amzn.to/4kekzFy',
        true
    ),
    (
        'sat-grammar-book',
        'SAT Grammar Book (PLACEHOLDER)',
        'grammar',
        'PLACEHOLDER — replace with the real Grammar/Writing prep book title and description before launch.',
        'https://amzn.to/42QYkjc',
        true
    ),
    (
        'sat-reading-book',
        'SAT Reading Book (PLACEHOLDER)',
        'reading',
        'PLACEHOLDER — replace with the real Reading prep book title and description before launch.',
        'https://amzn.to/43mqfaH',
        true
    )
on conflict (slug) do update
set title         = excluded.title,
    category      = excluded.category,
    description   = excluded.description,
    affiliate_url = excluded.affiliate_url,
    active        = excluded.active;

-- -----------------------------------------------------------------------------
-- Chapters (PLACEHOLDERS): 20 for Math, 15 for Grammar, 12 for Reading.
-- Replace the counts and titles with the real books' tables of contents.
-- -----------------------------------------------------------------------------
with book_specs as (
    select 'sat-math-book'    as slug, 'Math'    as label, 20 as chapter_count
    union all
    select 'sat-grammar-book',        'Grammar',        15
    union all
    select 'sat-reading-book',        'Reading',        12
),
expanded as (
    select
        b.id as book_id,
        gs.n as chapter_number,
        format('%s Chapter %s (PLACEHOLDER — replace with real chapter title)', s.label, gs.n) as title
    from book_specs s
    join public.books b on b.slug = s.slug
    cross join lateral generate_series(1, s.chapter_count) as gs(n)
)
insert into public.book_chapters (book_id, chapter_number, title, estimated_minutes, active)
select book_id, chapter_number, title, 60, true
from expanded
on conflict (book_id, chapter_number) do update
set title  = excluded.title,
    active = excluded.active;
