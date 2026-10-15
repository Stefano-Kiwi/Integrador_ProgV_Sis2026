import { Link, useParams } from "react-router-dom";
import {
  FECHA_REFERENCIA_DEMO,
  getMembresiaById,
  getPlanMembresiaById,
  formatearFechaMembresia,
  formatearImporteMembresia,
} from "../../data/membresiasData";
import "../../admin.css";

export default function AdminMembresiaDetalle() {
  const { id } = useParams<{ id: string }>();
  const membresia = id ? getMembresiaById(id) : undefined;

  if (!membresia) {
    return (
      <section className="empty-state-card" role="status">
        <h1>Membresía no encontrada</h1>
        <p>
          No encontramos una membresía con el identificador indicado.
        </p>
        <Link
          to="/admin/membresias"
          className="btn-primary"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const plan = getPlanMembresiaById(membresia.planId);

  const claseEstado =
    membresia.estado === "Activa"
      ? "status-active"
      : membresia.estado === "Vencida"
        ? "status-warning"
        : "status-inactive";

  const descripcionEstado =
    membresia.estado === "Activa"
      ? "La membresía se encuentra activa dentro del período indicado."
      : membresia.estado === "Vencida"
        ? "El período contratado finalizó. El socio necesita renovar su membresía."
        : "La membresía se encuentra suspendida, aunque su fecha de vencimiento puede ser futura.";

  const datosSocio = [
    { etiqueta: "Número de socio", valor: membresia.socioId },
    { etiqueta: "Nombre completo", valor: membresia.socioNombre },
    { etiqueta: "DNI", valor: membresia.socioDni },
    { etiqueta: "Correo electrónico", valor: membresia.socioEmail },
  ];

  const datosContratacion = [
    { etiqueta: "Número de membresía", valor: membresia.id },
    {
      etiqueta: "Plan contratado",
      valor: plan?.nombre ?? `Plan no disponible (${membresia.planId})`,
    },
    {
      etiqueta: "Periodicidad",
      valor: plan?.periodicidad ?? "No disponible",
    },
    {
      etiqueta: "Fecha de inicio",
      valor: formatearFechaMembresia(membresia.fechaInicio),
    },
    {
      etiqueta: "Fecha de vencimiento",
      valor: formatearFechaMembresia(membresia.fechaVencimiento),
    },
    {
      etiqueta: "Importe contratado",
      valor: formatearImporteMembresia(membresia.importeContratado),
    },
    {
      etiqueta: "Renovación automática",
      valor: membresia.renovacionAutomatica ? "Activada" : "Desactivada",
    },
  ];

  return (
    <>
      <nav aria-label="Ruta de navegación">
        <Link
          to="/admin/membresias"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          Membresías
        </Link>
        <span style={{ color: "var(--text-muted)" }}> / </span>
        <span aria-current="page">{membresia.id}</span>
      </nav>

      <header
        className="topbar"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <div className="header-titles">
          <h1>Detalle de membresía</h1>
          <p>
            {membresia.socioNombre} · {membresia.id}
          </p>
        </div>

        <div className="header-controls" style={{ flexWrap: "wrap" }}>
          {membresia.estado !== "Suspendida" && (
            <Link
              to={`/admin/membresias/${membresia.id}/renovar`}
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Renovar membresía
            </Link>
          )}

          <Link
            to="/admin/membresias"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Volver al listado
          </Link>
        </div>
      </header>

      <section className="panel-card" aria-label="Estado de la membresía">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2 className="panel-title">Estado de la membresía</h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              {descripcionEstado}
            </p>
          </div>

          <span className={`status-badge ${claseEstado}`}>
            {membresia.estado}
          </span>
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            marginTop: "1rem",
          }}
        >
          Fecha de referencia:{" "}
          {formatearFechaMembresia(FECHA_REFERENCIA_DEMO)}
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "1.5rem",
        }}
      >
        <section className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Datos del socio</h2>
          </div>

          <dl style={{ margin: 0 }}>
            {datosSocio.map((dato) => (
              <div
                key={dato.etiqueta}
                style={{
                  padding: "0.85rem 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <dt
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginBottom: "0.35rem",
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
        </section>

        <section className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Datos de la contratación</h2>
          </div>

          <dl style={{ margin: 0 }}>
            {datosContratacion.map((dato) => (
              <div
                key={dato.etiqueta}
                style={{
                  padding: "0.85rem 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <dt
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginBottom: "0.35rem",
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
        </section>
      </div>

      <section className="panel-card">
        <div
          className="panel-header"
          style={{ flexWrap: "wrap", gap: "1rem" }}
        >
          <h2 className="panel-title">Características del plan</h2>
          <Link
            to="/admin/planes"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Consultar planes
          </Link>
        </div>

        {plan ? (
          <>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong>Acceso a sedes:</strong> {plan.sedesAcceso}
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Descuento en canchas del plan:</strong>{" "}
              {plan.descuentoCanchas}%
            </p>

            <ul
              style={{
                paddingLeft: "1.25rem",
                margin: 0,
                display: "grid",
                gap: "0.65rem",
                lineHeight: 1.6,
              }}
            >
              {plan.beneficios.map((beneficio) => (
                <li key={beneficio}>{beneficio}</li>
              ))}
            </ul>

            {membresia.estado !== "Activa" && (
              <p
                style={{
                  marginTop: "1.25rem",
                  color: "var(--accent-yellow)",
                  lineHeight: 1.6,
                }}
              >
                Los beneficios del plan no indican que esta membresía esté
                habilitada para utilizarlos. Su estado actual es{" "}
                {membresia.estado.toLowerCase()}.
              </p>
            )}
          </>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>
            No se encontraron las características del plan asociado.
            Los datos de la contratación se muestran arriba.
          </p>
        )}
      </section>
    </>
  );
}