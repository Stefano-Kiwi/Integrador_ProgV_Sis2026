import { useState } from "react";
import { INITIAL_TIPOS_CANCHA, type TipoCanchaItem } from "../../data/catalogosData";
import "../../admin.css";

export default function AdminTiposCancha() {
  const [tiposCancha, setTiposCancha] = useState<TipoCanchaItem[]>(INITIAL_TIPOS_CANCHA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDeporte, setFilterDeporte] = useState("Todos");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoCanchaItem | null>(null);

  // Form nuevo tipo
  const [newNombre, setNewNombre] = useState("");
  const [newDeporte, setNewDeporte] = useState<"Paddle" | "Fútbol 5" | "Tenis">("Paddle");
  const [newSuperficie, setNewSuperficie] = useState("");
  const [newTarifaBase, setNewTarifaBase] = useState(12000);
  const [newDuracion, setNewDuracion] = useState(90);

  const filtered = tiposCancha.filter((c) => {
    const matchQuery =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.superficie.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDeporte = filterDeporte === "Todos" || c.deporte === filterDeporte;

    return matchQuery && matchDeporte;
  });

  const handleCreateTipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) {
      alert("Por favor completa el nombre de la cancha.");
      return;
    }

    const nuevo: TipoCanchaItem = {
      id: `TCAN-${tiposCancha.length + 10}`,
      nombre: newNombre,
      deporte: newDeporte,
      superficie: newSuperficie || "Césped Sintético Estándar",
      tarifaBaseHora: Number(newTarifaBase),
      duracionTurnoMin: Number(newDuracion),
      descuentoSocioPorc: 15,
      recargoHoraPicoPorc: 20,
      totalCanchasEnRed: 2,
      estado: "Habilitado",
    };

    setTiposCancha([nuevo, ...tiposCancha]);
    setShowModal(false);
    setNewNombre("");
    setNewSuperficie("");
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo CA-05
            </span>
          </div>
          <h1>Catálogo de Tipos de Cancha & Superficies</h1>
          <p>Configuración de tarifas base, duración de turnos y reglas de precio dinámico (Módulo M4 / RF-11)</p>
        </div>
        <div className="header-controls">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Tipo de Cancha
          </button>
        </div>
      </header>

      {/* METRICAS */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Tipos Configurados</span>
            <span>🎾</span>
          </div>
          <div className="sede-metric-val">{tiposCancha.length}</div>
          <div className="sede-metric-sub">
            <span>Paddle, Fútbol 5 y Tenis</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Total Canchas en Red</span>
            <span>🏟️</span>
          </div>
          <div className="sede-metric-val">
            {tiposCancha.reduce((acc, c) => acc + c.totalCanchasEnRed, 0)}
          </div>
          <div className="sede-metric-sub">
            <span>En las 25+ sedes de Entre Ríos</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Regla Dinámica (Strategy)</span>
            <span>⚡</span>
          </div>
          <div className="sede-metric-val">-15% / +20%</div>
          <div className="sede-metric-sub">
            <span>Descuento socio vs Hora Pico (RF-11)</span>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="action-bar">
        <div className="action-group-left">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por tipo o superficie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterDeporte}
            onChange={(e) => setFilterDeporte(e.target.value)}
          >
            <option value="Todos">Todos los Deportes</option>
            <option value="Paddle">Paddle</option>
            <option value="Fútbol 5">Fútbol 5</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>
      </div>

      {/* GRILLA DE CANCHAS */}
      <div className="catalog-grid">
        {filtered.map((cancha) => {
          const precioSocio = Math.round(cancha.tarifaBaseHora * (1 - cancha.descuentoSocioPorc / 100));
          const precioPico = Math.round(cancha.tarifaBaseHora * (1 + cancha.recargoHoraPicoPorc / 100));

          return (
            <div key={cancha.id} className="catalog-card">
              <div>
                <div className="catalog-card-header">
                  <div>
                    <span className="catalog-subtitle">Deporte: {cancha.deporte}</span>
                    <h3 className="catalog-title" style={{ marginTop: "0.2rem" }}>{cancha.nombre}</h3>
                  </div>
                  <span className="badge badge-active">{cancha.estado}</span>
                </div>

                <div className="price-highlight-box" style={{ margin: "1rem 0" }}>
                  <div>
                    <span className="price-period-label">Tarifa Base Estándar</span>
                    <div className="price-big-number">${cancha.tarifaBaseHora.toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Turnos de {cancha.duracionTurnoMin} min
                  </span>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.8rem" }}>
                  <strong>Superficie Oficial:</strong> {cancha.superficie}
                </div>

                {/* ESTRATEGIA DE PRECIOS RF-11 */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    fontSize: "0.8rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--accent-green)" }}>✓ Socio Activo (-{cancha.descuentoSocioPorc}%):</span>
                    <strong style={{ color: "var(--accent-green)" }}>${precioSocio.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--accent-yellow)" }}>⚡ Hora Pico 19-21h (+{cancha.recargoHoraPicoPorc}%):</span>
                    <strong style={{ color: "var(--accent-yellow)" }}>${precioPico.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>👤 Cliente Externo (A2):</span>
                    <span>${cancha.tarifaBaseHora.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="catalog-card-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.8rem" }}
                  onClick={() => setSelectedTipo(cancha)}
                >
                  Ver Parámetros
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALLE */}
      {selectedTipo && (
        <div className="sede-modal-overlay" onClick={() => setSelectedTipo(null)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Ficha Técnica: {selectedTipo.nombre}</h3>
              <button className="sede-modal-close" onClick={() => setSelectedTipo(null)}>
                ✕
              </button>
            </div>
            <div className="sede-modal-body">
              <span className="catalog-subtitle">Módulo M4 • Canchas Deportivas</span>
              <p style={{ fontSize: "0.9rem", color: "var(--text-pure)" }}>
                <strong>Superficie:</strong> {selectedTipo.superficie}
              </p>

              <div className="sede-aforo-box">
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Patrón Strategy aplicado (RF-11):</span>
                <p style={{ fontSize: "0.85rem", color: "var(--text-pure)", marginTop: "0.3rem" }}>
                  El cálculo de turno se efectúa dinámicamente aplicando descuentos de socio sobre la tarifa base o recargos en horas pico de alta demanda.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Duración del Turno</span>
                  <p style={{ fontWeight: 600 }}>{selectedTipo.duracionTurnoMin} minutos</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Canchas de este tipo en Red</span>
                  <p style={{ fontWeight: 600 }}>{selectedTipo.totalCanchasEnRed} canchas activas</p>
                </div>
              </div>
            </div>
            <div className="sede-modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedTipo(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO TIPO DE CANCHA */}
      {showModal && (
        <div className="sede-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Registrar Tipo de Cancha (CA-05)</h3>
              <button className="sede-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTipo}>
              <div className="sede-modal-body">
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Nombre del Tipo de Cancha *
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    placeholder="Ej. Paddle Cristal Techada"
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Deporte
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newDeporte}
                      onChange={(e) => setNewDeporte(e.target.value as any)}
                    >
                      <option value="Paddle">Paddle</option>
                      <option value="Fútbol 5">Fútbol 5</option>
                      <option value="Tenis">Tenis</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Tarifa Base / Hora ($)
                    </label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      value={newTarifaBase}
                      onChange={(e) => setNewTarifaBase(Number(e.target.value))}
                      min="5000"
                      step="500"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Tipo de Superficie / Césped
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    placeholder="Ej. Césped Monofilamento Azul"
                    value={newSuperficie}
                    onChange={(e) => setNewSuperficie(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Duración Estándar de Reserva (Minutos)
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: "100%" }}
                    value={newDuracion}
                    onChange={(e) => setNewDuracion(Number(e.target.value))}
                  >
                    <option value={60}>60 minutos (1 hora - Fútbol 5)</option>
                    <option value={90}>90 minutos (1.5 horas - Paddle / Tenis)</option>
                  </select>
                </div>
              </div>

              <div className="sede-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Tipo de Cancha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
