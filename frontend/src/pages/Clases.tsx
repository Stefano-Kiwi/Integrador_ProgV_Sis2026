import { Link } from "react-router-dom";

export default function Clases() {
  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        {/* Encabezado de la Vista */}
        <header className="profile-page-header">
          <h1 className="profile-page-title">
            CLASES <span className="highlight">GRUPALES</span>
          </h1>
          <p className="profile-page-subtitle">
            Explora el cronograma semanal y asegura tu cupo en entrenamientos
            guiados por profesionales certificados.
          </p>
        </header>

        {/* Barra de Días y Filtros por Disciplina */}
        <div className="filter-controls-bar">
          <div className="days-row">
            <a href="#hoy" className="day-tab active">
              <span className="day-tab-name">JUE</span>
              <span className="day-tab-num">24</span>
            </a>
            <a href="#viernes" className="day-tab">
              <span className="day-tab-name">VIE</span>
              <span className="day-tab-num">25</span>
            </a>
            <a href="#sabado" className="day-tab">
              <span className="day-tab-name">SÁB</span>
              <span className="day-tab-num">26</span>
            </a>
            <a href="#domingo" className="day-tab">
              <span className="day-tab-name">DOM</span>
              <span className="day-tab-num">27</span>
            </a>
            <a href="#lunes" className="day-tab">
              <span className="day-tab-name">LUN</span>
              <span className="day-tab-num">28</span>
            </a>
            <a href="#martes" className="day-tab">
              <span className="day-tab-name">MAR</span>
              <span className="day-tab-num">29</span>
            </a>
          </div>
        </div>

        {/* Grilla Principal Modular (2 Columnas: Listado y Panel Lateral) */}
        <div className="profile-main-grid">
          {/* Columna Izquierda: Cronograma del Día */}
          <div className="profile-column">
            <div className="classes-card-list">
              {/* Clase 1: Spinning Power HIIT */}
              <article className="class-detailed-card">
                <div className="class-card-main">
                  <div className="class-time-badge">
                    <span className="class-time-hour">19:00</span>
                    <span className="class-time-duration">45 min</span>
                  </div>
                  <div className="class-info-block">
                    <span className="class-type-badge">Cardio HIIT</span>
                    <h2 className="class-name-title">SPINNING POWER HIIT</h2>
                    <div className="class-details-sub">
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Coach Sofía Pérez
                      </span>
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        Sala de Ciclismo 1
                      </span>
                    </div>
                  </div>
                </div>

                <div className="capacity-block">
                  <span className="capacity-text">4 cupos libres (21/25)</span>
                  <div className="capacity-bar">
                    <div className="capacity-fill" style={{ width: "84%" }} />
                  </div>
                  <Link
                    to="/profile"
                    className="btn-reserve-class"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <span>RESERVAR CUPO</span>
                  </Link>
                </div>
              </article>

              {/* Clase 2: Cross Training Pro */}
              <article className="class-detailed-card">
                <div className="class-card-main">
                  <div className="class-time-badge">
                    <span className="class-time-hour">20:00</span>
                    <span className="class-time-duration">60 min</span>
                  </div>
                  <div className="class-info-block">
                    <span
                      className="class-type-badge"
                      style={{
                        color: "var(--accent-orange)",
                        borderColor: "rgba(255, 94, 58, 0.3)",
                      }}
                    >
                      Fuerza Extrema
                    </span>
                    <h2 className="class-name-title">CROSS TRAINING PRO WOD</h2>
                    <div className="class-details-sub">
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Coach Marcos Galván
                      </span>
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        Box Central Fit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="capacity-block">
                  <span className="capacity-text">2 cupos libres (18/20)</span>
                  <div className="capacity-bar">
                    <div className="capacity-fill" style={{ width: "90%" }} />
                  </div>
                  <Link
                    to="/profile"
                    className="btn-reserve-class"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <span>RESERVAR CUPO</span>
                  </Link>
                </div>
              </article>

              {/* Clase 3: Power Yoga & Flex */}
              <article className="class-detailed-card">
                <div className="class-card-main">
                  <div className="class-time-badge">
                    <span className="class-time-hour">09:00</span>
                    <span className="class-time-duration">50 min</span>
                  </div>
                  <div className="class-info-block">
                    <span className="class-type-badge">Relax & Flex</span>
                    <h2 className="class-name-title">POWER YOGA & MOBILITY</h2>
                    <div className="class-details-sub">
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Coach Camila Ramos
                      </span>
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        Sala Zen & Pilates
                      </span>
                    </div>
                  </div>
                </div>

                <div className="capacity-block">
                  <span className="capacity-text">8 cupos libres (10/18)</span>
                  <div className="capacity-bar">
                    <div className="capacity-fill" style={{ width: "55%" }} />
                  </div>
                  <Link
                    to="/profile"
                    className="btn-reserve-class"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <span>RESERVAR CUPO</span>
                  </Link>
                </div>
              </article>

              {/* Clase 4: Boxing Conditioning */}
              <article className="class-detailed-card">
                <div className="class-card-main">
                  <div
                    className="class-time-badge"
                    style={{
                      borderColor: "rgba(255, 94, 58, 0.3)",
                      color: "var(--accent-orange)",
                      background: "rgba(255, 94, 58, 0.08)",
                    }}
                  >
                    <span className="class-time-hour">18:00</span>
                    <span className="class-time-duration">55 min</span>
                  </div>
                  <div className="class-info-block">
                    <span className="class-type-badge">Combate</span>
                    <h2 className="class-name-title">BOXING CONDITIONING</h2>
                    <div className="class-details-sub">
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Coach Diego "Toro" Rossi
                      </span>
                      <span className="class-detail-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        Sector Ring & Sacos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="capacity-block">
                  <span
                    className="capacity-text"
                    style={{ color: "var(--accent-orange)" }}
                  >
                    Cupo Completo (15/15)
                  </span>
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <a
                    href="#espera"
                    className="btn-reserve-class btn-waitlist"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <span>LISTA DE ESPERA (2)</span>
                  </a>
                </div>
              </article>
            </div>
          </div>

          {/* Columna Derecha: Tus Reservas, Instructores y Políticas */}
          <div className="profile-column">
            {/* Mis Reservas Activas (Sincronizado con profile.html) */}
            <section
              className="profile-section-card"
              aria-labelledby="card-my-classes"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h2 id="card-my-classes">TUS CLASES RESERVADAS</h2>
                </div>
                <span className="card-title-badge">2 Confirmadas</span>
              </div>

              <div className="classes-list">
                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">HOY</span>
                      <span className="class-time-hour">19:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Spinning Power HIIT</div>
                      <div className="class-meta">
                        Sala de Ciclismo 1 • Sofía Pérez
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>

                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">JUE</span>
                      <span className="class-time-hour">20:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Cross Training Pro</div>
                      <div className="class-meta">
                        Box Central • Marcos Galván
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>
              </div>

              <Link
                to="/profile"
                className="slot-btn"
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  marginTop: "0.5rem",
                  textDecoration: "none",
                }}
              >
                Ver Ficha en Perfil
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
