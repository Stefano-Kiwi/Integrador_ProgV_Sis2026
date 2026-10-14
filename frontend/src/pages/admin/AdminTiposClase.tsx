import { useState } from "react";
import { INITIAL_TIPOS_CLASE, type TipoClaseItem } from "../../data/catalogosData";
import "./AdminCatalogos.css";

export default function AdminTiposClase() {
  const [tiposClase, setTiposClase] = useState<TipoClaseItem[]>(INITIAL_TIPOS_CLASE);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIntensidad, setFilterIntensidad] = useState("Todas");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoClaseItem | null>(null);

  // Form nuevo tipo
  const [newNombre, setNewNombre] = useState("");
  const [newDisciplina, setNewDisciplina] = useState("Cardiovascular");
  const [newIntensidad, setNewIntensidad] = useState<"Baja" | "Media" | "Alta" | "Extrema">("Alta");
  const [newDuracion, setNewDuracion] = useState(50);
  const [newCupo, setNewCupo] = useState(20);
  const [newSala, setNewSala] = useState("Sala Central 1");
  const [newCalorias, setNewCalorias] = useState(550);
  const [newDescripcion, setNewDescripcion] = useState("");

  const filtered = tiposClase.filter((t) => {
    const matchQuery =
      t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.disciplina.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchIntensidad = filterIntensidad === "Todas" || t.intensidad === filterIntensidad;

    return matchQuery && matchIntensidad;
  });

  const handleCreateTipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) {
      alert("Por favor completa el nombre de la clase.");
      return;
    }

    const nuevo: TipoClaseItem = {
      id: `TC-${tiposClase.length + 10}`,
      nombre: newNombre,
      disciplina: newDisciplina,
      intensidad: newIntensidad,
      duracionMin: Number(newDuracion),
      cupoMaxSugerido: Number(newCupo),
      salaRequerida: newSala,
      caloriasAprox: Number(newCalorias),
      descripcion: newDescripcion || "Actividad guiada por instructor profesional de FitZone.",
      equipamiento: ["Materiales provistos por el gimnasio"],
      estado: "Activo",
    };

    setTiposClase([nuevo, ...tiposClase]);
    setShowModal(false);
    setNewNombre("");
    setNewDescripcion("");
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo C-05
            </span>
          </div>
          <h1>Catálogo de Tipos de Clase & Disciplinas</h1>
          <p>Configuración de las actividades grupales ofrecidas en las salas de la cadena (Módulo M3)</p>
        </div>
        <div className="header-controls">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Nueva Disciplina
          </button>
        </div>
      </header>

      {/* METRICAS */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Disciplinas Activas</span>
            <span>🏃</span>
          </div>
          <div className="sede-metric-val">{tiposClase.length}</div>
          <div className="sede-metric-sub">
            <span>Disponibles para armar agenda (RF-06)</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Duración Promedio</span>
            <span>⏱️</span>
          </div>
          <div className="sede-metric-val">52 min</div>
          <div className="sede-metric-sub">
            <span>Franjas estándar de entrenamiento</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Cupo Recomendado</span>
            <span>👥</span>
          </div>
          <div className="sede-metric-val">16 personas</div>
          <div className="sede-metric-sub">
            <span>Control de aforo por sala</span>
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
              placeholder="Buscar por disciplina o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterIntensidad}
            onChange={(e) => setFilterIntensidad(e.target.value)}
          >
            <option value="Todas">Todas las Intensidades</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Extrema">Extrema</option>
          </select>
        </div>
      </div>

      {/* GRILLA DE DISCIPLINAS */}
      <div className="catalog-grid">
        {filtered.map((tipo) => {
          const intensidadColor =
            tipo.intensidad === "Extrema"
              ? "var(--accent-red)"
              : tipo.intensidad === "Alta"
              ? "var(--accent-orange)"
              : tipo.intensidad === "Media"
              ? "var(--accent-yellow)"
              : "var(--accent-green)";

          return (
            <div key={tipo.id} className="catalog-card">
              <div>
                <div className="catalog-card-header">
                  <div>
                    <span className="catalog-subtitle">{tipo.disciplina}</span>
                    <h3 className="catalog-title" style={{ marginTop: "0.2rem" }}>{tipo.nombre}</h3>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: intensidadColor,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${intensidadColor}`,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    ⚡ {tipo.intensidad}
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.8rem 0" }}>
                  {tipo.descripcion}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem 1rem",
                    fontSize: "0.8rem",
                    padding: "0.75rem 0",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.72rem" }}>Duración</span>
                    <strong>⏱️ {tipo.duracionMin} minutos</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.72rem" }}>Gasto Calórico</span>
                    <strong>🔥 ~{tipo.caloriasAprox} kcal</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.72rem" }}>Cupo Máx. Sugerido</span>
                    <strong>👥 {tipo.cupoMaxSugerido} cupos</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.72rem" }}>Sala Requerida</span>
                    <strong>📍 {tipo.salaRequerida}</strong>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                    Equipamiento Provisto:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {tipo.equipamiento.map((eq, idx) => (
                      <span key={idx} className="sede-service-chip">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="catalog-card-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.8rem" }}
                  onClick={() => setSelectedTipo(tipo)}
                >
                  Ver Ficha Detallada
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
              <h3 className="sede-modal-title">{selectedTipo.nombre}</h3>
              <button className="sede-modal-close" onClick={() => setSelectedTipo(null)}>
                ✕
              </button>
            </div>
            <div className="sede-modal-body">
              <span className="catalog-subtitle">{selectedTipo.disciplina}</span>
              <p style={{ fontSize: "0.9rem", color: "var(--text-pure)", lineHeight: "1.5" }}>
                {selectedTipo.descripcion}
              </p>

              <div className="price-highlight-box">
                <div>
                  <span className="price-period-label">Intensidad</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-orange)" }}>
                    {selectedTipo.intensidad}
                  </div>
                </div>
                <div>
                  <span className="price-period-label">Duración</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{selectedTipo.duracionMin} min</div>
                </div>
                <div>
                  <span className="price-period-label">Calorías quemadas</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>~{selectedTipo.caloriasAprox} kcal</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Espacio y Equipamiento:
                </span>
                <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedTipo.salaRequerida}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.4rem" }}>
                  {selectedTipo.equipamiento.map((eq, idx) => (
                    <span key={idx} className="sede-service-chip">
                      ✓ {eq}
                    </span>
                  ))}
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

      {/* MODAL NUEVA DISCIPLINA */}
      {showModal && (
        <div className="sede-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Crear Nuevo Tipo de Clase (C-05)</h3>
              <button className="sede-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTipo}>
              <div className="sede-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Nombre de la Actividad *
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      placeholder="Ej. Funcional HIIT Extremo"
                      value={newNombre}
                      onChange={(e) => setNewNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Disciplina / Categoría
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newDisciplina}
                      onChange={(e) => setNewDisciplina(e.target.value)}
                    >
                      <option value="Cardio / Resistencia">Cardio / Resistencia</option>
                      <option value="Fuerza & Acondicionamiento">Fuerza & Acondicionamiento</option>
                      <option value="Mente y Cuerpo">Mente y Cuerpo</option>
                      <option value="Combate Funcional">Combate Funcional</option>
                      <option value="Acuática / Bajo Impacto">Acuática / Bajo Impacto</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Intensidad
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newIntensidad}
                      onChange={(e) => setNewIntensidad(e.target.value as any)}
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Extrema">Extrema</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Duración (Minutos)
                    </label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      value={newDuracion}
                      onChange={(e) => setNewDuracion(Number(e.target.value))}
                      min="30"
                      max="120"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Cupo Máximo Sugerido
                    </label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      value={newCupo}
                      onChange={(e) => setNewCupo(Number(e.target.value))}
                      min="5"
                      max="50"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Calorías Estimadas (kcal)
                    </label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      value={newCalorias}
                      onChange={(e) => setNewCalorias(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Sala / Área Requerida
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    value={newSala}
                    onChange={(e) => setNewSala(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Descripción
                  </label>
                  <textarea
                    className="search-input"
                    style={{ width: "100%", padding: "0.7rem 1rem", height: "70px", resize: "none" }}
                    placeholder="Breve resumen de la clase..."
                    value={newDescripcion}
                    onChange={(e) => setNewDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="sede-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
