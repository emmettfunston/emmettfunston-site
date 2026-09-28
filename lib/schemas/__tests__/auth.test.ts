import { describe, expect, it } from "vitest";

import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/schemas/auth";

describe("signUpSchema", () => {
  it("accepts a valid signup", () => {
    expect(
      signUpSchema.safeParse({
        email: "student@example.com",
        password: "longenough",
        displayName: "Sam",
      }).success
    ).toBe(true);
  });

  it("rejects invalid emails and short passwords", () => {
    expect(
      signUpSchema.safeParse({ email: "not-an-email", password: "longenough" })
        .success
    ).toBe(false);
    expect(
      signUpSchema.safeParse({ email: "student@example.com", password: "short" })
        .success
    ).toBe(false);
  });
});

describe("signInSchema", () => {
  it("requires both fields", () => {
    expect(
      signInSchema.safeParse({ email: "student@example.com", password: "" })
        .success
    ).toBe(false);
    expect(
      signInSchema.safeParse({ email: "", password: "whatever" }).success
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "longenough",
        confirmPassword: "different1",
      }).success
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        password: "longenough",
        confirmPassword: "longenough",
      }).success
    ).toBe(true);
  });
});
