import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function FieldWrapper({
  label,
  htmlFor,
  description,
  required,
  error,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <span>{label}</span>
        {required ? (
          <span className="text-xs text-muted-foreground" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function inputId(id: string | undefined, name: string | undefined, label: string) {
  return id ?? name ?? label.replace(/\s+/g, "-").toLowerCase();
}

type TextFieldProps = React.ComponentProps<"input"> & {
  label: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
};

export function TextField({
  id,
  name,
  label,
  description,
  error,
  required,
  wrapperClassName,
  className,
  ...props
}: TextFieldProps) {
  const resolvedId = inputId(id, name, label);
  return (
    <FieldWrapper
      htmlFor={resolvedId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <Input
        id={resolvedId}
        name={name ?? resolvedId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn("h-11 rounded-lg text-base sm:text-sm", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

type TextAreaFieldProps = React.ComponentProps<"textarea"> & {
  label: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
};

export function TextAreaField({
  id,
  name,
  label,
  description,
  error,
  required,
  wrapperClassName,
  className,
  ...props
}: TextAreaFieldProps) {
  const resolvedId = inputId(id, name, label);
  return (
    <FieldWrapper
      htmlFor={resolvedId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <Textarea
        id={resolvedId}
        name={name ?? resolvedId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn("min-h-28 rounded-lg text-base sm:text-sm", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

type SelectFieldProps = React.ComponentProps<"select"> & {
  label: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  placeholder?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

/**
 * A native <select> styled to match the rest of the form. Preferred here over the
 * shadcn/Base UI Select because it plays nicely with plain React state, is fully
 * accessible out of the box, and looks and feels right on mobile.
 */
export function SelectField({
  id,
  name,
  label,
  description,
  error,
  required,
  wrapperClassName,
  className,
  placeholder,
  options,
  value,
  ...props
}: SelectFieldProps) {
  const resolvedId = inputId(id, name, label);
  return (
    <FieldWrapper
      htmlFor={resolvedId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        <select
          id={resolvedId}
          name={name ?? resolvedId}
          required={required}
          aria-invalid={error ? true : undefined}
          value={value ?? ""}
          className={cn(
            "flex h-11 w-full appearance-none rounded-lg border border-input bg-transparent px-3 pr-9 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            !value && "text-muted-foreground",
            className
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-foreground">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        >
          <path
            d="M5.5 8l4.5 4.5L14.5 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </FieldWrapper>
  );
}
