import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../admin.css";
import { AlertMessage, Badge, Card, TablaDatos, type ColumnaTabla } from "../components";
import { obtenerPlanes, type PlanApi } from "../services/planesService";

interface ReglaTarifa {
  estrategia: string;
  regla: string;
  valor: string;
  referencia: string;
}

const ESTRATEGIAS_PRECIO: ReglaTarifa[] = [
  {
    estrategia: "TarifaEstandar",
    regla: "Precio base por hora de cada cancha",
    valor: "costo_hora de cancha",
    referencia: "RF-11",
  },
  {
    estrategia: "DescuentoSocio",
    regla: "Socios con membresía ACTIVO",
    valor: "-15%",
    referencia: "RF-11",
  },
  {
    estrategia: "RecargoHorarioPico",
    regla: "Turnos con inicio entre 19:00 y 21:00 h",
    valor: "+20%",
    referencia: "RF-11",
  },
  {
    estrategia: "TarifaExterno",
    regla: "Clientes externos y socios con membresía VENCIDO / SUSPENDIDO",
    valor: "Precio de lista (0% descuento)",
    referencia: "RN-03",
  },
];

const REGLAS_OPERATIVAS = [
  { parametro: "Anticipación máxima reserva de clase", valor: "48 horas", ref: "RF-07" },
  { parametro: "Cancelación de clase sin penalidad", valor: "Hasta 2 horas antes", ref: "RF-07" },
  { parametro: "Cancelación de cancha sin penalidad", valor: "Hasta 24 horas antes (50% luego)", ref: "RF-10" },
  { parametro: "Rotación de código QR dinámico", valor: "Cada 60 segundos (HMAC-SHA256)", ref: "RF-04" },
];

export default function AdminConfiguracion() {
  const [planes, setPlanes] = useState<PlanApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerPlanes()
      .then((lista) => setPlanes(lista))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudieron cargar los planes.")
      )
      .finally(() => setCargando(false));
  }, []);

  const columnasEstrategias: ColumnaTabla<ReglaTarifa>[] = [
    { key: "estrategia", header: "Estrategia", render: (r) => <strong>{r.estrategia}</strong> },
    { key: "regla", header: "Condición", render: (r) => r.regla },
    { key: "valor", header: "Valor vigente", render: (r) => <Badge variant="info">{r.valor}</Badge> },
    { key: "ref", header: "Req.", render: (r) => <Badge variant="neutral">{r.referencia}</Badge> },
  ];

  const columnasPlanes: ColumnaTabla<PlanApi>[] = [
    { key: "nombre", header: "Plan", render: (p) => <strong>{p.nombre}</strong> },
    { key: "duracion", header: "Duración", render: (p) => `${p.duracion_meses} mes(es)` },
    {
      key: "precio",
      header: "Precio vigente",
      render: (p) => `$${Number(p.precio).toLocaleString("es-AR")}`,
    },
  ];

  return (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "1100px" }}>
      <header className="topbar">
        <div className="header-titles">
          <h1>Tarifas, Descuentos y Reglas de Negocio (Gerencia)</h1>
          <p>Vista de solo lectura de las estrategias de precio y parámetros vigentes en el backend.</p>
        </div>
        <Badge variant="warning">Solo lectura</Badge>
      </header>

      <AlertMessage
        variant="info"
        title="Parámetros definidos en el motor de precios del backend"
        message="Las estrategias de precio (DescuentoSocio 15%, RecargoHorarioPico +20% 19:00-21:00) y las ventanas operativas se gestionan en el código del backend y se muestran en modo solo lectura. Los planes de membresía sí se administran en /admin/planes."
      />

      {error && <AlertMessage variant="error" message={error} />}

      <Card
        title="Estrategias de Precio Dinámico (Patrón Strategy — RF-11)"
        subtitle="Implementadas en backend/src/canchas/pricing/"
      >
        <TablaDatos
          columns={columnasEstrategias}
          rows={ESTRATEGIAS_PRECIO}
          rowKey={(r) => r.estrategia}
        />
      </Card>

      <Card
        title="Planes de Membresía Vigentes (GET /planes)"
        headerAction={
          <Link to="/admin/planes" className="btn-secondary" style={{ textDecoration: "none" }}>
            Administrar planes
          </Link>
        }
      >
        <TablaDatos
          columns={columnasPlanes}
          rows={planes}
          rowKey={(p) => p.id}
          loading={cargando}
          emptyMessage="No hay planes cargados."
        />
      </Card>

      <Card title="Reglas Operativas Vigentes">
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {REGLAS_OPERATIVAS.map((item) => (
            <div
              key={item.parametro}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                fontSize: "0.88rem",
              }}
            >
              <span style={{ color: "#e2e8f0" }}>{item.parametro}</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <strong style={{ color: "var(--accent-green, #00ff87)" }}>{item.valor}</strong>
                <Badge variant="neutral">{item.ref}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
