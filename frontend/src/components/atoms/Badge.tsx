import type { CSSProperties, ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  style?: CSSProperties;
}

const BADGE_STYLES: Record<BadgeVariant, CSSProperties> = {
  success: {
    background: "rgba(0, 255, 135, 0.14)",
    color: "var(--accent-green, #00ff87)",
    border: "1px solid rgba(0, 255, 135, 0.35)",
  },
  warning: {
    background: "rgba(255, 176, 32, 0.14)",
    color: "var(--accent-yellow, #ffb020)",
    border: "1px solid rgba(255, 176, 32, 0.35)",
  },
  danger: {
    background: "rgba(255, 75, 114, 0.14)",
    color: "var(--accent-red, #ff4b72)",
    border: "1px solid rgba(255, 75, 114, 0.35)",
  },
  info: {
    background: "rgba(56, 189, 248, 0.14)",
    color: "#38bdf8",
    border: "1px solid rgba(56, 189, 248, 0.35)",
  },
  neutral: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#cbd5e1",
    border: "1px solid rgba(255, 255, 255, 0.16)",
  },
};

export function Badge({ variant = "neutral", children, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.22rem 0.65rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.3px",
        ...BADGE_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
