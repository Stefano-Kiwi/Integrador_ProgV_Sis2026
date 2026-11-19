export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZES = { sm: 16, md: 24, lg: 36 } as const;

export function Spinner({ size = "md", label }: SpinnerProps) {
  const px = SIZES[size];
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        color: "var(--text-muted, #94a3b8)",
        fontSize: "0.88rem",
      }}
    >
      <span
        style={{
          width: `${px}px`,
          height: `${px}px`,
          borderRadius: "50%",
          border: "3px solid rgba(255, 255, 255, 0.15)",
          borderTopColor: "var(--accent-orange, #ff5e3a)",
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {label && <span>{label}</span>}
    </div>
  );
}
