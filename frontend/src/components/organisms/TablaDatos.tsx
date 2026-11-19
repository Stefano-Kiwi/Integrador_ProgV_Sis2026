import type { ReactNode } from "react";
import { Spinner } from "../atoms/Spinner";

export interface ColumnaTabla<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export interface TablaDatosProps<T> {
  columns: ColumnaTabla<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
}

export function TablaDatos<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = "No hay registros para mostrar.",
}: TablaDatosProps<T>) {
  if (loading) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <Spinner label="Cargando datos..." />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p style={{ padding: "1.25rem", textAlign: "center", color: "var(--text-muted, #8b95a5)" }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color, #222b40)", textAlign: "left" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "0.75rem 0.65rem",
                  color: "var(--text-muted, #8b95a5)",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: "0.75rem 0.65rem", color: "#e2e8f0" }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
