import type { CSSProperties } from "react";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertMessageProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
}

const ALERT_STYLES: Record<AlertVariant, CSSProperties> = {
  success: {
    background: "rgba(0, 255, 135, 0.12)",
    border: "1px solid rgba(0, 255, 135, 0.45)",
    color: "var(--accent-green, #00ff87)",
  },
  error: {
    background: "rgba(255, 75, 114, 0.12)",
    border: "1px solid rgba(255, 75, 114, 0.45)",
    color: "#fca5a5",
  },
  warning: {
    background: "rgba(255, 176, 32, 0.12)",
    border: "1px solid rgba(255, 176, 32, 0.45)",
    color: "var(--accent-yellow, #ffb020)",
  },
  info: {
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.45)",
    color: "#7dd3fc",
  },
};

export function AlertMessage({ variant, title, message, onClose }: AlertMessageProps) {
  return (
    <div
      role="alert"
      style={{
        borderRadius: "10px",
        padding: "0.85rem 1rem",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "0.75rem",
        fontSize: "0.86rem",
        ...ALERT_STYLES[variant],
      }}
    >
      <div>
        {title && <strong style={{ display: "block", marginBottom: "0.2rem" }}>{title}</strong>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
