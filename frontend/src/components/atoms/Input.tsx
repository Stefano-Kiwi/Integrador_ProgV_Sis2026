import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError = false, style, ...rest }: InputProps) {
  return (
    <input
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "rgba(255, 255, 255, 0.04)",
        border: `1px solid ${hasError ? "var(--accent-red, #ff4b72)" : "var(--border-color, #222b40)"}`,
        borderRadius: "8px",
        padding: "0.65rem 0.9rem",
        color: "#ffffff",
        fontSize: "0.9rem",
        outline: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
