import { Link } from "react-router-dom";

export default function Canchas() {
  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        {/* Encabezado de la Sección */}
        <header className="profile-page-header">
          <h1 className="profile-page-title">
            CANCHAS <span className="highlight">DEPORTIVAS</span>
          </h1>
        </header>

        {/* Grilla Principal Modular (2 Columnas: Listado y Sidebar) */}
        <div className="profile-main-grid">
          {/* Columna Izquierda: Listado de Canchas Disponibles */}
          <div className="profile-column">
            <div className="courts-grid">
              {/* Cancha 1 */}
              <article className="court-card" id="cancha-padel-1">
                <div className="court-card-header">
                  <div>
                    <div className="court-meta-group">
                      <span className="court-badge-type">Cancha 1</span>
                      <span className="status-badge-active">● DISPONIBLE</span>
                    </div>
                  </div>
                  <div className="court-pricing">
                    <div className="price-val">$18.500</div>
                    <div className="price-unit">Por Turno (90 min)</div>
                  </div>
                </div>

                <div className="court-slots-section">
                  <span className="slots-title">
                    Selecciona un horario disponible para hoy:
                  </span>
                  <div className="slots-row">
                    <a href="#reservar" className="slot-btn">
                      14:00 - 15:30
                    </a>
                    <a href="#reservar" className="slot-btn selected">
                      15:30 - 17:00
                    </a>
                    <span className="slot-btn disabled" title="Horario Ocupado">
                      17:00 - 18:30
                    </span>
                    <a href="#reservar" className="slot-btn">
                      18:30 - 20:00
                    </a>
                    <a href="#reservar" className="slot-btn">
                      20:00 - 21:30
                    </a>
                    <span className="slot-btn disabled" title="Horario Ocupado">
                      21:30 - 23:00
                    </span>
                  </div>
                </div>

                <div className="court-actions-row">
                  <Link to="/pagos" className="court-reserve-btn">
                    <span>CONFIRMAR RESERVA</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      width="16"
                      height="16"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>

              {/* Cancha 2 */}
              <article className="court-card" id="cancha-futbol-1">
                <div className="court-card-header">
                  <div>
                    <div className="court-meta-group">
                      <span className="court-badge-type football">Cancha 2</span>
                      <span className="status-badge-active">● DISPONIBLE</span>
                    </div>
                    <h2 className="court-name" style={{ marginTop: "0.5rem" }}>
                      CANCHA 2
                    </h2>
                  </div>
                  <div className="court-pricing">
                    <div className="price-val">$32.000</div>
                    <div className="price-unit">Por Turno (60 min)</div>
                  </div>
                </div>

                <div className="court-slots-section">
                  <span className="slots-title">
                    Selecciona un horario disponible para hoy:
                  </span>
                  <div className="slots-row">
                    <span className="slot-btn disabled">17:00 - 18:00</span>
                    <a href="#reservar" className="slot-btn">
                      18:00 - 19:00
                    </a>
                    <span className="slot-btn disabled">19:00 - 20:00</span>
                    <span className="slot-btn disabled">20:00 - 21:00</span>
                    <a href="#reservar" className="slot-btn">
                      21:00 - 22:00
                    </a>
                    <a href="#reservar" className="slot-btn">
                      22:00 - 23:00
                    </a>
                  </div>
                </div>

                <div className="court-actions-row">
                  <Link to="/pagos" className="court-reserve-btn">
                    <span>CONFIRMAR RESERVA</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      width="16"
                      height="16"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>

              {/* Cancha 3 */}
              <article className="court-card" id="cancha-tenis-1">
                <div className="court-card-header">
                  <div>
                    <div className="court-meta-group">
                      <span className="court-badge-type">Cancha 3</span>
                      <span className="status-badge-active">● DISPONIBLE</span>
                    </div>
                    <h2 className="court-name" style={{ marginTop: "0.5rem" }}>
                      CANCHA 3
                    </h2>
                  </div>
                  <div className="court-pricing">
                    <div className="price-val">$16.000</div>
                    <div className="price-unit">Por Turno (60 min)</div>
                  </div>
                </div>

                <div className="court-slots-section">
                  <span className="slots-title">
                    Selecciona un horario disponible para hoy:
                  </span>
                  <div className="slots-row">
                    <a href="#reservar" className="slot-btn">
                      08:00 - 09:00
                    </a>
                    <a href="#reservar" className="slot-btn">
                      10:00 - 11:00
                    </a>
                    <a href="#reservar" className="slot-btn">
                      15:00 - 16:00
                    </a>
                    <a href="#reservar" className="slot-btn">
                      16:00 - 17:00
                    </a>
                    <span className="slot-btn disabled">17:00 - 18:00</span>
                  </div>
                </div>

                <div className="court-actions-row">
                  <Link to="/pagos" className="court-reserve-btn">
                    <span>CONFIRMAR RESERVA</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      width="16"
                      height="16"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            </div>
          </div>

          {/* Columna Derecha: Reserva Activa del Usuario, Reglas y Accesorios */}
          <div className="profile-column">
            {/* Tu Reserva Confirmada */}
            <section
              className="active-reservation-card"
              aria-labelledby="card-my-booking"
            >
              <div
                className="card-title-group"
                style={{ borderBottomColor: "rgba(0, 255, 135, 0.2)" }}
              >
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                  <h2 id="card-my-booking">TU PRÓXIMO TURNO</h2>
                </div>
                <span className="badge-status confirmed">PAGADO</span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Cancha Asignada
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.45rem",
                    color: "var(--text-pure)",
                    marginTop: "0.2rem",
                  }}
                >
                  CANCHA 3
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--accent-neon)",
                    fontWeight: 600,
                    marginTop: "0.35rem",
                  }}
                >
                  Sábado 27 Sep, 17:00 hs (90 min)
                </div>
              </div>

              <div>
                <span className="data-label">Código QR / PIN de Apertura:</span>
                <div className="res-code-badge" style={{ marginTop: "0.4rem" }}>
                  TG-PADEL-8492
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <Link
                  to="/profile"
                  className="slot-btn"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  Ver en Perfil
                </Link>
                <a
                  href="#cancelar"
                  className="slot-btn"
                  style={{
                    color: "var(--accent-orange)",
                    borderColor: "rgba(255, 94, 58, 0.3)",
                  }}
                >
                  Cancelar
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
