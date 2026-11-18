import { Link, useParams } from "react-router-dom";
import { getPagoById } from "../../data/pagosData";
import { formatearImporteMembresia } from "../../data/membresiasData";
import "../../admin.css";

export default function AdminPagoDetalle() {
  const { id } = useParams<{ id: string }>();
  const pago = id ? getPagoById(id) : undefined;

  if (!pago) {
    return (
      <section className="empty-state-card" role="status">
        <h1>Pago no encontrado</h1>
        <p>
          El identificador no existe o el pago simulado se perdió al
          recargar la página.
        </p>
        <Link
          to="/admin/pagos"
          className="btn-primary"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          Volver a pagos
        </Link>
      </section>
    );
  }

  const claseEstado =
    pago.estado === "Aprobado"
      ? "status-active"
      : pago.estado === "Pendiente"
        ? "status-warning"
        : "status-inactive";

  const mensaje =
    pago.estado === "Aprobado"
      ? "La operación figura como aprobada."
      : pago.estado === "Pendiente"
        ? "La operación está pendiente de confirmación. No debe considerarse cobrada."
        : "La operación fue rechazada. El importe no debe considerarse cobrado.";

  const datos = [
    { etiqueta: "Identificador de pago", valor: pago.id },
    { etiqueta: "Socio / cliente", valor: pago.socio },
    { etiqueta: "DNI", valor: pago.dni },
    { etiqueta: "Concepto", valor: pago.concepto },
    { etiqueta: "Fecha", valor: pago.fecha },
    { etiqueta: "Medio de pago", valor: pago.medioPago },
    {
      etiqueta: "Número de comprobante",
      valor:
        pago.estado === "Aprobado"
          ? pago.comprobanteNro || "Sin comprobante asociado"
          : "No disponible para este estado",
    },
  ];

  return (
    <>
      <nav aria-label="Ruta de navegación">
        <Link
          to="/admin/pagos"
          style={{ color: "var(--text-muted)" }}
        >
          Pagos
        </Link>
        <span> / </span>
        <span aria-current="page">{pago.id}</span>
      </nav>

      <header
        className="topbar"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <div className="header-titles">
          <h1>Detalle de pago</h1>
          <p>{pago.socio} · {pago.concepto}</p>
        </div>

        <Link
          to="/admin/pagos"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Volver a pagos
        </Link>
      </header>

      <section className="panel-card">
        <span className={`status-badge ${claseEstado}`}>
          {pago.estado}
        </span>

        <div className="kpi-value" style={{ marginTop: "1.25rem" }}>
          {formatearImporteMembresia(pago.monto)}
        </div>

        <p style={{ color: "var(--text-muted)" }}>
          Importe de la operación
        </p>

        <p style={{ marginTop: "1rem", lineHeight: 1.6 }}>
          {mensaje}
        </p>
      </section>

      <section className="panel-card">
        <h2 className="panel-title" style={{ marginBottom: "1.5rem" }}>
          Información de la transacción
        </h2>

        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {datos.map((dato) => (
            <div
              key={dato.etiqueta}
              style={{
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "1rem",
              }}
            >
              <dt
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  marginBottom: "0.5rem",
                }}
              >
                {dato.etiqueta}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontWeight: 600,
                  overflowWrap: "anywhere",
                }}
              >
                {dato.valor}
              </dd>
            </div>
          ))}
        </dl>

        {pago.estado === "Aprobado" && (
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "1.5rem",
            }}
          >
            Podés consultar el comprobante desde “Ver Factura” en
            la fila correspondiente del listado de pagos.
          </p>
        )}
      </section>
    </>
  );
}