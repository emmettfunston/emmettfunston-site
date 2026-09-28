/**
 * Shared shape for auth form server-action state.
 *
 * Lives outside the "use server" actions module because server-action files
 * may only export async functions — constants exported from them arrive as
 * undefined in client components.
 */
export type AuthActionState = {
  ok: boolean;
  /** Form-level error message, safe to show the user. */
  error: string | null;
  /** Field-level validation errors. */
  fieldErrors: Record<string, string>;
  /** Success message for flows that don't redirect (e.g. forgot password). */
  message: string | null;
};

export const AUTH_IDLE_STATE: AuthActionState = {
  ok: false,
  error: null,
  fieldErrors: {},
  message: null,
};
