
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerCanchas,
  type CanchaApi,
} from "../services/canchasService";
import "../admin.css";

const formatoPrecio = (valor: string) =>
  Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

export default function AdminCanchas() {
  const [canchas, setCanchas] = useState<CanchaApi[]>([]);
  const [tipoActivoId, setTipoActivoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarCanchas() {
      try {
        const datos = await obtenerCanchas();

        if (!activo) return;

        setCanchas(datos);
        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron consultar las canchas."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarCanchas();

    return () => {
      activo = false;
    };
  }, [recarga]);

  const tipos = Array.from(
    new Map(
      canchas.map(c => [
        c.tipo_cancha.id,
        c.tipo_cancha,
      ])
    ).values()
  );

  const idActivo =
    tipos.some(t => t.id === tipoActivoId)
      ? tipoActivoId
      : tipos[0]?.id ?? null;

  const canchasVisibles = canchas.filter(
    c => c.tipo_cancha_id === idActivo
  );

  const operativas = canchas.filter(
    c => c.estado === "HABILITADA"
  ).length;

  const mantenimiento = canchas.filter(
    c => c.estado === "EN_MANTENIMIENTO"
  ).length;

  const totalSedes = new Set(
    canchas.map(c => c.sede_id)
  ).size;

  function actualizar() {
    setCargando(true);
    setError(null);
    setRecarga(v => v + 1);
  }

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            fontSize: "0.8rem",
            color: "var(--accent-orange)",
            fontWeight: 700,
          }}>
            Módulos R-01 & CA-03
          </span>

          <h1>Control de Canchas Deportivas</h1>

          <p>
            Estado operativo, sedes y tarifas reales
            del inventario FitZone Sports.
          </p>
        </div>

        <div
          className="header-controls"
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={actualizar}
            disabled={cargando}
          >
            ↻ Actualizar
          </button>

          <Link
            to="/admin/canchas/listado"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Inventario de Canchas
          </Link>

          <Link
            to="/admin/canchas/nueva"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            + Nueva Cancha
          </Link>
        </div>
      </header>

      <div className="grid-legend-bar">
        <span className="legend-title">
          Estado del inventario:
        </span>

        <div className="legend-item">
          <span className="legend-badge badge-libre">
            ● {operativas} habilitadas
          </span>
        </div>

        <div className="legend-item">
          <span className="legend-badge badge-mantenimiento">
            ✕ {mantenimiento} en mantenimiento
          </span>
        </div>

        <div className="legend-item">
          <span className="legend-sub">
            {canchas.length} canchas en {totalSedes} sedes
          </span>
        </div>
      </div>

      {cargando && (
        <div className="reserva-step-card">
          Cargando canchas desde PostgreSQL...
        </div>
      )}

      {error && !cargando && (
        <div className="reserva-step-card" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={actualizar}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && canchas.length === 0 && (
        <div className="reserva-step-card">
          <h2>No hay canchas registradas</h2>
          <p>
            Registrá una cancha desde el inventario
            para comenzar a administrarla.
          </p>
          <Link
            to="/admin/canchas/nueva"
            className="btn-primary"
          >
            Crear cancha
          </Link>
        </div>
      )}

      {!cargando && !error && canchas.length > 0 && (
        <div className="courts-layout">
          <section className="grid-section">
            <div className="grid-header">
              <h2
                className="config-title"
                style={{ margin: 0 }}
              >
                Canchas por Disciplina
              </h2>

              <div
                className="tabs-group"
                style={{ flexWrap: "wrap" }}
              >
                {tipos.map(tipo => {
                  const cantidad = canchas.filter(
                    c => c.tipo_cancha_id === tipo.id
                  ).length;

                  return (
                    <button
                      type="button"
                      key={tipo.id}
                      className={`tab-btn ${
                        idActivo === tipo.id ? "active" : ""
                      }`}
                      onClick={() => setTipoActivoId(tipo.id)}
                    >
                      {tipo.nombre} ({cantidad})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="courts-list">
              {canchasVisibles.map(cancha => {
                const habilitada =
                  cancha.estado === "HABILITADA";

                return (
                  <div
                    className="court-row"
                    key={cancha.id}
                  >
                    <div className="court-header">
                      <div>
                        <span className="court-title">
                          {cancha.nombre}
                        </span>

                        <div style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "0.2rem",
                        }}>
                          {cancha.sede.nombre}
                          {" • "}
                          {cancha.sede.localidad}
                        </div>
                      </div>

                      <span className={`status-badge ${
                        habilitada
                          ? "status-active"
                          : "status-inactive"
                      }`}>
                        {habilitada
                          ? "Operativa"
                          : "Mantenimiento"}
                      </span>
                    </div>

                    {!habilitada ? (
                      <div className="maintenance-box">
                        <div className="maintenance-icon">
                          🔧
                        </div>

                        <div>
                          <strong>
                            Cancha no disponible
                          </strong>
                          <p
                            className="maintenance-msg"
                            style={{ margin: 0 }}
                          >
                            El backend informa que esta
                            cancha está en mantenimiento.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: "1rem",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        marginTop: "0.75rem",
                      }}>
                        <p style={{
                          margin: 0,
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                        }}>
                          Cancha habilitada para recibir
                          reservas. La ocupación de cada
                          horario todavía no se puede
                          consultar desde la API.
                        </p>
                      </div>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}>
                      <div>
                        <span style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}>
                          Tarifa base por hora
                        </span>

                        <div style={{
                          color: "var(--accent-orange)",
                          fontWeight: 800,
                          fontSize: "1.15rem",
                        }}>
                          {formatoPrecio(cancha.costo_hora)}
                        </div>
                      </div>

                      <Link
                        to={`/admin/canchas/${cancha.id}`}
                        className="btn-secondary"
                        style={{ textDecoration: "none" }}
                      >
                        Ver ficha de cancha
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="config-section">
            <h2
              className="config-title"
              style={{ margin: 0 }}
            >
              Información Operativa
            </h2>

            <div className="pricing-card">
              <div className="pricing-header">
                Tarifas registradas
              </div>

              {canchasVisibles.map(cancha => (
                <div
                  className="pricing-row"
                  key={cancha.id}
                >
                  <span className="pricing-label">
                    {cancha.nombre}
                  </span>

                  <span className="pricing-val">
                    {formatoPrecio(cancha.costo_hora)}/h
                  </span>
                </div>
              ))}
            </div>

            <div className="maintenance-block">
              <div className="maintenance-header">
                Mantenimiento Preventivo
              </div>

              <p className="maintenance-desc">
                Los estados operativos se consultan
                directamente desde PostgreSQL.
              </p>

              <p className="maintenance-desc">
                El cambio de estado está pendiente
                porque el backend no ofrece todavía
                un endpoint para habilitar o bloquear
                canchas.
              </p>

              <Link
                to="/admin/canchas/listado"
                className="btn-secondary"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Consultar inventario
              </Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                Disponibilidad por Horarios
              </div>

              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                padding: "1rem",
                margin: 0,
              }}>
                Pendiente de integración con las reservas
                reales. No se muestran turnos libres ni
                ocupados hasta disponer de la API.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
