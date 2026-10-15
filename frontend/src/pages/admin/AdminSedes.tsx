import { useState } from "react";
import { Link } from "react-router-dom";
import { getSedes, type SedeItem } from "../../data/sedesData";
import "../../admin.css";

export default function AdminSedes() {
  const [sedes] = useState<SedeItem[]>(() => getSedes());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCiudad, setFilterCiudad] = useState("Todas");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Filtrado de sedes
  const filteredSedes = sedes.filter((s) => {
    const matchSearch =
      s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.direccion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.gerente.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCiudad = filterCiudad === "Todas" || s.ciudad === filterCiudad;
    const matchEstado = filterEstado === "Todos" || s.estado === filterEstado;

    return matchSearch && matchCiudad && matchEstado;
  });

  // Métricas calculadas
  const totalSedes = sedes.length;
  const totalCapacidad = sedes.reduce((acc, curr) => acc + curr.capacidadMax, 0);
  const totalAforo = sedes.reduce((acc, curr) => acc + curr.aforoActual, 0);
  const aforoPromedio = totalCapacidad > 0 ? Math.round((totalAforo / totalCapacidad) * 100) : 0;
  const totalCanchas = sedes.reduce((acc, curr) => acc + curr.canchasCount, 0);

  // Obtener lista única de ciudades
  const ciudadesUnicas = Array.from(new Set(sedes.map((s) => s.ciudad)));

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo S-01
            </span>
          </div>
          <h1>Gestión de Sedes</h1>
          <p>Supervisa las sucursales deportivas, infraestructura y aforo en tiempo real de FitZone (UNER Entre Ríos)</p>
        </div>
        <div className="header-controls">
          <Link
            to="/admin/sedes/nueva"
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
          >
            <span>+</span> Nueva Sede (S-02)
          </Link>
        </div>
      </header>

      {/* METRICAS DE RED OPERATIVA */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Sedes Activas</span>
            <span>🏢</span>
          </div>
          <div className="sede-metric-val">{totalSedes}</div>
          <div className="sede-metric-sub">
            <span>{sedes.filter((s) => s.estado === "Operativa").length} Operativas • {sedes.filter((s) => s.estado !== "Operativa").length} En reforma</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Aforo Global en Red</span>
            <span>👥</span>
          </div>
          <div className="sede-metric-val">{aforoPromedio}%</div>
          <div className="sede-metric-sub">
            <span>{totalAforo} / {totalCapacidad} personas</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Canchas Totales</span>
            <span>🎾</span>
          </div>
          <div className="sede-metric-val">{totalCanchas}</div>
          <div className="sede-metric-sub" style={{ color: "var(--text-muted)" }}>
            <span>Paddle Cristal y Fútbol 5</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Socios Totales</span>
            <span>💳</span>
          </div>
          <div className="sede-metric-val">15,404</div>
          <div className="sede-metric-sub">
            <span>+8.4% Nuevos este mes</span>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES Y FILTROS */}
      <div className="action-bar">
        <div className="action-group-left">
          {/* Buscador */}
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar sede, ciudad o gerente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filtro Ciudad */}
          <select
            className="filter-select"
            value={filterCiudad}
            onChange={(e) => setFilterCiudad(e.target.value)}
          >
            <option value="Todas">Todas las Ciudades</option>
            {ciudadesUnicas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filtro Estado */}
          <select
            className="filter-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Operativa">Solo Operativas</option>
            <option value="Mantenimiento">En Mantenimiento</option>
            <option value="Próxima Apertura">Próxima Apertura</option>
          </select>

          {searchQuery && (
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setFilterCiudad("Todas");
                setFilterEstado("Todos");
              }}
              style={{ fontSize: "0.8rem", padding: "0.6rem 0.9rem" }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Toggle Modo Vista */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn-secondary ${viewMode === "cards" ? "active-filter-btn" : ""}`}
            style={{
              borderColor: viewMode === "cards" ? "var(--accent-orange)" : "var(--border-color)",
              color: viewMode === "cards" ? "var(--accent-orange)" : "var(--text-muted)",
              padding: "0.6rem 0.9rem",
              fontSize: "0.85rem",
            }}
            onClick={() => setViewMode("cards")}
            title="Vista de Tarjetas"
          >
            ▦ Cuadrícula
          </button>
          <button
            className={`btn-secondary ${viewMode === "table" ? "active-filter-btn" : ""}`}
            style={{
              borderColor: viewMode === "table" ? "var(--accent-orange)" : "var(--border-color)",
              color: viewMode === "table" ? "var(--accent-orange)" : "var(--text-muted)",
              padding: "0.6rem 0.9rem",
              fontSize: "0.85rem",
            }}
            onClick={() => setViewMode("table")}
            title="Vista de Tabla"
          >
            ☰ Tabla
          </button>
        </div>
      </div>

      {/* ESTADO VACIO */}
      {filteredSedes.length === 0 ? (
        <div className="table-container" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏢</div>
          <h3 style={{ marginBottom: "0.5rem" }}>No se encontraron sedes</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            No hay sucursales que coincidan con "{searchQuery}" y los filtros seleccionados.
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchQuery("");
              setFilterCiudad("Todas");
              setFilterEstado("Todos");
            }}
          >
            Restablecer búsqueda
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* VISTA EN TARJETAS (S-01) */
        <div className="sedes-cards-grid">
          {filteredSedes.map((sede) => {
            const porcentajeAforo = Math.round((sede.aforoActual / sede.capacidadMax) * 100);
            const aforoColor =
              porcentajeAforo >= 85
                ? "var(--accent-red)"
                : porcentajeAforo >= 70
                ? "var(--accent-yellow)"
                : "var(--accent-green)";

            return (
              <div key={sede.id} className="sede-card">
                {/* Banner con imagen */}
                <div
                  className="sede-card-banner"
                  style={{ backgroundImage: `url('${sede.imagenUrl}')` }}
                >
                  <span
                    className={`sede-banner-badge ${
                      sede.estado === "Operativa" ? "badge-operativa" : "badge-mantenimiento"
                    }`}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: sede.estado === "Operativa" ? "var(--accent-green)" : "var(--accent-yellow)",
                      }}
                    ></span>
                    {sede.estado}
                  </span>
                  <span className="sede-banner-city">{sede.ciudad}, {sede.provincia}</span>
                </div>

                {/* Contenido */}
                <div className="sede-card-body">
                  <div>
                    <h3 className="sede-card-title">{sede.nombre}</h3>
                    <p className="sede-card-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "14px", height: "14px", flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {sede.direccion}
                    </p>
                  </div>

                  {/* Barra de Aforo */}
                  <div className="sede-aforo-box">
                    <div className="sede-aforo-header">
                      <span style={{ color: "var(--text-muted)" }}>Aforo en Tiempo Real:</span>
                      <span style={{ color: aforoColor, fontWeight: 700 }}>
                        {porcentajeAforo}% ({sede.aforoActual}/{sede.capacidadMax})
                      </span>
                    </div>
                    <div className="sede-aforo-bar-track">
                      <div
                        className="sede-aforo-bar-fill"
                        style={{
                          width: `${porcentajeAforo}%`,
                          backgroundColor: aforoColor,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Ficha rápida de infraestructura */}
                  <div className="sede-specs-list">
                    <div className="sede-spec-item">
                      <span className="sede-spec-label">Gerente a cargo</span>
                      <span className="sede-spec-val">{sede.gerente}</span>
                    </div>
                    <div className="sede-spec-item">
                      <span className="sede-spec-label">Canchas deportivas</span>
                      <span className="sede-spec-val">{sede.canchasCount} canchas</span>
                    </div>
                    <div className="sede-spec-item">
                      <span className="sede-spec-label">Salas de clases</span>
                      <span className="sede-spec-val">{sede.salasCount} salas</span>
                    </div>
                    <div className="sede-spec-item">
                      <span className="sede-spec-label">Socios registrados</span>
                      <span className="sede-spec-val">{sede.sociosAsignados.toLocaleString()} socios</span>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      Instalaciones y Servicios:
                    </div>
                    <div className="sede-services-tags">
                      {sede.servicios.map((srv, idx) => (
                        <span key={idx} className="sede-service-chip">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción hacia S-03 y S-02 */}
                  <div className="sede-card-actions">
                    <Link
                      to={`/admin/sedes/${sede.id}`}
                      className="sede-btn-view"
                      title="Ver detalle de sede (S-03)"
                    >
                      <span>Ver Detalle (S-03)</span>
                      <span>→</span>
                    </Link>
                    <Link
                      to={`/admin/sedes/${sede.id}/editar`}
                      className="sede-btn-edit"
                      title="Editar sede (S-02)"
                    >
                      ✏️
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA EN TABLA */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sede & Ciudad</th>
                <th>Dirección</th>
                <th>Gerente</th>
                <th>Aforo Actual</th>
                <th>Canchas / Salas</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSedes.map((sede) => {
                const porcentaje = Math.round((sede.aforoActual / sede.capacidadMax) * 100);
                return (
                  <tr key={sede.id}>
                    <td>
                      <div className="user-name">{sede.nombre}</div>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent-orange)" }}>{sede.ciudad}, {sede.provincia}</span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{sede.direccion}</td>
                    <td style={{ fontSize: "0.85rem" }}>{sede.gerente}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{porcentaje}%</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          ({sede.aforoActual}/{sede.capacidadMax})
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {sede.canchasCount} canchas • {sede.salasCount} salas
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          sede.estado === "Operativa" ? "badge-active" : "badge-suspended"
                        }`}
                      >
                        {sede.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link
                          to={`/admin/sedes/${sede.id}`}
                          className="btn-secondary"
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", textDecoration: "none" }}
                        >
                          Detalle (S-03)
                        </Link>
                        <Link
                          to={`/admin/sedes/${sede.id}/editar`}
                          className="btn-secondary"
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem", textDecoration: "none" }}
                        >
                          ✏️
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
