import { Badge } from "../atoms/Badge";

export interface FranjaHorariaItem {
  hora_inicio: number;
  hora_fin: number;
  estado: "LIBRE" | "OCUPADA" | "MANTENIMIENTO";
  precio: {
    precio_base: number;
    descuento: number;
    recargo: number;
    monto_total: number;
    estrategias_aplicadas: string[];
  };
}

export interface GrillaHorariaProps {
  franjas: FranjaHorariaItem[];
  horaSeleccionada: number | null;
  onSelectHora: (franja: FranjaHorariaItem) => void;
}

export function GrillaHoraria({
  franjas,
  horaSeleccionada,
  onSelectHora,
}: GrillaHorariaProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "0.65rem",
      }}
    >
      {franjas.map((franja) => {
        const libre = franja.estado === "LIBRE";
        const seleccionada = horaSeleccionada === franja.hora_inicio;
        const esPico = franja.precio.recargo > 0;
        const conDescuento = franja.precio.descuento > 0;

        return (
          <button
            key={franja.hora_inicio}
            type="button"
            disabled={!libre}
            onClick={() => onSelectHora(franja)}
            style={{
              textAlign: "left",
              padding: "0.75rem",
              borderRadius: "10px",
              cursor: libre ? "pointer" : "not-allowed",
              opacity: libre ? 1 : 0.48,
              background: seleccionada
                ? "rgba(255, 94, 58, 0.2)"
                : libre
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(255, 255, 255, 0.02)",
              border: seleccionada
                ? "2px solid var(--accent-orange, #ff5e3a)"
                : "1px solid var(--border-color, #222b40)",
              color: "#ffffff",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
              {String(franja.hora_inicio).padStart(2, "0")}:00 -{" "}
              {String(franja.hora_fin).padStart(2, "0")}:00
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--accent-green, #00ff87)", fontWeight: 600 }}>
              ${franja.precio.monto_total.toLocaleString("es-AR")}
            </div>
            <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
              {!libre && (
                <Badge variant={franja.estado === "OCUPADA" ? "danger" : "warning"}>
                  {franja.estado}
                </Badge>
              )}
              {libre && esPico && <Badge variant="warning">Pico</Badge>}
              {libre && conDescuento && <Badge variant="success">-15%</Badge>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
