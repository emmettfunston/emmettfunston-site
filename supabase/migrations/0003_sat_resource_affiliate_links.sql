-- Keep existing Supabase projects in sync with the recommended resources.
-- Practice exams are not a chapter book, so their affiliate link is displayed
-- from lib/planner/resources.ts rather than stored in the books catalog.

update public.books
set affiliate_url = case slug
    when 'sat-math-book' then 'https://amzn.to/4kekzFy'
    when 'sat-grammar-book' then 'https://amzn.to/42QYkjc'
    when 'sat-reading-book' then 'https://amzn.to/43mqfaH'
    else affiliate_url
end,
updated_at = now()
where slug in ('sat-math-book', 'sat-grammar-book', 'sat-reading-book');
