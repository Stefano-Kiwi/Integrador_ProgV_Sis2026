
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  obtenerCanchaPorId,
  type CanchaApi,
} from "../../services/canchasService";
import "../../admin.css";

export default function AdminCanchaDetalle() {
  const { id } = useParams<{ id: string }>();

  const [cancha, setCancha] = useState<CanchaApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError(null);
      setCancha(null);

      const canchaId = Number(id);

      if (!Number.isSafeInteger(canchaId) || canchaId <= 0) {
        setError("El identificador de cancha no es válido.");
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerCanchaPorId(canchaId);
        if (activo) setCancha(datos);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo consultar la cancha."
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
  }, [id, intento]);

  const precio = (valor: string | number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(Number(valor));

  const volver = (
    <Link
      to="/admin/canchas/listado"
      className="btn-secondary"
      style={{ textDecoration: "none" }}
    >
      ← Volver al inventario
    </Link>
  );

  if (cargando) {
    return (
      <div style={{ padding: "3rem" }}>
        <h2>Cargando ficha de cancha...</h2>
      </div>
    );
  }

  if (error || !cancha) {
    return (
      <div style={{ padding: "3rem" }} role="alert">
        <h2>No se pudo cargar la cancha</h2>
        <p>{error || "No se encontró la cancha."}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          {volver}
          <button
            className="btn-primary"
            onClick={() => setIntento(v => v + 1)}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const habilitada = cancha.estado === "HABILITADA";

  const codigo = `CAN-${String(cancha.id).padStart(3, "0")}`;

  const deporte = cancha.tipo_cancha.nombre;

  const datosGenerales = [
    ["Identificador", codigo],
    ["Nombre", cancha.nombre],
    ["Deporte", deporte],
    ["Sede", cancha.sede.nombre],
    ["Localidad", cancha.sede.localidad],
    ["Dirección", cancha.sede.direccion],
  ];

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        paddingBottom: "3rem",
      }}
    >
      <header
        className="topbar"
        style={{ marginBottom: "1.5rem" }}
      >
        <div className="header-titles">
          <div style={{ color: "var(--accent-orange)" }}>
            <strong>Módulo CA-04</strong>
            <span style={{ color: "var(--text-muted)" }}>
              {" "} • Ficha Técnica Operativa
            </span>
          </div>

          <h1>{cancha.nombre}</h1>

          <p>
            {codigo} • {cancha.sede.nombre}
          </p>
        </div>

        <div
          className="header-controls"
          style={{ display: "flex", gap: "0.75rem" }}
        >
          {volver}

          {habilitada && (
            <Link
              to={`/admin/reservas/nueva?canchaId=${cancha.id}`}
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Crear reserva
            </Link>
          )}
        </div>
      </header>

      <div className="cancha-detail-header-card">
        <div className="cancha-detail-info" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="cancha-card-code">
                {codigo}
              </span>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {cancha.nombre}
              </h2>

              <span
                className={`sport-tag ${
                  deporte.toLowerCase().includes("fútbol")
                    ? "sport-tag-futbol"
                    : deporte.toLowerCase().includes("paddle")
                    || deporte.toLowerCase().includes("pádel")
                      ? "sport-tag-padel"
                      : "sport-tag-tenis"
                }`}
              >
                {deporte}
              </span>
            </div>

            <span
              className={`status-pill ${
                habilitada
                  ? "status-pill-operativa"
                  : "status-pill-mantenimiento"
              }`}
            >
              {habilitada
                ? "● OPERATIVA"
                : "● EN MANTENIMIENTO"}
            </span>
          </div>

          <h3
            style={{
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            Información de la cancha
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {datosGenerales.map(([etiqueta, valor]) => (
              <div
                key={etiqueta}
                style={{
                  padding: "1rem",
                  background: "rgba(11, 15, 25, 0.7)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span className="cancha-spec-label">
                  {etiqueta}
                </span>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontWeight: 700,
                    color: "var(--text-pure)",
                  }}
                >
                  {valor}
                </div>
              </div>
            ))}
          </div>

          <div
            className="cancha-pricing-box"
            style={{ marginTop: "1.5rem" }}
          >
            <div>
              <span className="cancha-spec-label">
                Tarifa base registrada
              </span>
              <div className="cancha-price-main">
                {precio(cancha.costo_hora)} / hora
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="cancha-detail-stats-row"
        style={{ marginTop: "1.5rem" }}
      >
        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Estado operativo</span>
            <span>🏟️</span>
          </div>

          <div
            className="fase4-metric-val"
            style={{
              fontSize: "1.2rem",
              color: habilitada
                ? "var(--accent-green)"
                : "var(--accent-red)",
            }}
          >
            {habilitada ? "HABILITADA" : "MANTENIMIENTO"}
          </div>

          <div className="fase4-metric-sub">
            Estado registrado en PostgreSQL
          </div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Tarifa por hora</span>
            <span>💰</span>
          </div>

          <div
            className="fase4-metric-val"
            style={{
              fontSize: "1.5rem",
              color: "var(--accent-green)",
            }}
          >
            {precio(cancha.costo_hora)}
          </div>

          <div className="fase4-metric-sub">
            Precio base sin descuentos ni recargos
          </div>
        </div>
      </div>

      <div
        className="waitlist-table-container"
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Información operativa
        </h2>

        <p>
          {habilitada
            ? "Esta cancha está habilitada para recibir reservas."
            : "Esta cancha se encuentra en mantenimiento y no admite nuevas reservas."}
        </p>

        <p
          style={{
            marginTop: "1rem",
            color: "var(--text-muted)",
          }}
        >
          La información proviene directamente del backend
          FitZone Sports. La gestión del mantenimiento y el
          historial de reservas requieren endpoints adicionales.
        </p>
      </div>
    </div>
  );
}
