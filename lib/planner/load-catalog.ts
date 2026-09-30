import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { BookCategory, PlannerBook } from "@/lib/planner/types";

/**
 * Load active catalog books with ordered chapters for the planner engine.
 */
export async function loadPlannerCatalog(): Promise<PlannerBook[]> {
  const supabase = await getSupabaseServerClient();
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("id, slug, title, category, affiliate_url")
    .eq("active", true)
    .order("category");

  if (booksError) {
    throw new Error(`Failed to load books: ${booksError.message}`);
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from("book_chapters")
    .select("id, book_id, chapter_number, title, estimated_minutes")
    .eq("active", true)
    .order("chapter_number");

  if (chaptersError) {
    throw new Error(`Failed to load chapters: ${chaptersError.message}`);
  }

  return (books ?? []).map((book) => ({
    id: book.id,
    slug: book.slug,
    title: book.title,
    category: book.category as BookCategory,
    affiliateUrl: book.affiliate_url,
    chapters: (chapters ?? [])
      .filter((c) => c.book_id === book.id)
      .map((c) => ({
        id: c.id,
        bookId: c.book_id,
        chapterNumber: c.chapter_number,
        title: c.title,
        estimatedMinutes: c.estimated_minutes,
      })),
  }));
}
