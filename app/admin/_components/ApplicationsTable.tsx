import { InfoIcon } from "lucide-react";

import type { ApplicationStatus } from "@/lib/admin/application";
import { StatusSelect } from "@/app/admin/_components/StatusSelect";
import { NotesEditor } from "@/app/admin/_components/NotesEditor";

type ApplicationRow = {
  id: string;
  created_at: string;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  parent_name: string;
  parent_email: string;
  grade: string;
  high_school: string;
  current_score: string;
  target_score: string;
  target_colleges: string;
  intended_major: string;
  package_interest: string;
  status: ApplicationStatus | string;
  notes: string | null;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function cell(value: string | null | undefined): string {
  return value == null || value === "" ? "—" : value;
}

/**
 * Best-effort narrowing: if the DB row somehow contains a status value not in
 * our enum (e.g. from a stale check-constraint), fall back to "new" for the
 * <select> control rather than crashing render.
 */
function narrowStatus(v: string): ApplicationStatus {
  const known: ApplicationStatus[] = [
    "new",
    "contacted",
    "interview",
    "accepted",
    "rejected",
    "enrolled",
  ];
  return (known as string[]).includes(v) ? (v as ApplicationStatus) : "new";
}

export function ApplicationsTable({ rows }: { rows: ApplicationRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-foreground/15 bg-background p-6 text-sm text-muted-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        No cohort applications yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] border-collapse text-sm">
          <thead className="bg-muted/60 text-left text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
            <tr>
              <Th>Created</Th>
              <Th>Student</Th>
              <Th>Parent</Th>
              <Th>Grade</Th>
              <Th>High school</Th>
              <Th>Current</Th>
              <Th>Target</Th>
              <Th>Target colleges</Th>
              <Th>Intended major</Th>
              <Th>Package</Th>
              <Th>Status</Th>
              <Th>Notes</Th>
              <Th>Parent email</Th>
              <Th>Student email</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-foreground/10 align-top text-foreground/90 hover:bg-muted/30"
              >
                <Td className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(r.created_at)}
                </Td>
                <Td className="whitespace-nowrap font-medium text-foreground">
                  {r.student_first_name} {r.student_last_name}
                </Td>
                <Td className="whitespace-nowrap">{cell(r.parent_name)}</Td>
                <Td>{cell(r.grade)}</Td>
                <Td>{cell(r.high_school)}</Td>
                <Td className="whitespace-nowrap tabular-nums">
                  {cell(r.current_score)}
                </Td>
                <Td className="whitespace-nowrap tabular-nums">
                  {cell(r.target_score)}
                </Td>
                <Td className="max-w-[240px]">
                  <span className="line-clamp-3 whitespace-pre-wrap">
                    {cell(r.target_colleges)}
                  </span>
                </Td>
                <Td className="max-w-[220px]">
                  <span className="line-clamp-3 whitespace-pre-wrap">
                    {cell(r.intended_major)}
                  </span>
                </Td>
                <Td className="whitespace-nowrap">{cell(r.package_interest)}</Td>
                <Td>
                  <StatusSelect id={r.id} value={narrowStatus(r.status)} />
                </Td>
                <Td>
                  <NotesEditor id={r.id} initialValue={r.notes} />
                </Td>
                <Td className="whitespace-nowrap">
                  <a
                    href={`mailto:${r.parent_email}`}
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {r.parent_email}
                  </a>
                </Td>
                <Td className="whitespace-nowrap">
                  <a
                    href={`mailto:${r.student_email}`}
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {r.student_email}
                  </a>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 font-semibold">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-3 ${className}`}>{children}</td>;
}
