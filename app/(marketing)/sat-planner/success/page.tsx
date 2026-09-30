import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getProfile,
  hasPlannerAccess,
  requireUser,
} from "@/lib/auth/session";
import { PurchaseStatusPoller } from "@/components/planner/purchase-status-poller";
import { buttonVariants } from "@/components/ui/button";

export default async function SatPlannerSuccessPage() {
  const user = await requireUser("/sat-planner/success");
  const hasAccess = await hasPlannerAccess(user.id);

  if (hasAccess) {
    const profile = await getProfile(user.id);
    redirect(profile.onboarding_completed ? "/planner" : "/planner/onboarding");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-6 py-24 text-center sm:px-8">
      <PurchaseStatusPoller />
      <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
        Payment submitted
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Confirming your purchase
      </h1>
      <p className="max-w-md text-muted-foreground">
        Stripe is securely confirming payment. Access is granted only after the
        verified webhook arrives; this page will update automatically.
      </p>
      <Link href="/sat-planner" className={buttonVariants({ variant: "outline" })}>
        Back to SAT Planner
      </Link>
    </div>
  );
}
