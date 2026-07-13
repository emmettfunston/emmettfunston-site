import { isAdminAuthed } from "@/lib/admin/auth";
import {
  getSupabaseAdminClient,
  SupabaseNotConfiguredError,
} from "@/lib/supabase/server";

import { LoginForm } from "@/app/admin/_components/LoginForm";
import { Dashboard } from "@/app/admin/_components/Dashboard";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/admin/application";

type SearchParams = { tab?: string; error?: string };

const WORKSHOP_COLUMNS = [
  "id",
  "created_at",
  "student_first_name",
  "student_last_name",
  "student_email",
  "parent_name",
  "parent_email",
  "grade",
  "high_school",
  "current_score",
  "target_score",
  "main_interest",
  "referral_source",
].join(", ");

const APPLICATION_COLUMNS = [
  "id",
  "created_at",
  "student_first_name",
  "student_last_name",
  "student_email",
  "parent_name",
  "parent_email",
  "grade",
  "high_school",
  "current_score",
  "target_score",
  "target_colleges",
  "intended_major",
  "package_interest",
  "status",
  "notes",
].join(", ");

/**
 * Load dashboard data using the service-role client. This runs on the server
 * only — the service role key is never exposed to the browser.
 */
async function loadDashboardData() {
  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      return {
        workshopRows: [],
        applicationRows: [],
        loadError:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env, then restart the server.",
      } as const;
    }
    throw err;
  }

  const [workshops, applications] = await Promise.all([
    supabase
      .from("workshop_registrations")
      .select(WORKSHOP_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("cohort_applications")
      .select(APPLICATION_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  if (workshops.error) {
    console.error("[admin] workshop_registrations load failed:", workshops.error);
  }
  if (applications.error) {
    console.error("[admin] cohort_applications load failed:", applications.error);
  }

  const loadError =
    workshops.error || applications.error
      ? "Some data couldn't be loaded. Check server logs for details."
      : null;

  // The typed supabase-js overload returns `GenericStringError[]` when the
  // schema isn't generated, so we cast via `unknown`. The SELECT list above
  // guarantees the fields on the row shape used downstream.
  return {
    workshopRows: (workshops.data ?? []) as unknown as Array<
      Record<string, string | null>
    >,
    applicationRows: (applications.data ?? []) as unknown as Array<
      Record<string, string | null>
    >,
    loadError,
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab: rawTab, error } = await searchParams;

  const authed = await isAdminAuthed();
  if (!authed) {
    return <LoginForm error={error} redirectTo="/admin" />;
  }

  const tab = rawTab === "applications" ? "applications" : "workshop";

  const { workshopRows, applicationRows, loadError } = await loadDashboardData();

  const statusCounts: Partial<Record<ApplicationStatus, number>> = {};
  for (const row of applicationRows) {
    const s = row.status;
    if (s && (APPLICATION_STATUSES as readonly string[]).includes(s)) {
      const key = s as ApplicationStatus;
      statusCounts[key] = (statusCounts[key] ?? 0) + 1;
    }
  }

  // The row types on Dashboard's props are structural and precise; casting the
  // dynamic Supabase result to that shape is safe here because the SELECT list
  // above guarantees the fields exist.
  return (
    <Dashboard
      tab={tab}
      workshopRows={workshopRows as never}
      applicationRows={applicationRows as never}
      workshopCount={workshopRows.length}
      applicationCount={applicationRows.length}
      loadError={loadError}
      statusCounts={statusCounts}
    />
  );
}
