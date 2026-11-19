import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.9rem" }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#cbd5e1",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--accent-red, #ff4b72)", marginLeft: "0.25rem" }}>*</span>}
      </label>
      {children}
      {error ? (
        <span style={{ fontSize: "0.76rem", color: "var(--accent-red, #ff4b72)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "0.76rem", color: "var(--text-muted, #8b95a5)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
