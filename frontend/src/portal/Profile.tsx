import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  obtenerToken,
  obtenerMiPerfil,
  obtenerUsuarioActual,
  type UsuarioSesion,
} from "../services/authService";

export default function Profile() {
  const token = obtenerToken();

  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modoOffline, setModoOffline] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setCargando(false);
      return;
    }

    let montado = true;

    async function cargarPerfil() {
      try {
        setError(null);
        const datos = await obtenerMiPerfil();
        if (montado) {
          setUsuario(datos);
          setModoOffline(false);
        }
      } catch (err) {
        console.warn("No se pudo cargar perfil desde /auth/me:", err);
        // Respaldo desde el payload del JWT si el backend no responde
        const usuarioJwt = obtenerUsuarioActual();
        if (montado) {
          if (usuarioJwt) {
            setModoOffline(true);
            setUsuario({
              id: Number(usuarioJwt.sub || usuarioJwt.id || 1),
              nombre: usuarioJwt.email ? String(usuarioJwt.email).split("@")[0] : "Socio",
              apellido: "",
              email: String(usuarioJwt.email || "socio@fitzone.com"),
              rol: {
                id_rol: 1,
                clase_rol: String(usuarioJwt.rol || usuarioJwt.role || "Socio"),
              },
              sede_base: {
                id: 1,
                nombre: "Sede Central",
              },
            });
          } else {
            setError(
              err instanceof Error ? err.message : "Error al consultar los datos del perfil.",
            );
          }
        }
      } finally {
        if (montado) {
          setCargando(false);
        }
      }
    }

    cargarPerfil();

    return () => {
      montado = false;
    };
  }, [token]);

  // Si no hay sesión iniciada
  if (!token) {
    return (
      <div className="profile-page-wrapper" style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "var(--bg-card, #151b2b)",
          border: "1px solid var(--border-color, #222b40)",
          borderRadius: "16px",
          padding: "2.5rem",
          maxWidth: "460px",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
          <h2 style={{ color: "#fff", marginBottom: "0.75rem", fontSize: "1.4rem" }}>Inicia Sesión</h2>
          <p style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
            Debes iniciar sesión con tus credenciales para acceder a tu perfil y pase digital.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, var(--accent-orange, #ff5e3a), #ff8c42)",
              color: "#fff",
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  // Mientras carga la respuesta del backend
  if (cargando) {
    return (
      <div className="profile-page-wrapper" style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted, #8b95a5)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>⏳</div>
          <p style={{ fontSize: "1rem" }}>Cargando datos del perfil desde el servidor...</p>
        </div>
      </div>
    );
  }

  // Si ocurrió un error fatal y no hay datos
  if (error && !usuario) {
    return (
      <div className="profile-page-wrapper" style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "rgba(255, 75, 114, 0.1)",
          border: "1px solid var(--accent-red, #ff4b72)",
          borderRadius: "16px",
          padding: "2.5rem",
          maxWidth: "460px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>Error de Conexión</h2>
          <p style={{ color: "#fca5a5", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
            style={{ padding: "0.6rem 1.2rem", cursor: "pointer" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Datos normalizados del usuario
  const nombreCompleto = usuario
    ? `${usuario.nombre} ${usuario.apellido}`.trim() || usuario.email.split("@")[0]
    : "Usuario";
  const username = usuario ? `@${usuario.email.split("@")[0]}` : "@usuario";
  const email = usuario?.email || "usuario@fitzone.com";
  const rolNombre = usuario?.rol?.clase_rol || "Socio Activo";
  const idFormateado = usuario ? `TG-${String(usuario.id).padStart(4, "0")}` : "TG-0001";
  const dni = usuario?.dni || "S/D";
  const sedeNombre = usuario?.sede_base?.nombre || "Sede Central";

  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        
        {/* Aviso si está en modo offline o contingencia */}
        {modoOffline && (
          <div style={{
            background: "rgba(255, 176, 32, 0.12)",
            border: "1px solid rgba(255, 176, 32, 0.4)",
            borderRadius: "12px",
            padding: "0.75rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "#fff",
            fontSize: "0.85rem"
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>
              <strong>Modo contingencia:</strong> Mostrando datos de la sesión activa guardada localmente (servidor central no disponible).
            </span>
          </div>
        )}

        {/* Encabezado de la Vista */}
        <header className="profile-page-header">
          <h1 className="profile-page-title">
            PERFIL DE <span className="highlight">USUARIO</span>
          </h1>
          <p className="profile-page-subtitle">
            Ficha general del socio, pase digital y registro de actividades.
          </p>
        </header>

        {/* Cuadro Dinámico con los Datos del Usuario */}
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
              <span className="summary-badge-id">ID: {idFormateado}</span>
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
              <span className="summary-value">{nombreCompleto}</span>
            </div>

            {/* Nombre de Usuario */}
            <div className="summary-field-cell">
              <span className="summary-label">Nombre de Usuario</span>
              <span className="summary-value" style={{ color: "var(--accent-neon)" }}>{username}</span>
            </div>

            {/* Correo Electrónico */}
            <div className="summary-field-cell">
              <span className="summary-label">Correo Electrónico</span>
              <span className="summary-value">{email}</span>
            </div>

            {/* Rol Dentro del Sistema */}
            <div className="summary-field-cell">
              <span className="summary-label">Rol en el Sistema</span>
              <span className="summary-value">
                <span className="role-tag">{rolNombre}</span>
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
                {idFormateado}
              </span>
            </div>
          </div>
        </section>

        {/* Contenedor Modular en Dos Columnas */}
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
                    <span>{nombreCompleto}</span>
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
                    <span>{dni}</span>
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
                    <span>{email}</span>
                  </div>
                </div>

                {/* Sede Base Asignada */}
                <div className="data-field-item">
                  <span className="data-label">Sede Base</span>
                  <div className="data-value-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{sedeNombre}</span>
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
                    <span>+54 9 11 {dni !== "S/D" ? dni.slice(-4) : "4523"}-9981</span>
                  </div>
                </div>

                {/* Domicilio Habitual */}
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
                      Av. Cabildo 2450, Piso 4 B, Ciudad Autónoma de Buenos Aires
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
                        — {sedeNombre} (Molinete 1)
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
                        — {sedeNombre} (Molinete 2)
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
                      FITZONE
                      <span style={{ color: "var(--accent-neon)" }}> SPORTS</span>
                    </span>
                  </div>
                  <div
                    className="pass-chip-icon"
                    title="Chip de Seguridad NFC"
                  />
                </div>

                <div className="pass-middle">
                  <div className="pass-details">
                    <span className="pass-tier-name">PLAN {rolNombre.toUpperCase()}</span>
                    <span className="pass-number">
                      TG - {String(usuario?.id || 1).padStart(4, "0")} - 2026 - PASS
                    </span>
                    <span className="pass-holder">{nombreCompleto.toUpperCase()}</span>
                  </div>
                </div>

                {/* Acceso directo al Pase QR Dinámico */}
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
                      </svg>
                    </div>
                    <div className="pass-qr-meta">
                      <span className="pass-qr-title">Credencial QR Dinámica</span>
                      <span className="pass-qr-desc">Se renueva cada 5 minutos para molinetes</span>
                      <Link
                        to="/mi-pase-qr"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          marginTop: "0.35rem",
                          color: "var(--accent-neon, #00ff87)",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          textDecoration: "underline",
                        }}
                      >
                        Abrir Pase QR Pantalla Completa →
                      </Link>
                    </div>
                  </div>
                  <span className="pass-qr-badge">● QR ACTIVO</span>
                </div>
              </div>

              {/* Fila de Facturación y Pago */}
              <div className="membership-billing-rows">
                <div className="billing-row">
                  <span className="billing-label">Tipo de Suscripción:</span>
                  <span className="billing-val">Pase {rolNombre}</span>
                </div>

                <div className="billing-row">
                  <span className="billing-label">Sede Habilitada:</span>
                  <span className="billing-val">{sedeNombre}</span>
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
                <span className="card-title-badge">2 Reservas</span>
              </div>

              <div className="classes-list">
                {/* Clase 1 */}
                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">HOY</span>
                      <span className="class-time-hour">19:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Spinning Power HIIT</div>
                      <div className="class-meta">
                        {sedeNombre} • Sala de Ciclismo
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>

                {/* Clase 2 */}
                <div className="class-item">
                  <div className="class-left">
                    <div className="class-time-box">
                      <span className="class-time-day">MAÑ</span>
                      <span className="class-time-hour">20:00</span>
                    </div>
                    <div className="class-details">
                      <div className="class-title">Cross Training Pro</div>
                      <div className="class-meta">
                        {sedeNombre} • Box 1
                      </div>
                    </div>
                  </div>
                  <span className="badge-status confirmed">Confirmada</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
