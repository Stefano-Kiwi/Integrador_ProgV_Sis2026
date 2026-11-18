import { useState } from "react";
import { Link } from "react-router-dom";
import { getCanchas, type CanchaItem } from "../../data/clasesCanchasData";
import { getSedes } from "../../data/sedesData";
import "../../admin.css";

export default function AdminCanchasListado() {
  const [canchas] = useState<CanchaItem[]>(() => getCanchas());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSede, setFilterSede] = useState("Todas");
  const [filterDeporte, setFilterDeporte] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const sedes = getSedes();

  // Filtrado
  const filteredCanchas = canchas.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.superficie.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSede = filterSede === "Todas" || c.sedeId === filterSede;
    const matchDeporte = filterDeporte === "Todos" || c.deporte === filterDeporte;
    const matchEstado = filterEstado === "Todos" || c.estado === filterEstado;

    return matchSearch && matchSede && matchDeporte && matchEstado;
  });

  // Métricas
  const totalCanchas = canchas.length;
  const totalOperativas = canchas.filter((c) => c.estado === "Operativa").length;
  const totalMantenimiento = canchas.filter((c) => c.estado === "Mantenimiento").length;
  const ocupacionPromedio = Math.round(
    canchas.reduce((acc, curr) => acc + curr.statsMes.tasaOcupacion, 0) / (totalCanchas || 1)
  );

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo CA-01
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Inventario Físico de Pistas</span>
          </div>
          <h1>Listado e Inventario de Canchas</h1>
          <p>Supervisa el estado técnico, disponibilidad, equipamiento y tarifas de las canchas en todas las sedes</p>
        </div>
        <div className="header-controls" style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            to="/admin/canchas"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>📅</span> Grilla en Vivo (R-01)
          </Link>
          <Link
            to="/admin/canchas/nueva"
            className="btn-primary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>+</span> Nueva Cancha (CA-02)
          </Link>
        </div>
      </header>

      {/* KPI METRIC CARDS */}
      <div className="fase4-metrics-grid">
        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Total Canchas</span>
            <span>🏟️</span>
          </div>
          <div className="fase4-metric-val">{totalCanchas}</div>
          <div className="fase4-metric-sub">Distribuídas en 4 sedes activas</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Canchas Operativas</span>
            <span>✓</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-green)" }}>
            {totalOperativas}
          </div>
          <div className="fase4-metric-sub">Disponibles para juego inmediato</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>En Mantenimiento</span>
            <span>🔧</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-red)" }}>
            {totalMantenimiento}
          </div>
          <div className="fase4-metric-sub">Con bloqueo técnico preventivo</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Ocupación Promedio</span>
            <span>📈</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-yellow)" }}>
            {ocupacionPromedio}%
          </div>
          <div className="fase4-metric-sub">Horarios pico de 19:00 a 21:00 hs</div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="classes-filter-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="filter-group" style={{ flexGrow: 1, minWidth: "220px" }}>
          <label className="filter-label">Buscar Cancha / Superficie:</label>
          <input
            type="text"
            className="form-control"
            placeholder="ej. Cristal, Césped Azul, PAD-01, FIFA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Sede:</label>
          <select
            className="filter-select"
            value={filterSede}
            onChange={(e) => setFilterSede(e.target.value)}
          >
            <option value="Todas">Todas las Sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Deporte:</label>
          <select
            className="filter-select"
            value={filterDeporte}
            onChange={(e) => setFilterDeporte(e.target.value)}
          >
            <option value="Todos">Todos los Deportes</option>
            <option value="Pádel">Pádel</option>
            <option value="Fútbol 5">Fútbol 5</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado:</label>
          <select
            className="filter-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Operativa">Operativa</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
        </div>

        {/* TOGGLE VISTA */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem", alignItems: "flex-end" }}>
          <button
            type="button"
            className={`tab-btn ${viewMode === "cards" ? "active" : ""}`}
            style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
            onClick={() => setViewMode("cards")}
          >
            Tarjetas
          </button>
          <button
            type="button"
            className={`tab-btn ${viewMode === "table" ? "active" : ""}`}
            style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
            onClick={() => setViewMode("table")}
          >
            Tabla
          </button>
        </div>
      </div>

      {/* VISTA TARJETAS (CARDS) */}
      {viewMode === "cards" && (
        <div className="canchas-grid">
          {filteredCanchas.map((cancha) => {
            const precioSocio = Math.round(cancha.tarifaBaseHora * (1 - cancha.descuentoSocioPorc / 100));
            return (
              <div key={cancha.id} className="cancha-card">
                <div className="cancha-card-img-wrap">
                  <img src={cancha.imagenUrl} alt={cancha.nombre} className="cancha-card-img" />
                  <div className="cancha-card-badges">
                    <span
                      className={`sport-tag ${
                        cancha.deporte === "Pádel"
                          ? "sport-tag-padel"
                          : cancha.deporte === "Fútbol 5"
                          ? "sport-tag-futbol"
                          : "sport-tag-tenis"
                      }`}
                    >
                      {cancha.deporte}
                    </span>
                    <span
                      className={`status-pill ${
                        cancha.estado === "Operativa" ? "status-pill-operativa" : "status-pill-mantenimiento"
                      }`}
                    >
                      {cancha.estado}
                    </span>
                  </div>
                </div>

                <div className="cancha-card-body">
                  <div className="cancha-card-header">
                    <span className="cancha-card-code">{cancha.codigo}</span>
                    <h3 className="cancha-card-name">{cancha.nombre}</h3>
                    <div className="cancha-card-sede">
                      <span>📍</span> {cancha.sedeNombre}
                    </div>
                  </div>

                  {/* Especificaciones */}
                  <div className="cancha-specs-list">
                    <div className="cancha-spec-item">
                      <span className="cancha-spec-label">Superficie:</span>
                      <span className="cancha-spec-val" title={cancha.superficie}>
                        {cancha.superficie.slice(0, 24)}...
                      </span>
                    </div>
                    <div className="cancha-spec-item">
                      <span className="cancha-spec-label">Iluminación:</span>
                      <span className="cancha-spec-val">{cancha.iluminacion.split(" ")[0]}</span>
                    </div>
                    <div className="cancha-spec-item">
                      <span className="cancha-spec-label">Cubierta:</span>
                      <span className="cancha-spec-val">{cancha.techada ? "Techada" : "Al aire libre"}</span>
                    </div>
                    <div className="cancha-spec-item">
                      <span className="cancha-spec-label">Turno Estándar:</span>
                      <span className="cancha-spec-val">{cancha.duracionTurnoMin} min</span>
                    </div>
                  </div>

                  {/* Tarifas */}
                  <div className="cancha-pricing-box">
                    <div>
                      <div className="cancha-price-main">${cancha.tarifaBaseHora.toLocaleString()} / turno</div>
                      <div className="cancha-price-socio">
                        Socio ({cancha.descuentoSocioPorc}% OFF): <strong>${precioSocio.toLocaleString()}</strong>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                      ⚡ +{cancha.recargoHoraPicoPorc}% Pico
                    </span>
                  </div>

                  {/* Botones Acciones */}
                  <div className="cancha-card-actions">
                    <Link
                      to={`/admin/canchas/${cancha.id}`}
                      className="btn-secondary"
                      style={{ flex: 1, textAlign: "center", textDecoration: "none", fontSize: "0.8rem", padding: "0.45rem" }}
                    >
                      Ver Detalle (CA-04)
                    </Link>
                    <Link
                      to={`/admin/canchas/${cancha.id}/editar`}
                      className="btn-secondary"
                      style={{ textAlign: "center", textDecoration: "none", fontSize: "0.8rem", padding: "0.45rem 0.75rem" }}
                      title="Editar especificaciones"
                    >
                      ✏️
                    </Link>
                    {cancha.estado === "Operativa" && (
                      <Link
                        to={`/admin/reservas/nueva?canchaId=${cancha.id}`}
                        className="btn-primary"
                        style={{ textAlign: "center", textDecoration: "none", fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                        title="Crear reserva directa"
                      >
                        Reservar (R-03)
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA TABLA */}
      {viewMode === "table" && (
        <div className="waitlist-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                <th style={{ padding: "1rem" }}>Código</th>
                <th style={{ padding: "1rem" }}>Nombre & Deporte</th>
                <th style={{ padding: "1rem" }}>Sede</th>
                <th style={{ padding: "1rem" }}>Superficie</th>
                <th style={{ padding: "1rem" }}>Tarifa Base</th>
                <th style={{ padding: "1rem" }}>Tarifa Socio (-15%)</th>
                <th style={{ padding: "1rem" }}>Estado</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCanchas.map((cancha) => {
                const precioSocio = Math.round(cancha.tarifaBaseHora * (1 - cancha.descuentoSocioPorc / 100));
                return (
                  <tr key={cancha.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem", fontWeight: 800, color: "var(--accent-orange)" }}>
                      {cancha.codigo}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>{cancha.nombre}</div>
                      <span
                        className={`sport-tag ${
                          cancha.deporte === "Pádel"
                            ? "sport-tag-padel"
                            : cancha.deporte === "Fútbol 5"
                            ? "sport-tag-futbol"
                            : "sport-tag-tenis"
                        }`}
                        style={{ marginTop: "0.2rem" }}
                      >
                        {cancha.deporte}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{cancha.sedeNombre}</td>
                    <td style={{ padding: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {cancha.superficie}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "var(--accent-green)" }}>
                      ${cancha.tarifaBaseHora.toLocaleString()}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-pure)" }}>${precioSocio.toLocaleString()}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        className={`status-pill ${
                          cancha.estado === "Operativa" ? "status-pill-operativa" : "status-pill-mantenimiento"
                        }`}
                      >
                        {cancha.estado}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <Link
                          to={`/admin/canchas/${cancha.id}`}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", textDecoration: "none" }}
                        >
                          Detalle (CA-04)
                        </Link>
                        <Link
                          to={`/admin/canchas/${cancha.id}/editar`}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", textDecoration: "none" }}
                        >
                          Editar
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
    </div>
  );
}
