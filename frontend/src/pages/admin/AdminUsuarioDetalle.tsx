import { useParams, Link } from "react-router-dom";

interface UsuarioDetalleMock {
  id: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  dni: string;
  telefono: string;
  rol: "gerente" | "recepcionista" | "admin" | "instructor" | "socio";
  rolLabel: string;
  estado: "Activo" | "Inactivo" | "Vacaciones";
  sedeAsignada: string;
  turno: string;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  ultimoAcceso: string;
  avatar: string;
  notas: string;
}

const USUARIOS_DETALLE_DATA: Record<string, UsuarioDetalleMock> = {
  "PER-01": {
    id: "PER-01",
    nombre: "Valeria",
    apellido: "Morales",
    username: "vmorales",
    email: "vmorales@fitzone.com.ar",
    dni: "27.849.201",
    telefono: "+54 343 411-8899",
    rol: "gerente",
    rolLabel: "Gerente de Sede",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Jornada Completa (08:00 - 17:00)",
    fechaCreacion: "10 Ene 2024, 09:30 hs",
    fechaUltimaModificacion: "12 Oct 2026, 14:15 hs",
    ultimoAcceso: "Hoy a las 08:15 hs",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    notas: "Responsable de operaciones centrales, supervisión de cajas y auditoría de accesos.",
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
    rolLabel: "Recepcionista",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Turno Mañana (06:00 - 14:00)",
    fechaCreacion: "05 Mar 2024, 11:20 hs",
    fechaUltimaModificacion: "14 Oct 2026, 09:45 hs",
    ultimoAcceso: "Hoy a las 05:50 hs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    notas: "Atención al socio en mesón, cobros de planes y asignación de canchas de paddle.",
  },
  "PER-03": {
    id: "PER-03",
    nombre: "Camila",
    apellido: "Rodríguez",
    username: "crodriguez",
    email: "crodriguez@fitzone.com.ar",
    dni: "34.112.589",
    telefono: "+54 345 421-9988",
    rol: "recepcionista",
    rolLabel: "Recepcionista",
    estado: "Activo",
    sedeAsignada: "Sede Concordia Costanera",
    turno: "Turno Tarde (14:00 - 22:00)",
    fechaCreacion: "18 Abr 2024, 15:00 hs",
    fechaUltimaModificacion: "08 Oct 2026, 18:10 hs",
    ultimoAcceso: "Ayer a las 14:00 hs",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    notas: "Control de acceso a canchas y entrega de equipamiento deportivo.",
  },
  "PER-04": {
    id: "PER-04",
    nombre: "Roberto",
    apellido: "Gómez",
    username: "rgomez",
    email: "rgomez@fitzone.com.ar",
    dni: "29.304.771",
    telefono: "+54 345 490-2211",
    rol: "gerente",
    rolLabel: "Gerente de Sede",
    estado: "Activo",
    sedeAsignada: "Sede Concordia Costanera",
    turno: "Jornada Completa (09:00 - 18:00)",
    fechaCreacion: "12 Nov 2023, 10:00 hs",
    fechaUltimaModificacion: "01 Oct 2026, 11:45 hs",
    ultimoAcceso: "Hoy a las 09:05 hs",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    notas: "Coordinador de sede y responsable de mantenimiento edilicio.",
  },
  "PER-05": {
    id: "PER-05",
    nombre: "Florencia",
    apellido: "Peña",
    username: "fpena",
    email: "fpena@fitzone.com.ar",
    dni: "38.991.032",
    telefono: "+54 3446 51-2244",
    rol: "recepcionista",
    rolLabel: "Recepcionista",
    estado: "Vacaciones",
    sedeAsignada: "Sede Gualeguaychú Parque",
    turno: "Turno Mañana (07:00 - 15:00)",
    fechaCreacion: "22 Ene 2025, 08:30 hs",
    fechaUltimaModificacion: "28 Sep 2026, 16:00 hs",
    ultimoAcceso: "28 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    notas: "Licencia ordinaria anual aprobada hasta fin de mes.",
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
    rolLabel: "Gerente de Sede",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Jornada Completa (08:00 - 17:00)",
    fechaCreacion: "10 Ene 2024, 09:30 hs",
    fechaUltimaModificacion: "12 Oct 2026, 14:15 hs",
    ultimoAcceso: "Hoy a las 08:15 hs",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    notas: "Responsable de operaciones centrales y auditoría de accesos.",
  },
  "USR-102": {
    id: "USR-102",
    nombre: "Lucas",
    apellido: "Benítez",
    username: "lbenitez",
    email: "lbenitez@fitzone.com.ar",
    dni: "36.410.982",
    telefono: "+54 343 502-3311",
    rol: "recepcionista",
    rolLabel: "Recepcionista",
    estado: "Activo",
    sedeAsignada: "Sede Paraná Centro (Central)",
    turno: "Turno Mañana (06:00 - 14:00)",
    fechaCreacion: "05 Mar 2024, 11:20 hs",
    fechaUltimaModificacion: "14 Oct 2026, 09:45 hs",
    ultimoAcceso: "Hoy a las 05:50 hs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    notas: "Atención al socio en mesón, cobros de planes y asignación de canchas.",
  },
};

export default function AdminUsuarioDetalle() {
  const { id } = useParams<{ id: string }>();

  // Carga estática de datos ficticios según el ID o fallback ilustrativo
  const user = (id && USUARIOS_DETALLE_DATA[id]) || USUARIOS_DETALLE_DATA["PER-01"];

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
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Detalle del usuario (U-03)</span>
      </div>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Módulo U-03
            </span>
          </div>
          <h1>Detalle del usuario</h1>
          <p>Ficha de solo lectura con información personal, rol, estado y auditoría</p>
        </div>
        <div className="header-controls">
          <Link
            to="/admin/personal"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            ← Volver al listado
          </Link>
          <Link
            to={`/admin/personal/${user.id}`}
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "15px", height: "15px" }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar usuario
          </Link>
        </div>
      </header>

      {/* TARJETA O PANEL HERO CON LA INFORMACIÓN PERSONAL Y AVATAR */}
      <div
        className="panel-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          padding: "2rem",
          background: "linear-gradient(135deg, rgba(21, 27, 43, 0.95), rgba(15, 21, 35, 0.98))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Avatar o ícono identificador coincidente con admin */}
          <img
            src={user.avatar}
            alt={`${user.nombre} ${user.apellido}`}
            style={{
              width: "86px",
              height: "86px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--accent-orange)",
              boxShadow: "0 4px 16px rgba(255, 94, 58, 0.3)",
              backgroundColor: "var(--bg-sidebar)",
              flexShrink: 0,
            }}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                }}
              >
                ID: {user.id}
              </span>

              {/* Etiqueta visual para el rol */}
              {user.rol === "gerente" ? (
                <span
                  style={{
                    backgroundColor: "rgba(255, 176, 32, 0.15)",
                    color: "var(--accent-yellow)",
                    border: "1px solid rgba(255, 176, 32, 0.35)",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "14px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  👑 {user.rolLabel}
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: "rgba(0, 200, 255, 0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(56, 189, 248, 0.35)",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "14px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  🛎️ {user.rolLabel}
                </span>
              )}

              {/* Etiqueta visual para el estado */}
              <span
                className={`status-badge ${
                  user.estado === "Activo"
                    ? "status-active"
                    : user.estado === "Inactivo"
                    ? "status-inactive"
                    : "status-warning"
                }`}
              >
                ● {user.estado}
              </span>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-pure)", margin: 0 }}>
              {user.nombre} {user.apellido}
            </h2>

            <p style={{ color: "var(--accent-orange)", fontSize: "0.92rem", fontWeight: 600, margin: "0.25rem 0 0 0" }}>
              @{user.username} • {user.email}
            </p>
          </div>
        </div>

        {/* Acciones directas */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            to={`/admin/personal/${user.id}`}
            className="btn-secondary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>✏️</span>
            <span>Editar datos</span>
          </Link>
        </div>
      </div>

      {/* ORGANIZACIÓN DE LA INFORMACIÓN EN JERARQUÍA DE PANELES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* PANEL DE DATOS PERSONALES Y CONTACTO */}
        <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.1rem" }}>📋</span>
            <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Información del Usuario</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Identificador (ID)
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem", fontFamily: "monospace" }}>
                {user.id}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Documento (DNI)
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.dni}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Nombre y Apellido
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.nombre} {user.apellido}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Nombre de usuario
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--accent-orange)", marginTop: "0.2rem" }}>
                @{user.username}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Correo electrónico
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Teléfono de contacto
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.telefono}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Rol Asignado
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.rolLabel}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DE ASIGNACIÓN OPERATIVA Y AUDITORÍA DE FECHAS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Asignación y Estado */}
          <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🏢</span>
              <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Asignación Operativa</h3>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Sede Asignada
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.sedeAsignada}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Turno Laboral Asignado
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {user.turno}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                Observaciones / Notas
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem", lineHeight: 1.4 }}>
                {user.notas}
              </div>
            </div>
          </div>

          {/* Fechas de Auditoría */}
          <div className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🕒</span>
              <h3 style={{ fontSize: "1rem", color: "var(--text-pure)", fontWeight: 700 }}>Registro y Auditoría</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Fecha de creación:</span>
                <span style={{ fontWeight: 600, color: "var(--text-pure)" }}>{user.fechaCreacion}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Última modificación:</span>
                <span style={{ fontWeight: 600, color: "var(--text-pure)" }}>{user.fechaUltimaModificacion}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Último acceso al panel:</span>
                <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>{user.ultimoAcceso}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONERA INFERIOR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <Link to="/admin/personal" className="btn-secondary" style={{ textDecoration: "none" }}>
          ← Volver al listado
        </Link>
        <Link
          to={`/admin/personal/${user.id}`}
          className="btn-primary"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <span>✏️</span>
          <span>Editar usuario</span>
        </Link>
      </div>
    </>
  );
}
