import { useState } from "react";
import { Link } from "react-router-dom";
import { INITIAL_PLANES } from "../../data/catalogosData";
import {
  FECHA_REFERENCIA_DEMO,
  getMembresias,
  getPlanMembresiaById,
  formatearFechaMembresia,
  formatearImporteMembresia,
} from "../../data/membresiasData";
import "../../admin.css";

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function AdminMembresias() {
  const [membresias] = useState(getMembresias);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [filtroPlan, setFiltroPlan] = useState("Todos");
  const [errorSimulado, setErrorSimulado] = useState(false);

  const resumen = [
    {
      titulo: "Total de membresías",
      cantidad: membresias.length,
      color: "var(--text-pure)",
    },
    {
      titulo: "Activas",
      cantidad: membresias.filter((item) => item.estado === "Activa").length,
      color: "var(--accent-green)",
    },
    {
      titulo: "Vencidas",
      cantidad: membresias.filter((item) => item.estado === "Vencida").length,
      color: "var(--accent-yellow)",
    },
    {
      titulo: "Suspendidas",
      cantidad: membresias.filter((item) => item.estado === "Suspendida").length,
      color: "var(--accent-red)",
    },
  ];

  const textoBuscado = normalizarTexto(busqueda);
  const dniBuscado = busqueda.replace(/\D/g, "");
  const esBusquedaDni = /^[\d.\s-]+$/.test(busqueda.trim());

  const membresiasFiltradas = membresias.filter((membresia) => {
    const coincideTexto = [
      membresia.id,
      membresia.socioId,
      membresia.socioNombre,
      membresia.socioDni,
      membresia.socioEmail,
    ].some((valor) => normalizarTexto(valor).includes(textoBuscado));

    const coincideDni =
      esBusquedaDni &&
      dniBuscado.length > 0 &&
      membresia.socioDni.replace(/\D/g, "").includes(dniBuscado);

    const coincideEstado =
      filtroEstado === "Todas" || membresia.estado === filtroEstado;

    const coincidePlan =
      filtroPlan === "Todos" || membresia.planId === filtroPlan;

    return (coincideTexto || coincideDni) && coincideEstado && coincidePlan;
  });

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroEstado("Todas");
    setFiltroPlan("Todos");
  }

  return (
    <>
      <header
        className="topbar"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <div className="header-titles">
          <h1>Membresías</h1>
          <p>
            Consultá los planes contratados por los socios, su vigencia y estado.
          </p>
        </div>

        <div className="header-controls" style={{ flexWrap: "wrap" }}>
        <Link
          to="/admin/membresias/nueva"
          className="btn-primary"
          style={{ textDecoration: "none" }}
        >
          Contratar membresía
        </Link>

        <button
          type="button"
          className="btn-secondary"
          aria-pressed={errorSimulado}
          onClick={() => setErrorSimulado((valor) => !valor)}
        >
          {errorSimulado ? "Volver al listado" : "Simular error"}
        </button>
      </div>
      
      </header>

      {errorSimulado ? (
        <section className="error-state-card" role="alert">
          <h2>No se pudieron cargar las membresías</h2>
          <p>Intentá nuevamente para consultar el listado.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setErrorSimulado(false)}
          >
            Reintentar
          </button>
        </section>
      ) : (
        <>
          <section
            aria-label="Resumen general de membresías"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {resumen.map((item) => (
              <article className="panel-card" key={item.titulo}>
                <div className="kpi-header">{item.titulo}</div>
                <div className="kpi-value" style={{ color: item.color }}>
                  {item.cantidad}
                </div>
              </article>
            ))}
          </section>

          <section className="panel-card" aria-label="Listado de membresías">
            <div
              className="panel-header"
              style={{ flexWrap: "wrap", gap: "0.75rem" }}
            >
              <h2 className="panel-title">Membresías contratadas</h2>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Fecha de referencia:{" "}
                {formatearFechaMembresia(FECHA_REFERENCIA_DEMO)}
              </span>
            </div>

            <div className="action-bar">
              <div className="action-group-left">
                <div className="search-box">
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>

                  <input
                    type="search"
                    className="search-input"
                    aria-label="Buscar por socio, DNI, email o identificador"
                    placeholder="Socio, DNI, email o ID..."
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    style={{ width: "100%", minWidth: 0 }}
                  />
                </div>

                <select
                  className="filter-select"
                  aria-label="Filtrar por estado de membresía"
                  value={filtroEstado}
                  onChange={(event) => setFiltroEstado(event.target.value)}
                >
                  <option value="Todas">Todos los estados</option>
                  <option value="Activa">Activas</option>
                  <option value="Vencida">Vencidas</option>
                  <option value="Suspendida">Suspendidas</option>
                </select>

                <select
                  className="filter-select"
                  aria-label="Filtrar por plan contratado"
                  value={filtroPlan}
                  onChange={(event) => setFiltroPlan(event.target.value)}
                  style={{ maxWidth: "100%" }}
                >
                  <option value="Todos">Todos los planes</option>
                  {INITIAL_PLANES.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>

            {membresiasFiltradas.length === 0 ? (
              <div className="empty-state-card" role="status">
                <h3>No se encontraron membresías</h3>
                <p>Probá con otros datos o restablecé los filtros.</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={limpiarFiltros}
                >
                  Mostrar todas
                </button>
              </div>
            ) : (
              <div
                className="table-container"
                role="region"
                aria-label="Tabla de membresías"
                tabIndex={0}
                style={{ overflowX: "auto" }}
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Membresía</th>
                      <th scope="col">Socio</th>
                      <th scope="col">Plan contratado</th>
                      <th scope="col">Vigencia</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Importe contratado</th>
                      <th scope="col">Renovación automática</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {membresiasFiltradas.map((membresia) => {
                      const plan = getPlanMembresiaById(membresia.planId);

                      const claseEstado =
                        membresia.estado === "Activa"
                          ? "status-active"
                          : membresia.estado === "Vencida"
                            ? "status-warning"
                            : "status-inactive";

                      return (
                        <tr key={membresia.id}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {membresia.id}
                          </td>

                          <td>
                            <div className="user-name">
                              {membresia.socioNombre}
                            </div>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                                marginTop: "0.3rem",
                              }}
                            >
                              DNI: {membresia.socioDni}
                            </div>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.75rem",
                              }}
                            >
                              {membresia.socioEmail}
                            </div>
                          </td>

                          <td>
                            <div>{plan?.nombre ?? "Plan no disponible"}</div>
                            <small style={{ color: "var(--text-muted)" }}>
                              {plan?.periodicidad ?? membresia.planId}
                            </small>
                          </td>

                          <td style={{ whiteSpace: "nowrap" }}>
                            <div>
                              Desde:{" "}
                              {formatearFechaMembresia(membresia.fechaInicio)}
                            </div>
                            <div
                              className={
                                membresia.estado === "Vencida"
                                  ? "date-warning"
                                  : ""
                              }
                            >
                              Hasta:{" "}
                              {formatearFechaMembresia(
                                membresia.fechaVencimiento,
                              )}
                            </div>
                          </td>

                          <td>
                            <span className={`status-badge ${claseEstado}`}>
                              {membresia.estado}
                            </span>
                          </td>

                          <td style={{ whiteSpace: "nowrap" }}>
                            {formatearImporteMembresia(
                              membresia.importeContratado,
                            )}
                          </td>

                          <td>
                            {membresia.renovacionAutomatica
                              ? "Activada"
                              : "Desactivada"}
                          </td>

                          <td>
                            <Link
                              to={`/admin/membresias/${membresia.id}`}
                              className="btn-secondary"
                              aria-label={`Ver detalle de la membresía ${membresia.id} de ${membresia.socioNombre}`}
                              style={{
                                display: "inline-block",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                padding: "0.5rem 0.8rem",
                              }}
                            >
                              Ver detalle
                            </Link>
                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pagination-area">
              <span className="pagination-info" role="status">
                Mostrando {membresiasFiltradas.length} de {membresias.length}{" "}
                membresías
              </span>
            </div>
          </section>
        </>
      )}
    </>
  );
}