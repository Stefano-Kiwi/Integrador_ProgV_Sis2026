import type { ButtonHTMLAttributes, CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, var(--accent-orange, #ff5e3a), #ff8c42)",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.16)",
  },
  danger: {
    background: "rgba(255, 75, 114, 0.16)",
    color: "var(--accent-red, #ff4b72)",
    border: "1px solid rgba(255, 75, 114, 0.45)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted, #94a3b8)",
    border: "1px solid transparent",
  },
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.65rem 1.2rem",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "0.88rem",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? "100%" : undefined,
        transition: "opacity 0.15s ease",
        ...VARIANT_STYLES[variant],
        ...style,
      }}
      {...rest}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}
