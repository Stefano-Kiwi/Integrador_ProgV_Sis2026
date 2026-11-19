
import { useEffect, useState, type FormEvent } from "react";
import {
  obtenerPlanes,
  crearPlan,
  type PlanApi,
} from "../../services/planesService";
import "../../admin.css";

function dinero(valor: string | number): string {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

function duracion(meses: number): string {
  return meses === 1 ? "1 mes" : `${meses} meses`;
}

export default function AdminPlanes() {
  const [planes, setPlanes] = useState<PlanApi[]>([]);
  const [filtroMeses, setFiltroMeses] = useState("Todos");

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<PlanApi | null>(null);

  const [newNombre, setNewNombre] = useState("");
  const [newMeses, setNewMeses] = useState("1");
  const [newPrecio, setNewPrecio] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorFormulario, setErrorFormulario] =
    useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerPlanes();

        if (!activo) return;

        setPlanes(datos);
        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los planes."
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
  }, [recarga]);

  function actualizar() {
    setCargando(true);
    setError(null);
    setRecarga(v => v + 1);
  }

  const duraciones = Array.from(
    new Set(planes.map(p => p.duracion_meses))
  ).sort((a, b) => a - b);

  const filtrados = planes.filter(
    p =>
      filtroMeses === "Todos" ||
      p.duracion_meses === Number(filtroMeses)
  );

  const menorPrecio = planes.length
    ? Math.min(...planes.map(p => Number(p.precio)))
    : 0;

  const mayorDuracion = planes.length
    ? Math.max(...planes.map(p => p.duracion_meses))
    : 0;

  async function handleCreatePlan(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (guardando) return;

    setErrorFormulario(null);

    const meses = Number(newMeses);
    const precio = Number(newPrecio);

    if (!newNombre.trim() || newNombre.trim().length > 100) {
      setErrorFormulario(
        "El nombre es obligatorio y debe tener hasta 100 caracteres."
      );
      return;
    }

    if (!Number.isInteger(meses) || meses <= 0) {
      setErrorFormulario(
        "La duración debe ser un número entero mayor que cero."
      );
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      setErrorFormulario(
        "El precio debe ser un número mayor que cero."
      );
      return;
    }

    setGuardando(true);

    try {
      const creado = await crearPlan({
        nombre: newNombre.trim(),
        duracion_meses: meses,
        precio,
      });

      setPlanes(prev =>
        [...prev, creado].sort((a, b) => a.id - b.id)
      );

      setFiltroMeses("Todos");
      setExito(`El plan "${creado.nombre}" se creó correctamente.`);

      setNewNombre("");
      setNewMeses("1");
      setNewPrecio("");
      setShowModal(false);
    } catch (err) {
      setErrorFormulario(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el plan."
      );
    } finally {
      setGuardando(false);
    }
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
            Módulo PL-01
          </span>

          <h1>Catálogo de Planes de Membresía</h1>

          <p>
            Consultá y creá planes registrados en PostgreSQL.
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
            className="btn-secondary"
            type="button"
            onClick={actualizar}
            disabled={cargando}
          >
            ↻ Actualizar
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setErrorFormulario(null);
              setExito(null);
              setShowModal(true);
            }}
          >
            + Nuevo Plan de Membresía
          </button>
        </div>
      </header>

      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Planes Registrados</span>
            <span>💳</span>
          </div>

          <div className="sede-metric-val">
            {planes.length}
          </div>

          <div className="sede-metric-sub">
            Datos reales del backend
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Plan Más Económico</span>
            <span>💰</span>
          </div>

          <div className="sede-metric-val" style={{
            fontSize: "1.5rem",
          }}>
            {planes.length ? dinero(menorPrecio) : "—"}
          </div>

          <div className="sede-metric-sub">
            Precio registrado
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Mayor Duración</span>
            <span>📅</span>
          </div>

          <div className="sede-metric-val">
            {planes.length ? duracion(mayorDuracion) : "—"}
          </div>

          <div className="sede-metric-sub">
            Período de contratación
          </div>
        </div>
      </div>

      {exito && (
        <div
          className="reserva-step-card"
          role="status"
          style={{
            marginBottom: "1rem",
            color: "var(--accent-green)",
          }}
        >
          {exito}
        </div>
      )}

      {error && (
        <div className="reserva-step-card" role="alert">
          <p>{error}</p>

          <button
            className="btn-secondary"
            type="button"
            onClick={actualizar}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="action-bar">
        <div className="action-group-left">
          <select
            className="filter-select"
            value={filtroMeses}
            onChange={e => setFiltroMeses(e.target.value)}
          >
            <option value="Todos">Todas las duraciones</option>

            {duraciones.map(meses => (
              <option key={meses} value={meses}>
                {duracion(meses)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && (
        <div className="reserva-step-card">
          Cargando planes desde PostgreSQL...
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="reserva-step-card">
          <h3>No hay planes para mostrar</h3>
          <p>
            Todavía no existen planes registrados o ninguno
            coincide con la duración seleccionada.
          </p>
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="catalog-grid">
          {filtrados.map(plan => (
            <div
              key={plan.id}
              className="catalog-card"
            >
              <div>
                <div className="catalog-card-header">
                  <div>
                    <span className="catalog-subtitle">
                      Plan #{plan.id}
                    </span>

                    <h3
                      className="catalog-title"
                      style={{ marginTop: "0.2rem" }}
                    >
                      {plan.nombre}
                    </h3>
                  </div>
                </div>

                <div
                  className="price-highlight-box"
                  style={{ margin: "1rem 0" }}
                >
                  <div>
                    <span className="price-period-label">
                      Precio del plan
                    </span>

                    <div className="price-big-number">
                      {dinero(plan.precio)}
                    </div>
                  </div>
                </div>

                <ul className="catalog-feature-list">
                  <li className="catalog-feature-item">
                    <span className="catalog-feature-bullet">
                      ✓
                    </span>

                    <span>
                      Duración: {duracion(plan.duracion_meses)}
                    </span>
                  </li>

                  <li className="catalog-feature-item">
                    <span className="catalog-feature-bullet">
                      ✓
                    </span>

                    <span>
                      Identificador en PostgreSQL: {plan.id}
                    </span>
                  </li>
                </ul>

                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: "1rem",
                }}>
                  Los beneficios, descuentos y cantidad de
                  socios requieren información adicional
                  del backend.
                </p>
              </div>

              <div className="catalog-card-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <div
          className="sede-modal-overlay"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="sede-modal-box"
            onClick={e => e.stopPropagation()}
          >
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">
                Detalle: {selectedPlan.nombre}
              </h3>

              <button
                type="button"
                className="sede-modal-close"
                onClick={() => setSelectedPlan(null)}
                aria-label="Cerrar detalle"
              >
                ✕
              </button>
            </div>

            <div className="sede-modal-body">
              <span className="catalog-subtitle">
                ID de plan: {selectedPlan.id}
              </span>

              <div
                className="price-big-number"
                style={{
                  color: "var(--accent-orange)",
                  marginTop: "1rem",
                }}
              >
                {dinero(selectedPlan.precio)}
              </div>

              <p>
                <strong>Nombre:</strong>{" "}
                {selectedPlan.nombre}
              </p>

              <p>
                <strong>Duración:</strong>{" "}
                {duracion(selectedPlan.duracion_meses)}
              </p>

              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}>
                El backend todavía no permite editar
                o eliminar planes existentes.
              </p>
            </div>

            <div className="sede-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedPlan(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="sede-modal-overlay"
          onClick={() => {
            if (!guardando) setShowModal(false);
          }}
        >
          <div
            className="sede-modal-box"
            onClick={e => e.stopPropagation()}
          >
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">
                Crear Plan de Membresía
              </h3>

              <button
                type="button"
                className="sede-modal-close"
                disabled={guardando}
                onClick={() => setShowModal(false)}
                aria-label="Cerrar formulario"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan}>
              <div className="sede-modal-body">
                <div className="form-group">
                  <label htmlFor="plan-nombre">
                    Nombre del plan *
                  </label>

                  <input
                    id="plan-nombre"
                    type="text"
                    className="form-control"
                    value={newNombre}
                    onChange={e => setNewNombre(e.target.value)}
                    maxLength={100}
                    placeholder="Ej. Plan Semestral"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="plan-meses">
                    Duración en meses *
                  </label>

                  <input
                    id="plan-meses"
                    type="number"
                    className="form-control"
                    value={newMeses}
                    onChange={e => setNewMeses(e.target.value)}
                    min={1}
                    step={1}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="plan-precio">
                    Precio del plan (ARS) *
                  </label>

                  <input
                    id="plan-precio"
                    type="number"
                    className="form-control"
                    value={newPrecio}
                    onChange={e => setNewPrecio(e.target.value)}
                    min={0.01}
                    step={0.01}
                    placeholder="Ej. 65000"
                    required
                  />
                </div>

                {errorFormulario && (
                  <p
                    role="alert"
                    style={{ color: "var(--accent-red)" }}
                  >
                    {errorFormulario}
                  </p>
                )}
              </div>

              <div className="sede-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={guardando}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : "Guardar Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
