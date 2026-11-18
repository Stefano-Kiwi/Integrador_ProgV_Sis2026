import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export type RolUsuario = "recepcionista" | "gerente" | "admin" | "instructor" | "socio";
export type EstadoUsuario = "Activo" | "Inactivo" | "Vacaciones" | "Suspendido";

interface UsuarioMock {
  id: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  dni: string;
  telefono: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  sedeAsignada: string;
  turno: string;
  avatar: string;
}

const PRELOADED_USERS: Record<string, UsuarioMock> = {
  "PER-01": {
    id: "PER-01",
    nombre: "Valeria",
    apellido: "Morales",
    username: "vmorales",
    email: "vmorales@fitzone.com.ar",
    dni: "27.849.201",
    telefono: "+54 343 411-8899",
    rol: "gerente",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Jornada Completa (08:00 - 17:00)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  "PER-02": {
    id: "PER-02",
    nombre: "Lucas",
    apellido: "Benítez",
    username: "lbenitez",
    email: "lbenitez@fitzone.com.ar",
    dni: "36.410.982",
    telefono: "+54 343 502-3311",
    rol: "recepcionista",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Turno Mañana (06:00 - 14:00)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  "USR-101": {
    id: "USR-101",
    nombre: "Valeria",
    apellido: "Morales",
    username: "vmorales",
    email: "vmorales@fitzone.com.ar",
    dni: "27.849.201",
    telefono: "+54 343 411-8899",
    rol: "gerente",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Jornada Completa (08:00 - 17:00)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
};

const ROLES_LIST: { value: RolUsuario; label: string; icon: string; desc: string }[] = [
  { value: "recepcionista", label: "Recepcionista", icon: "🛎️", desc: "Gestión de caja, cobros y bienvenida al socio" },
  { value: "gerente", label: "Gerente de Sede", icon: "👑", desc: "Coordinación operativa, aforo y supervisión de sucursal" },
  { value: "admin", label: "Administrador General", icon: "🛡️", desc: "Configuración global de sedes, catálogos y accesos" },
  { value: "instructor", label: "Instructor Fitness", icon: "🏋️", desc: "Coordinación de clases grupales y entrenamiento" },
  { value: "socio", label: "Socio / Cliente", icon: "💳", desc: "Acceso a reservas de canchas y beneficios de membresía" },
];

const ESTADOS_LIST: { value: EstadoUsuario; label: string; badgeClass: string }[] = [
  { value: "Activo", label: "Activo", badgeClass: "status-active" },
  { value: "Inactivo", label: "Inactivo", badgeClass: "status-inactive" },
  { value: "Vacaciones", label: "Vacaciones / Licencia", badgeClass: "status-warning" },
  { value: "Suspendido", label: "Suspendido", badgeClass: "status-inactive" },
];

export default function AdminUsuarioForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const preloaded = isEditing ? (id && PRELOADED_USERS[id]) || PRELOADED_USERS["PER-01"] : null;

  // Campos del Formulario
  const [nombre, setNombre] = useState(preloaded ? preloaded.nombre : "");
  const [apellido, setApellido] = useState(preloaded ? preloaded.apellido : "");
  const [username, setUsername] = useState(preloaded ? preloaded.username : "");
  const [email, setEmail] = useState(preloaded ? preloaded.email : "");
  const [dni, setDni] = useState(preloaded ? preloaded.dni : "");
  const [telefono, setTelefono] = useState(preloaded ? preloaded.telefono : "");
  const [rol, setRol] = useState<RolUsuario>(preloaded ? preloaded.rol : "recepcionista");
  const [estado, setEstado] = useState<EstadoUsuario>(preloaded ? preloaded.estado : "Activo");
  const [sedeAsignada, setSedeAsignada] = useState(preloaded ? preloaded.sedeAsignada : "Sede Paraná Centro (Central)");
  const [turno, setTurno] = useState(preloaded ? preloaded.turno : "Turno Mañana (06:00 - 14:00)");

  // Contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Modal / Confirmación estática
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Preparación visual estática sin persistencia ni llamadas a backend
    setShowFeedbackModal(true);
  };

  const currentRoleConfig = ROLES_LIST.find((r) => r.value === rol) || ROLES_LIST[0];

  return (
    <>
      {/* BREADCRUMBS */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        <Link to="/admin" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Admin
        </Link>
        <span>/</span>
        <Link to="/admin/personal" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Gestión de Personal
        </Link>
        <span>/</span>
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>
          {isEditing ? "Editar usuario" : "Nuevo usuario"}
        </span>
      </div>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Módulo U-02
            </span>
          </div>
          <h1>{isEditing ? `Editar usuario: ${nombre} ${apellido}` : "Nuevo usuario"}</h1>
          <p>
            {isEditing
              ? "Modifica los datos del usuario existente, asignación de rol y estado de cuenta"
              : "Ingresa los datos para dar de alta una nueva cuenta de usuario o miembro del personal"}
          </p>
        </div>
      </header>

      {/* NOTA VISUAL DE MODO ESTÁTICO */}
      <div
        style={{
          backgroundColor: "rgba(0, 200, 255, 0.08)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          borderRadius: "var(--radius-md)",
          padding: "0.85rem 1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.83rem",
          color: "#bae6fd",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>ℹ️</span>
        <span>
          <strong>Maquetado estático preparado:</strong> Formulario de interfaz sin persistencia de base de datos ni validaciones de negocio activas.
        </span>
      </div>

      {/* FORMULARIO ESTÁTICO CON DISTRIBUCIÓN RESPONSIVE */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* PANEL PRINCIPAL CON CAMPOS AGRUPADOS */}
          <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* GRUPO 1: DATOS PERSONALES */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>👤</span>
                <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Datos Personales</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="usr-nombre">Nombre *</label>
                  <input
                    id="usr-nombre"
                    type="text"
                    className="form-control"
                    placeholder="Ej. Lucas"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usr-apellido">Apellido *</label>
                  <input
                    id="usr-apellido"
                    type="text"
                    className="form-control"
                    placeholder="Ej. Benítez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="usr-dni">Documento (DNI / CUIT) *</label>
                  <input
                    id="usr-dni"
                    type="text"
                    className="form-control"
                    placeholder="Ej. 36.410.982"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usr-telefono">Teléfono</label>
                  <input
                    id="usr-telefono"
                    type="tel"
                    className="form-control"
                    placeholder="Ej. +54 343 502-3311"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* GRUPO 2: DATOS DE ACCESO Y CUENTA */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>🔑</span>
                <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Cuenta y Acceso</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="usr-username">Nombre de usuario *</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", fontWeight: 600 }}>@</span>
                    <input
                      id="usr-username"
                      type="text"
                      className="form-control"
                      placeholder="usuario"
                      style={{ paddingLeft: "2rem", width: "100%" }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="usr-email">Correo electrónico *</label>
                  <input
                    id="usr-email"
                    type="email"
                    className="form-control"
                    placeholder="correo@fitzone.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginTop: "0.5rem" }}>
                <div className="form-group">
                  <label htmlFor="usr-password">
                    {isEditing ? "Contraseña (opcional)" : "Contraseña *"}
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      id="usr-password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder={isEditing ? "Conservar actual" : "Mínimo 8 caracteres"}
                      style={{ width: "100%", paddingRight: "2.5rem" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!isEditing}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar" : "Mostrar"}
                      style={{
                        position: "absolute",
                        right: "10px",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="usr-confirm-password">
                    {isEditing ? "Confirmar nueva clave" : "Confirmar contraseña *"}
                  </label>
                  <input
                    id="usr-confirm-password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder={isEditing ? "Reingresa clave" : "Repite la contraseña"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={Boolean(password)}
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
              <Link to="/admin/personal" className="btn-secondary" style={{ textDecoration: "none" }}>
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px" }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar usuario
              </button>
            </div>
          </div>

          {/* PANEL LATERAL: SELECTORES VISUALES DE ROL Y ESTADO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* SELECTOR VISUAL DE ROL */}
            <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>🛡️</span>
                <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Rol o Tipo de Usuario</h3>
              </div>

              <div className="form-group">
                <label htmlFor="usr-rol-select">Seleccionar Rol</label>
                <select
                  id="usr-rol-select"
                  className="form-control"
                  value={rol}
                  onChange={(e) => setRol(e.target.value as RolUsuario)}
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.icon} {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarjeta descriptiva del rol seleccionado */}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-pure)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>{currentRoleConfig.icon}</span>
                  <span>{currentRoleConfig.label}</span>
                </div>
                <div>{currentRoleConfig.desc}</div>
              </div>
            </div>

            {/* SELECTOR VISUAL DE ESTADO */}
            <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>⚡</span>
                <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Estado de la Cuenta</h3>
              </div>

              <div className="form-group">
                <label htmlFor="usr-estado-select">Seleccionar Estado</label>
                <select
                  id="usr-estado-select"
                  className="form-control"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EstadoUsuario)}
                >
                  {ESTADOS_LIST.map((e) => (
                    <option key={e.value} value={e.value}>
                      ● {e.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Visualización:</span>
                <span
                  className={`status-badge ${
                    estado === "Activo"
                      ? "status-active"
                      : estado === "Inactivo"
                      ? "status-inactive"
                      : "status-warning"
                  }`}
                >
                  ● {estado}
                </span>
              </div>
            </div>

            {/* SEDE OPERATIVA ASIGNADA */}
            <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>📍</span>
                <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Sede Asignada</h3>
              </div>

              <div className="form-group">
                <label htmlFor="usr-sede-select">Sede</label>
                <select
                  id="usr-sede-select"
                  className="form-control"
                  value={sedeAsignada}
                  onChange={(e) => setSedeAsignada(e.target.value)}
                >
                  <option value="Sede Paraná Centro (Central)">Sede Paraná Centro (Central)</option>
                  <option value="Sede Concordia Costanera">Sede Concordia Costanera</option>
                  <option value="Sede Gualeguaychú Parque">Sede Gualeguaychú Parque</option>
                  <option value="Sede Concepción del Uruguay">Sede Concepción del Uruguay</option>
                  <option value="Sede Colón Río">Sede Colón Río</option>
                  <option value="Todas las Sedes (Corporativo)">Todas las Sedes (Corporativo)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="usr-turno-input">Turno Laboral</label>
                <input
                  id="usr-turno-input"
                  type="text"
                  className="form-control"
                  placeholder="Ej. Mañana (06:00 - 14:00)"
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* MODAL DE CONFIRMACIÓN ESTÁTICA */}
      {showFeedbackModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="panel-card"
            style={{
              width: "90%",
              maxWidth: "480px",
              padding: "2rem",
              boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
              backgroundColor: "var(--bg-sidebar)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-pure)" }}>
                {isEditing ? "¡Usuario Actualizado!" : "¡Usuario Registrado!"}
              </h2>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: "var(--text-pure)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
              La vista estática de {isEditing ? "edición" : "alta"} para <strong>{nombre || "Usuario"} {apellido}</strong> ha sido verificada a nivel visual.
            </p>

            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "rgba(0, 255, 135, 0.08)",
                border: "1px solid rgba(0, 255, 135, 0.25)",
                borderRadius: "var(--radius-md)",
                color: "var(--accent-green)",
                fontSize: "0.82rem",
                marginBottom: "1.5rem",
              }}
            >
              ✓ Interfaz estática lista: Queda preparada para la conexión con el backend en la siguiente etapa.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate("/admin/personal")}
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
