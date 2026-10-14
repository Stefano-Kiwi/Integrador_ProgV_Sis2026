import { useState } from "react";
import "../../admin.css";

type SportType = "padel" | "futbol5" | "tenis";

type SlotState = "libre" | "ocupado" | "mantenimiento" | "horario_pico";

interface TimeSlot {
  hora: string;
  estado: SlotState;
  precio: number;
  reservadoPor?: string;
  motivoMantenimiento?: string;
}

interface CourtData {
  id: string;
  nombre: string;
  superficie: string;
  enMantenimiento: boolean;
  motivo?: string;
  turnos: TimeSlot[];
}

const COURTS_DATA: Record<SportType, CourtData[]> = {
  padel: [
    {
      id: "PAD-1",
      nombre: "Cancha Pádel 1 (Vidrio Panorámico)",
      superficie: "Césped Sintético Azul",
      enMantenimiento: false,
      turnos: [
        { hora: "16:00", estado: "libre", precio: 12000 },
        { hora: "17:30", estado: "ocupado", precio: 12000, reservadoPor: "Mateo Silva (Socio Activo)" },
        { hora: "19:00", estado: "horario_pico", precio: 14400, reservadoPor: "Esteban Rojas (Tarifa Pico +20%)" },
        { hora: "20:30", estado: "horario_pico", precio: 14400 },
        { hora: "22:00", estado: "libre", precio: 12000 },
      ],
    },
    {
      id: "PAD-2",
      nombre: "Cancha Pádel 2 (Vidrio Estándar)",
      superficie: "Césped Sintético Verde",
      enMantenimiento: true,
      motivo: "Reemplazo de paño de red y ajuste de vidrio perimetral",
      turnos: [
        { hora: "16:00", estado: "mantenimiento", precio: 0, motivoMantenimiento: "Bloqueo técnico" },
        { hora: "17:30", estado: "mantenimiento", precio: 0, motivoMantenimiento: "Bloqueo técnico" },
        { hora: "19:00", estado: "mantenimiento", precio: 0, motivoMantenimiento: "Bloqueo técnico" },
        { hora: "20:30", estado: "mantenimiento", precio: 0, motivoMantenimiento: "Bloqueo técnico" },
        { hora: "22:00", estado: "mantenimiento", precio: 0, motivoMantenimiento: "Bloqueo técnico" },
      ],
    },
    {
      id: "PAD-3",
      nombre: "Cancha Pádel 3 (Muro Tradicional)",
      superficie: "Cemento Poroso",
      enMantenimiento: false,
      turnos: [
        { hora: "16:00", estado: "ocupado", precio: 10000, reservadoPor: "Constanza Rivas" },
        { hora: "17:30", estado: "libre", precio: 10000 },
        { hora: "19:00", estado: "horario_pico", precio: 12000 },
        { hora: "20:30", estado: "ocupado", precio: 12000, reservadoPor: "Torneo Interno FitZone" },
        { hora: "22:00", estado: "libre", precio: 10000 },
      ],
    },
  ],
  futbol5: [
    {
      id: "FUT-1",
      nombre: "Cancha Fútbol 5 - Estadio Central",
      superficie: "Césped FIFA Pro con caucho",
      enMantenimiento: false,
      turnos: [
        { hora: "17:00", estado: "libre", precio: 22000 },
        { hora: "18:30", estado: "ocupado", precio: 22000, reservadoPor: "Equipo Los Galácticos" },
        { hora: "20:00", estado: "horario_pico", precio: 26400, reservadoPor: "Torneo Empresarial (+20%)" },
        { hora: "21:30", estado: "horario_pico", precio: 26400 },
      ],
    },
    {
      id: "FUT-2",
      nombre: "Cancha Fútbol 5 - Auxiliar Techada",
      superficie: "Césped Sintético 45mm",
      enMantenimiento: false,
      turnos: [
        { hora: "17:00", estado: "libre", precio: 20000 },
        { hora: "18:30", estado: "libre", precio: 20000 },
        { hora: "20:00", estado: "horario_pico", precio: 24000 },
        { hora: "21:30", estado: "ocupado", precio: 24000, reservadoPor: "Lucas Benítez (Externo)" },
      ],
    },
  ],
  tenis: [
    {
      id: "TEN-1",
      nombre: "Cancha Tenis 1 - Polvo de Ladrillo",
      superficie: "Tierra Batida Roja",
      enMantenimiento: false,
      turnos: [
        { hora: "16:00", estado: "libre", precio: 15000 },
        { hora: "17:30", estado: "ocupado", precio: 15000, reservadoPor: "Prof. Ricardo Garín" },
        { hora: "19:00", estado: "horario_pico", precio: 18000 },
        { hora: "20:30", estado: "libre", precio: 18000 },
      ],
    },
  ],
};

export default function AdminCanchas() {
  const [activeSport, setActiveSport] = useState<SportType>("padel");
  const [courts, setCourts] = useState<Record<SportType, CourtData[]>>(COURTS_DATA);

  // Modal Mantenimiento
  const [showMantenimientoModal, setShowMantenimientoModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [motivoMantenimiento, setMotivoMantenimiento] = useState("Ajuste de red y vidrio perimetral");

  // Modal Detalle Turno
  const [selectedSlot, setSelectedSlot] = useState<{ courtName: string; slot: TimeSlot } | null>(null);

  const currentCourts = courts[activeSport];

  const handleToggleMantenimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourtId) return;

    setCourts((prev) => {
      const updated = { ...prev };
      updated[activeSport] = updated[activeSport].map((c) => {
        if (c.id !== selectedCourtId) return c;
        const newEnMant = !c.enMantenimiento;
        return {
          ...c,
          enMantenimiento: newEnMant,
          motivo: newEnMant ? motivoMantenimiento : undefined,
          turnos: c.turnos.map((t) => ({
            ...t,
            estado: newEnMant ? ("mantenimiento" as SlotState) : ("libre" as SlotState),
          })),
        };
      });
      return updated;
    });

    setShowMantenimientoModal(false);
  };

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Control de Canchas Deportivas</h1>
          <p>Grilla de disponibilidad con estados dinámicos, tarifas pico y mantenimiento preventivo</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Sede Las Condes
          </button>
        </div>
      </header>

      {/* LEYENDA DE ESTADOS DE LA GRILLA */}
      <div className="grid-legend-bar">
        <span className="legend-title">Estados de Turno:</span>
        <div className="legend-item">
          <span className="legend-badge badge-libre">● Libre ($12.000)</span>
          <span className="legend-sub">Disponible reserva</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge badge-pico">⚡ Horario Pico ($14.400)</span>
          <span className="legend-sub">+20% Recargo (19-21h)</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge badge-ocupado">■ Ocupado</span>
          <span className="legend-sub">Turno reservado</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge badge-mantenimiento">✕ Mantenimiento</span>
          <span className="legend-sub">Bloqueo técnico</span>
        </div>
      </div>

      {/* LAYOUT: Grilla y Configuración */}
      <div className="courts-layout">
        {/* GRILLA DE TURNOS */}
        <section className="grid-section">
          <div className="grid-header">
            <h2 className="config-title" style={{ margin: 0 }}>Grilla de Turnos por Cancha</h2>
            <div className="tabs-group">
              <button
                className={`tab-btn ${activeSport === "padel" ? "active" : ""}`}
                onClick={() => setActiveSport("padel")}
              >
                Pádel (3)
              </button>
              <button
                className={`tab-btn ${activeSport === "futbol5" ? "active" : ""}`}
                onClick={() => setActiveSport("futbol5")}
              >
                Fútbol 5 (2)
              </button>
              <button
                className={`tab-btn ${activeSport === "tenis" ? "active" : ""}`}
                onClick={() => setActiveSport("tenis")}
              >
                Tenis (1)
              </button>
            </div>
            <span className="grid-date">Miércoles, 14 de Octubre</span>
          </div>

          <div className="courts-list">
            {currentCourts.map((court) => (
              <div key={court.id} className="court-row">
                <div className="court-header">
                  <div>
                    <span className="court-title">{court.nombre}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      Superficie: {court.superficie}
                    </div>
                  </div>
                  {court.enMantenimiento ? (
                    <span className="status-badge status-inactive">Mantenimiento</span>
                  ) : (
                    <span className="status-badge status-active">Operativa</span>
                  )}
                </div>

                {court.enMantenimiento ? (
                  <div className="maintenance-box">
                    <div className="maintenance-icon">🔧</div>
                    <div>
                      <strong>Cancha bloqueada temporalmente:</strong>
                      <p className="maintenance-msg" style={{ margin: 0 }}>{court.motivo}</p>
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ marginLeft: "auto", fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
                      onClick={() => {
                        setSelectedCourtId(court.id);
                        setShowMantenimientoModal(true);
                      }}
                    >
                      Levantar Bloqueo
                    </button>
                  </div>
                ) : (
                  <div className="time-slots">
                    {court.turnos.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-slot slot-${slot.estado}`}
                        onClick={() => setSelectedSlot({ courtName: court.nombre, slot })}
                      >
                        <span className="slot-hour">{slot.hora}</span>
                        {slot.estado === "libre" && (
                          <span className="slot-info">${slot.precio.toLocaleString()}</span>
                        )}
                        {slot.estado === "horario_pico" && (
                          <span className="slot-info">⚡ ${slot.precio.toLocaleString()}</span>
                        )}
                        {slot.estado === "ocupado" && (
                          <span className="slot-info">Ocupado</span>
                        )}
                        {slot.estado === "mantenimiento" && (
                          <span className="slot-info">En Pausa</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PANEL DE CONFIGURACIÓN Y MANTENIMIENTO */}
        <aside className="config-section">
          <h2 className="config-title" style={{ margin: 0 }}>Configuración de Canchas</h2>

          {/* Esquema Tarifario */}
          <div className="pricing-card">
            <div className="pricing-header">Esquema Tarifario Activo</div>
            <div className="pricing-row">
              <span className="pricing-label">Tarifa Base (Pádel)</span>
              <span className="pricing-val">$12,000 / h</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-label">Descuento Socio</span>
              <span className="pricing-val val-green">- 15% ($10,200 / h)</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-label">Recargo Hora Pico</span>
              <span className="pricing-val val-yellow">+ 20% ($14,400 / h)</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-label">Rango Pico Configurado</span>
              <span className="pricing-val">19:00 - 21:30 h</span>
            </div>
          </div>

          {/* Mantenimiento Preventivo */}
          <div className="maintenance-block">
            <div className="maintenance-header">Mantenimiento Preventivo</div>
            <p className="maintenance-desc">
              Utiliza este módulo para programar inspecciones o bloquear temporalmente turnos de juego por reparaciones de red o cristales.
            </p>
            <button
              type="button"
              className="btn-outline-red"
              onClick={() => {
                setSelectedCourtId(currentCourts[0]?.id || "");
                setShowMantenimientoModal(true);
              }}
            >
              Gestionar Bloqueo de Cancha
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL MANTENIMIENTO */}
      {showMantenimientoModal && (
        <div className="modal-backdrop" onClick={() => setShowMantenimientoModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Módulo de Mantenimiento</h2>
              <button className="modal-close-btn" onClick={() => setShowMantenimientoModal(false)}>✕</button>
            </div>
            <form onSubmit={handleToggleMantenimiento}>
              <div className="form-group">
                <label>Seleccionar Cancha *</label>
                <select
                  className="form-control"
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                >
                  {currentCourts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.enMantenimiento ? "(Actualmente en Mantenimiento)" : "(Operativa)"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Motivo Técnico / Trabajo a Realizar *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={motivoMantenimiento}
                  onChange={(e) => setMotivoMantenimiento(e.target.value)}
                  placeholder="ej. Reparación de red tensora o reposición de paño"
                />
              </div>
              <div className="form-group">
                <label>Tiempo Estimado de Indisponibilidad</label>
                <select className="form-control">
                  <option>Jornada Completa (Bloqueo Total)</option>
                  <option>Turno de Mañana (08:00 - 14:00)</option>
                  <option>Turno de Tarde (14:00 - 20:00)</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowMantenimientoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "var(--accent-red)" }}>
                  Aplicar Estado de Mantenimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE TURNO */}
      {selectedSlot && (
        <div className="modal-backdrop" onClick={() => setSelectedSlot(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Turno — {selectedSlot.slot.hora} h</h2>
              <button className="modal-close-btn" onClick={() => setSelectedSlot(null)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Cancha:</span>
                <strong>{selectedSlot.courtName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Estado:</span>
                <span className={`legend-badge badge-${selectedSlot.slot.estado}`}>
                  {selectedSlot.slot.estado.toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Tarifa Hardcodeada:</span>
                <strong>${selectedSlot.slot.precio.toLocaleString()}</strong>
              </div>
              {selectedSlot.slot.reservadoPor && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Titular de Reserva:</span>
                  <span style={{ color: "var(--accent-orange)", fontWeight: 700 }}>
                    {selectedSlot.slot.reservadoPor}
                  </span>
                </div>
              )}
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setSelectedSlot(null)}>
                Cerrar
              </button>
              {selectedSlot.slot.estado === "libre" && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    alert(`Turno de ${selectedSlot.slot.hora} reservado con éxito.`);
                    setSelectedSlot(null);
                  }}
                >
                  Confirmar Reserva Rápida
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

