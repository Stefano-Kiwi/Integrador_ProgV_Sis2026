import type { CSSProperties, ReactNode } from "react";

export interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({
  title,
  subtitle,
  headerAction,
  children,
  className,
  style,
}: CardProps) {
  return (
    <section
      className={className}
      style={{
        background: "var(--bg-card, #151b2b)",
        border: "1px solid var(--border-color, #222b40)",
        borderRadius: "14px",
        padding: "1.25rem",
        ...style,
      }}
    >
      {(title || subtitle || headerAction) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div>
            {title && (
              <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.05rem", fontWeight: 700 }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-muted, #8b95a5)", fontSize: "0.82rem" }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </section>
  );
}
