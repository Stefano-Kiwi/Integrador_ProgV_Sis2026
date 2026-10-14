import { useState } from "react";
import { INITIAL_PLANES, type PlanMembresiaItem } from "../../data/catalogosData";
import "./AdminCatalogos.css";

export default function AdminPlanes() {
  const [planes, setPlanes] = useState<PlanMembresiaItem[]>(INITIAL_PLANES);
  const [filterPeriodicidad, setFilterPeriodicidad] = useState("Todas");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanMembresiaItem | null>(null);

  // Form nuevo plan
  const [newNombre, setNewNombre] = useState("");
  const [newPeriodicidad, setNewPeriodicidad] = useState<"Mensual" | "Trimestral" | "Anual" | "Diario">("Mensual");
  const [newPrecio, setNewPrecio] = useState(30000);
  const [newDescuento, setNewDescuento] = useState(15);
  const [newBeneficio, setNewBeneficio] = useState("");

  const filtered = planes.filter((p) => {
    return filterPeriodicidad === "Todas" || p.periodicidad === filterPeriodicidad;
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) {
      alert("Por favor completa el nombre del plan.");
      return;
    }

    const nuevo: PlanMembresiaItem = {
      id: `PLAN-${planes.length + 10}`,
      nombre: newNombre,
      periodicidad: newPeriodicidad,
      precio: Number(newPrecio),
      popular: false,
      beneficios: [
        "Acceso multi-sede sin restricciones (RF-03)",
        `${newDescuento}% de descuento en canchas de Paddle y Fútbol 5`,
        "Clases grupales regulares incluidas",
        newBeneficio || "Credencial QR dinámico en App móvil",
      ],
      sedesAcceso: "Multi-Sede Total (25+ Sedes)",
      descuentoCanchas: Number(newDescuento),
      sociosInscriptos: 0,
      estado: "Activo",
    };

    setPlanes([...planes, nuevo]);
    setShowModal(false);
    setNewNombre("");
    setNewBeneficio("");
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo PL-01
            </span>
          </div>
          <h1>Catálogo de Planes de Membresía</h1>
          <p>Configuración de suscripciones, periodicidades, tarifas y beneficios multi-sede (Módulo M1 / RF-02)</p>
        </div>
        <div className="header-controls">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Plan de Membresía
          </button>
        </div>
      </header>

      {/* METRICAS */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Planes Activos</span>
            <span>💳</span>
          </div>
          <div className="sede-metric-val">{planes.length}</div>
          <div className="sede-metric-sub">
            <span>Anuales, Trimestrales y Mensuales</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Socios Suscriptos</span>
            <span>👥</span>
          </div>
          <div className="sede-metric-val">
            {planes.reduce((acc, p) => acc + p.sociosInscriptos, 0).toLocaleString()}
          </div>
          <div className="sede-metric-sub">
            <span>Distribución en toda la red</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Acceso Multi-Sede (RF-03)</span>
            <span>🌐</span>
          </div>
          <div className="sede-metric-val">100%</div>
          <div className="sede-metric-sub">
            <span>Interoperabilidad libre entre ciudades</span>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="action-bar">
        <div className="action-group-left">
          <select
            className="filter-select"
            value={filterPeriodicidad}
            onChange={(e) => setFilterPeriodicidad(e.target.value)}
          >
            <option value="Todas">Todas las Periodicidades</option>
            <option value="Anual">Anual</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Mensual">Mensual</option>
            <option value="Diario">Pase Diario</option>
          </select>
        </div>
      </div>

      {/* GRILLA DE PLANES */}
      <div className="catalog-grid">
        {filtered.map((plan) => {
          return (
            <div
              key={plan.id}
              className={`catalog-card ${plan.popular ? "card-popular-border" : ""}`}
            >
              {plan.popular && <div className="popular-ribbon">MÁS POPULAR</div>}

              <div>
                <div className="catalog-card-header">
                  <div>
                    <span className="catalog-subtitle">Membresía {plan.periodicidad}</span>
                    <h3 className="catalog-title" style={{ marginTop: "0.2rem" }}>{plan.nombre}</h3>
                  </div>
                </div>

                <div className="price-highlight-box" style={{ margin: "1rem 0" }}>
                  <div>
                    <span className="price-period-label">Inversión ({plan.periodicidad})</span>
                    <div className="price-big-number">${plan.precio.toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--accent-green)", fontWeight: 700 }}>
                    {plan.sedesAcceso}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    Beneficios & Cobertura:
                  </div>
                  <ul className="catalog-feature-list">
                    {plan.beneficios.map((ben, idx) => (
                      <li key={idx} className="catalog-feature-item">
                        <span className="catalog-feature-bullet">✓</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.6rem" }}>
                  👥 <strong>{plan.sociosInscriptos.toLocaleString()} socios</strong> activos en este plan
                </div>
              </div>

              <div className="catalog-card-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.8rem" }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Configuración Comercial
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALLE DE PLAN */}
      {selectedPlan && (
        <div className="sede-modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Ficha Comercial: {selectedPlan.nombre}</h3>
              <button className="sede-modal-close" onClick={() => setSelectedPlan(null)}>
                ✕
              </button>
            </div>
            <div className="sede-modal-body">
              <span className="catalog-subtitle">Periodicidad: {selectedPlan.periodicidad}</span>
              <div className="price-big-number" style={{ color: "var(--accent-orange)" }}>
                ${selectedPlan.precio.toLocaleString()}
              </div>

              <div className="sede-aforo-box">
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Regla de Negocio RN-03:</span>
                <p style={{ fontSize: "0.85rem", color: "var(--text-pure)", marginTop: "0.3rem" }}>
                  Los socios activos con este plan acceden al 15% de descuento en alquiler de canchas. Si su cuota entra en mora/vencimiento, el sistema bloquea reservas con descuento y cobrará precio externo.
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Cobertura completa:
                </span>
                <ul className="catalog-feature-list">
                  {selectedPlan.beneficios.map((b, i) => (
                    <li key={i} className="catalog-feature-item">
                      <span className="catalog-feature-bullet">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sede-modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedPlan(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO PLAN */}
      {showModal && (
        <div className="sede-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Crear Plan de Membresía (PL-01)</h3>
              <button className="sede-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="sede-modal-body">
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Nombre del Plan *
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    placeholder="Ej. Plan Semestral Full"
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Periodicidad
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newPeriodicidad}
                      onChange={(e) => setNewPeriodicidad(e.target.value as any)}
                    >
                      <option value="Mensual">Mensual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Anual">Anual</option>
                      <option value="Diario">Diario</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Precio ($) *
                    </label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      value={newPrecio}
                      onChange={(e) => setNewPrecio(Number(e.target.value))}
                      step="500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Descuento en Alquiler de Canchas (%)
                  </label>
                  <input
                    type="number"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    value={newDescuento}
                    onChange={(e) => setNewDescuento(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Beneficio Destacado Adicional
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    placeholder="Ej. Incluye toalla y casillero privado"
                    value={newBeneficio}
                    onChange={(e) => setNewBeneficio(e.target.value)}
                  />
                </div>
              </div>

              <div className="sede-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
