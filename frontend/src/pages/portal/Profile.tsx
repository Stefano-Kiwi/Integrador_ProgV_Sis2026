import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        {/* Encabezado de la Vista */}
        <header className="profile-page-header">
          <h1 className="profile-page-title">
            PERFIL DE <span className="highlight">USUARIO</span>
          </h1>
          <p className="profile-page-subtitle">
            Ficha general del socio, pase digital y registro de actividades.
          </p>
        </header>

        {/* Cuadro Estático con los Datos del Usuario */}
        <section className="user-account-summary-card" aria-label="Cuadro de datos del usuario">
          <div className="summary-card-header">
            <div className="summary-card-left">
              <svg
                className="summary-card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div>
                <h2 className="summary-card-title">CUADRO DE DATOS DEL USUARIO</h2>
              </div>
            </div>
            <div className="summary-card-actions">
              <span className="summary-badge-id">ID: TG-8492</span>
              <Link to="/perfil/editar" className="summary-edit-link" id="btn-perfil-editar-datos">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Editar datos personales</span>
              </Link>
            </div>
          </div>

          <div className="summary-fields-grid">
            {/* Nombre y Apellido */}
            <div className="summary-field-cell">
              <span className="summary-label">Nombre y Apellido</span>
              <span className="summary-value">Lucas Benítez</span>
            </div>

            {/* Nombre de Usuario */}
            <div className="summary-field-cell">
              <span className="summary-label">Nombre de Usuario</span>
              <span className="summary-value" style={{ color: "var(--accent-neon)" }}>@lucas.benitez</span>
            </div>

            {/* Correo Electrónico */}
            <div className="summary-field-cell">
              <span className="summary-label">Correo Electrónico</span>
              <span className="summary-value">lucas.benitez@eltremendo.com</span>
            </div>

            {/* Rol Dentro del Sistema */}
            <div className="summary-field-cell">
              <span className="summary-label">Rol en el Sistema</span>
              <span className="summary-value">
                <span className="role-tag">Socio Activo (VIP)</span>
              </span>
            </div>

            {/* Estado de la Cuenta */}
            <div className="summary-field-cell">
              <span className="summary-label">Estado de Cuenta</span>
              <span className="summary-value">
                <span className="status-tag">● Al Día / Activa</span>
              </span>
            </div>

            {/* Identificador del Usuario */}
            <div className="summary-field-cell">
              <span className="summary-label">Identificador (ID)</span>
              <span className="summary-value" style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
                TG-8492
              </span>
            </div>
          </div>
        </section>

        {/* Contenedor Modular en Dos Columnas Reorganizadas */}
        <div className="profile-main-grid">
          {/* Columna 1: Información Personal y Registro de Ingresos */}
          <div className="profile-column">
            {/* Sección: Ficha de Datos Personales y de Contacto */}
            <section
              className="profile-section-card"
              aria-labelledby="section-personal-title"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <h2 id="section-personal-title">
                    DATOS PERSONALES Y CONTACTO
                  </h2>
                </div>
                <span className="card-title-badge">Registrado</span>
              </div>

              {/* Grilla de Campos de Datos */}
              <div className="data-fields-grid">
                {/* Nombre Completo */}
                <div className="data-field-item">
                  <span className="data-label">Nombre Completo</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Lucas Benítez</span>
                  </div>
                </div>

                {/* DNI / Identificación */}
                <div className="data-field-item">
                  <span className="data-label">DNI / Documento</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="7" y1="8" x2="17" y2="8" />
                      <line x1="7" y1="12" x2="17" y2="12" />
                      <line x1="7" y1="16" x2="13" y2="16" />
                    </svg>
                    <span>40.892.112</span>
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="data-field-item">
                  <span className="data-label">Correo Electrónico</span>
                  <div className="data-value-box highlight">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>lucas.benitez@eltremendo.com</span>
                  </div>
                </div>

                {/* Teléfono de Contacto */}
                <div className="data-field-item">
                  <span className="data-label">Teléfono de Contacto</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>+54 9 11 4523-9981</span>
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div className="data-field-item">
                  <span className="data-label">Fecha de Nacimiento</span>
                  <div className="data-value-box">
                    <svg
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
                    <span>14 de Agosto, 1997 (29 años)</span>
                  </div>
                </div>

                {/* Grupo Sanguíneo */}
                <div className="data-field-item">
                  <span className="data-label">Grupo Sanguíneo</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span>A+ (Factor Rh Positivo)</span>
                  </div>
                </div>

                {/* Domicilio Declarado (Ancho completo) */}
                <div className="data-field-item full-width">
                  <span className="data-label">Domicilio Habitual</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>
                      Av. Cabildo 2450, Piso 4 B, Ciudad Autónoma de Buenos
                      Aires
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección: Registro de Últimos Ingresos (Molinete) */}
            <section
              className="profile-section-card"
              aria-labelledby="section-checkin-title"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                  <h2 id="section-checkin-title">ÚLTIMOS INGRESOS AL GYM</h2>
                </div>
                <span className="card-title-badge">Torniquete</span>
              </div>

              <div className="checkin-list">
                <div className="checkin-row">
                  <div className="checkin-info">
                    <span className="checkin-dot" />
                    <div>
                      <span className="checkin-time">Hoy, 08:30 hs</span>
                      <span className="checkin-location">
                        {" "}
                        — Sede Central (Molinete 1)
                      </span>
                    </div>
                  </div>
                  <span className="checkin-status">✓ Acceso OK</span>
                </div>

                <div className="checkin-row">
                  <div className="checkin-info">
                    <span className="checkin-dot" />
                    <div>
                      <span className="checkin-time">Ayer, 19:15 hs</span>
                      <span className="checkin-location">
                        {" "}
                        — Sede Belgrano (Molinete 2)
                      </span>
                    </div>
                  </div>
                  <span className="checkin-status">✓ Acceso OK</span>
                </div>

                <div className="checkin-row">
                  <div className="checkin-info">
                    <span className="checkin-dot" />
                    <div>
                      <span className="checkin-time">18 Sep, 07:45 hs</span>
                      <span className="checkin-location">
                        {" "}
                        — Sede Central (Molinete 1)
                      </span>
                    </div>
                  </div>
                  <span className="checkin-status">✓ Acceso OK</span>
                </div>
              </div>
            </section>
          </div>

          {/* Columna 2: Pase Digital, Facturación y Actividades */}
          <div className="profile-column">
            {/* Sección: Pase Digital y Membresía */}
            <section
              className="profile-section-card"
              aria-labelledby="section-pass-title"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <h2 id="section-pass-title">PASE DIGITAL & MEMBRESÍA</h2>
                </div>
                <span className="status-badge-active">● ACTIVO</span>
              </div>

              {/* Maqueta Estética de la Tarjeta Digital */}
              <div className="digital-pass-card">
                <div className="pass-top">
                  <div className="pass-brand">
                    <svg
                      className="brand-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
                    </svg>
                    <span>
                      EL TREMENDO
                      <span style={{ color: "var(--accent-neon)" }}> GYM</span>
                    </span>
                  </div>
                  <div
                    className="pass-chip-icon"
                    title="Chip de Seguridad NFC"
                  />
                </div>

                <div className="pass-middle">
                  <div className="pass-details">
                    <span className="pass-tier-name">PLAN BLACK VIP</span>
                    <span className="pass-number">
                      TG - 8492 - 2026 - PASS
                    </span>
                    <span className="pass-holder">LUCAS BENÍTEZ</span>
                  </div>
                </div>

                {/* Credencial QR Estática para Molinetes */}
                <div className="pass-qr-strip">
                  <div className="pass-qr-left">
                    <div className="pass-qr-thumbnail" title="Código QR de Acceso">
                      <svg viewBox="0 0 100 100" fill="none">
                        <rect width="100" height="100" fill="white" />
                        <rect x="10" y="10" width="24" height="24" fill="#090c10" />
                        <rect x="14" y="14" width="16" height="16" fill="white" />
                        <rect x="18" y="18" width="8" height="8" fill="#090c10" />

                        <rect x="66" y="10" width="24" height="24" fill="#090c10" />
                        <rect x="70" y="14" width="16" height="16" fill="white" />
                        <rect x="74" y="18" width="8" height="8" fill="#090c10" />

                        <rect x="10" y="66" width="24" height="24" fill="#090c10" />
                        <rect x="14" y="70" width="16" height="16" fill="white" />
                        <rect x="18" y="74" width="8" height="8" fill="#090c10" />

                        <rect x="42" y="12" width="6" height="6" fill="#090c10" />
                        <rect x="52" y="18" width="6" height="6" fill="#090c10" />
                        <rect x="42" y="28" width="6" height="6" fill="#090c10" />
                        <rect x="52" y="38" width="6" height="6" fill="#090c10" />
                        <rect x="12" y="42" width="6" height="6" fill="#090c10" />
                        <rect x="24" y="52" width="6" height="6" fill="#090c10" />
                        <rect x="40" y="52" width="8" height="8" fill="#090c10" />
                        <rect x="68" y="42" width="6" height="6" fill="#090c10" />
                        <rect x="80" y="52" width="8" height="6" fill="#090c10" />
                        <rect x="44" y="70" width="6" height="6" fill="#090c10" />
                        <rect x="56" y="66" width="8" height="6" fill="#090c10" />
                        <rect x="74" y="74" width="10" height="8" fill="#090c10" />
                        <rect x="62" y="82" width="6" height="8" fill="#090c10" />
                      </svg>
                    </div>
                    <div className="pass-qr-meta">
                      <span className="pass-qr-title">Credencial QR de Acceso</span>
                      <span className="pass-qr-desc">Escanea en el molinete para ingresar</span>
                    </div>
                  </div>
                  <span className="pass-qr-badge">● QR HABILITADO</span>
                </div>
              </div>

              {/* Fila de Facturación y Pago */}
              <div className="membership-billing-rows">
                <div className="billing-row">
                  <span className="billing-label">Tipo de Suscripción:</span>
                  <span className="billing-val">Pase Anual Ilimitado</span>
                </div>

                <div className="billing-row">
                  <span className="billing-label">Método de Débito:</span>
                  <span className="billing-val">
                    <svg
                      style={{
                        width: "1rem",
                        height: "1rem",
                        color: "var(--accent-neon)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Visa Débito •••• 4821
                  </span>
                </div>

                <div className="billing-row">
                  <span className="billing-label">Próxima Cuota:</span>
                  <span
                    className="billing-val"
                    style={{ color: "var(--accent-neon)" }}
                  >
                    15 Octubre, 2026 ($28.500 ARS)
                  </span>
                </div>

                <div className="billing-row">
                  <span className="billing-label">Estado de Cuenta:</span>
                  <span className="status-badge-active">
                    Sin Saldo Pendiente
                  </span>
                </div>
              </div>
            </section>

            {/* Sección: Próximas Actividades Reservadas */}
            <section
              className="profile-section-card"
              aria-labelledby="section-classes-title"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <svg
                    className="card-title-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h2 id="section-classes-title">PRÓXIMAS ACTIVIDADES</h2>
                </div>
                <span className="card-title-badge">3 Reservas</span>
              </div>

              <div className="classes-list">
                {/* Clase 1 */}
                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">MAR</span>
                      <span className="class-time-hour">19:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Spinning Power HIIT</div>
                      <div className="class-meta">
                        Sala de Ciclismo • Coach Sofía Pérez
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>

                {/* Clase 2 */}
                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">JUE</span>
                      <span className="class-time-hour">20:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Cross Training Pro</div>
                      <div className="class-meta">
                        Box 1 • Coach Marcos Galván
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>

                {/* Clase 3 */}
                <div className="class-item">
                  <div className="class-left">
                    <div
                      className="class-time-box"
                      style={{
                        borderColor: "rgba(255, 94, 58, 0.3)",
                        color: "var(--accent-orange)",
                        background: "rgba(255, 94, 58, 0.08)",
                      }}
                    >
                      <span className="class-time-day">SÁB</span>
                      <span className="class-time-hour">17:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Cancha Pádel 3</div>
                      <div className="class-meta">
                        Zona Deportiva • Turno 90 min
                      </div>
                    </div>
                  </div>
                  <span className="badge-status waiting">En Lista</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
