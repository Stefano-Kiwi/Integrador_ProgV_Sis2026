
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  obtenerPagoAdminPorId,
  type PagoApi,
} from "../../services/pagosAdminService";
import "../../admin.css";

const dinero = (valor: string | number) =>
  Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

const fecha = (valor: string) =>
  new Date(valor).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });

export default function AdminPagoDetalle() {
  const { id } = useParams<{ id: string }>();

  const [pago, setPago] = useState<PagoApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      const pagoId = Number(id);

      if (!Number.isSafeInteger(pagoId) || pagoId <= 0) {
        setError("Identificador de pago inválido.");
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerPagoAdminPorId(pagoId);

        if (activo) {
          setPago(datos);
          setError(null);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el pago."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargar();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <div className="panel-card">
        Cargando detalle de pago...
      </div>
    );
  }

  if (error || !pago) {
    return (
      <div className="panel-card" role="alert">
        <h2>No se pudo consultar el pago</h2>
        <p>{error ?? "El pago no existe."}</p>

        <Link
          to="/admin/pagos"
          className="btn-secondary"
        >
          Volver a pagos
        </Link>
      </div>
    );
  }

  const datos = [
    ["Identificador", `PAG-${String(pago.id).padStart(4, "0")}`],
    ["Origen", pago.reserva_cancha_id != null
      ? "Reserva de cancha"
      : pago.membresia_id != null
        ? "Membresía"
        : "Sin origen asociado"],
    ["Reserva de cancha", pago.reserva_cancha_id ?? "—"],
    ["Membresía", pago.membresia_id ?? "—"],
    ["Fecha de creación", fecha(pago.creado_at)],
    ["Fecha de pago", pago.pagado_at
      ? fecha(pago.pagado_at)
      : "Todavía no registrada"],
    ["Estado", pago.estado],
    ["Comprobante asociado", pago.comprobante
      ? `Registro #${pago.comprobante.id}`
      : "Sin comprobante"],
  ];

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Detalle de Pago #{pago.id}</h1>
          <p>
            Transacción consultada desde PostgreSQL.
          </p>
        </div>

        <Link
          to="/admin/pagos"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          ← Volver a pagos
        </Link>
      </header>

      <section className="panel-card">
        <span className={`status-badge ${
          pago.estado === "APROBADO"
            ? "status-active"
            : pago.estado === "PENDIENTE"
              ? "status-warning"
              : "status-inactive"
        }`}>
          {pago.estado}
        </span>

        <div
          className="kpi-value"
          style={{ marginTop: "1.25rem" }}
        >
          {dinero(pago.monto)}
        </div>

        <p style={{ color: "var(--text-muted)" }}>
          Importe registrado
        </p>

        {pago.estado === "PENDIENTE" && (
          <p>
            El sistema todavía no registra este pago
            como aprobado.
          </p>
        )}
      </section>

      <section className="panel-card">
        <h2 className="panel-title">
          Información de la transacción
        </h2>

        <dl style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}>
          {datos.map(([etiqueta, valor]) => (
            <div
              key={String(etiqueta)}
              style={{
                borderBottom:
                  "1px solid var(--border-color)",
                paddingBottom: "0.75rem",
              }}
            >
              <dt style={{
                color: "var(--text-muted)",
                marginBottom: "0.4rem",
              }}>
                {etiqueta}
              </dt>

              <dd style={{
                margin: 0,
                fontWeight: 700,
              }}>
                {valor}
              </dd>
            </div>
          ))}
        </dl>

        {pago.comprobante && (
          <p style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}>
            El backend tiene asociado un registro de
            comprobante, pero todavía no verificamos
            que exista un PDF descargable ni una
            factura fiscal válida.
          </p>
        )}
      </section>
    </>
  );
}
