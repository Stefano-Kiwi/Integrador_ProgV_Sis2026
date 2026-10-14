import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export interface PersonalItem {
  id: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  dni: string;
  telefono: string;
  rol: "gerente" | "recepcionista";
  estado: "Activo" | "Inactivo" | "Vacaciones";
  sedeAsignada: string;
  fechaAlta: string;
  avatar: string;
}

const MOCK_PERSONAL: PersonalItem[] = [
  {
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
    fechaAlta: "10 Ene 2024",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
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
    fechaAlta: "05 Mar 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "PER-03",
    nombre: "Camila",
    apellido: "Rodríguez",
    username: "crodriguez",
    email: "crodriguez@fitzone.com.ar",
    dni: "34.112.589",
    telefono: "+54 345 421-9988",
    rol: "recepcionista",
    estado: "Activo",
    sedeAsignada: "Sede Concordia Costanera",
    fechaAlta: "18 Abr 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "PER-04",
    nombre: "Roberto",
    apellido: "Gómez",
    username: "rgomez",
    email: "rgomez@fitzone.com.ar",
    dni: "29.304.771",
    telefono: "+54 345 490-2211",
    rol: "gerente",
    estado: "Activo",
    sedeAsignada: "Sede Concordia Costanera",
    fechaAlta: "12 Nov 2023",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "PER-05",
    nombre: "Florencia",
    apellido: "Peña",
    username: "fpena",
    email: "fpena@fitzone.com.ar",
    dni: "38.991.032",
    telefono: "+54 3446 51-2244",
    rol: "recepcionista",
    estado: "Vacaciones",
    sedeAsignada: "Sede Gualeguaychú Parque",
    fechaAlta: "22 Ene 2025",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  }
];

export default function AdminPersonal() {
  const [personalList] = useState<PersonalItem[]>(MOCK_PERSONAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState<string>("Todos");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtrado reactivo en memoria (estático)
  const filteredPersonal = useMemo(() => {
    return personalList.filter((item) => {
      const matchSearch =
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRol = filterRol === "Todos" || item.rol === filterRol;
      const matchEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchSearch && matchRol && matchEstado;
    });
  }, [personalList, searchTerm, filterRol, filterEstado]);

  // Paginación estática
  const totalPages = Math.ceil(filteredPersonal.length / itemsPerPage) || 1;
  const paginatedData = filteredPersonal.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const gerentesCount = personalList.filter((p) => p.rol === "gerente").length;
  const recepcionistasCount = personalList.filter((p) => p.rol === "recepcionista").length;
  const activosCount = personalList.filter((p) => p.estado === "Activo").length;

  return (
    <>
      {/* BREADCRUMB */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        <Link to="/admin" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Admin
        </Link>
        <span>/</span>
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Gestión de Personal (PE-01)</span>
      </div>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Módulo PE-01
            </span>
          </div>
          <h1>Gestión de Personal</h1>
          <p>Visualización y administración del personal del establecimiento (recepcionistas y gerentes)</p>
        </div>
        <div className="header-controls">
          <Link
            to="/admin/personal/nuevo"
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px" }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar personal
          </Link>
        </div>
      </header>

      {/* TARJETAS DE RESUMEN / MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
        <div className="panel-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600 }}>
            <span>Total Personal</span>
            <span>👥</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-pure)" }}>{personalList.length}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Recepcionistas y Gerentes</div>
        </div>

        <div className="panel-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-yellow)", fontSize: "0.82rem", fontWeight: 600 }}>
            <span>Gerentes de Sede</span>
            <span>👑</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-yellow)" }}>{gerentesCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Supervisores operativos</div>
        </div>

        <div className="panel-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#38bdf8", fontSize: "0.82rem", fontWeight: 600 }}>
            <span>Recepcionistas</span>
            <span>🛎️</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#38bdf8" }}>{recepcionistasCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Atención y molinetes</div>
        </div>

        <div className="panel-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-green)", fontSize: "0.82rem", fontWeight: 600 }}>
            <span>Personal Activo</span>
            <span>●</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-green)" }}>{activosCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Con turno operativo hoy</div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS VISUALES */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Campo de búsqueda */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ position: "absolute", left: "12px", width: "16px", height: "16px", color: "var(--text-muted)", pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo electrónico..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: "2.4rem", width: "290px" }}
            />
          </div>

          {/* Filtro visual por rol */}
          <select
            className="form-control"
            value={filterRol}
            onChange={(e) => {
              setFilterRol(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "auto", cursor: "pointer" }}
            title="Filtro visual por rol"
          >
            <option value="Todos">Todos los roles</option>
            <option value="gerente">Gerente de Sede (👑)</option>
            <option value="recepcionista">Recepcionista (🛎️)</option>
          </select>

          {/* Filtro visual por estado */}
          <select
            className="form-control"
            value={filterEstado}
            onChange={(e) => {
              setFilterEstado(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "auto", cursor: "pointer" }}
            title="Filtro visual por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">● Activo</option>
            <option value="Inactivo">● Inactivo</option>
            <option value="Vacaciones">● Vacaciones</option>
          </select>
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Mostrando <strong>{filteredPersonal.length}</strong> de <strong>{personalList.length}</strong> colaboradores
        </div>
      </div>

      {/* TABLA CON ENCABEZADOS CLAROS O MENSAJE VISUAL DE REGISTROS VACÍOS */}
      {filteredPersonal.length === 0 ? (
        <div
          className="panel-card"
          style={{
            padding: "3.5rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            borderStyle: "dashed",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "28px", height: "28px" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 style={{ fontSize: "1.15rem", color: "var(--text-pure)" }}>No se encontraron registros de personal</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "460px" }}>
            No existen colaboradores que coincidan con la búsqueda "{searchTerm}" o con los filtros seleccionados.
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setFilterRol("Todos");
              setFilterEstado("Todos");
              setCurrentPage(1);
            }}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="panel-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "95px" }}>Identificador</th>
                  <th>Nombre y Apellido</th>
                  <th>Correo Electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha de Alta</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    {/* Identificador */}
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          background: "rgba(255, 255, 255, 0.05)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {item.id}
                      </span>
                    </td>

                    {/* Nombre y apellido con avatar */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={item.avatar}
                          alt={`${item.nombre} ${item.apellido}`}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid var(--border-color)",
                            backgroundColor: "var(--bg-sidebar)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Link
                            to={`/admin/personal/${item.id}`}
                            style={{ fontWeight: 700, color: "var(--text-pure)", textDecoration: "none" }}
                          >
                            {item.nombre} {item.apellido}
                          </Link>
                          <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                            @{item.username} • DNI {item.dni}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Correo electrónico */}
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {item.email}
                    </td>

                    {/* Rol: Distinción clara entre Recepcionista y Gerente */}
                    <td>
                      {item.rol === "gerente" ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "16px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            backgroundColor: "rgba(255, 176, 32, 0.12)",
                            color: "var(--accent-yellow)",
                            border: "1px solid rgba(255, 176, 32, 0.35)",
                          }}
                        >
                          <span>👑</span>
                          <span>Gerente</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "16px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            backgroundColor: "rgba(0, 200, 255, 0.12)",
                            color: "#38bdf8",
                            border: "1px solid rgba(56, 189, 248, 0.35)",
                          }}
                        >
                          <span>🛎️</span>
                          <span>Recepcionista</span>
                        </span>
                      )}
                    </td>

                    {/* Estado de la cuenta */}
                    <td>
                      <span
                        className={`status-badge ${item.estado === "Activo"
                          ? "status-active"
                          : item.estado === "Inactivo"
                            ? "status-inactive"
                            : "status-warning"
                          }`}
                      >
                        ● {item.estado}
                      </span>
                    </td>

                    {/* Fecha de alta */}
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {item.fechaAlta}
                    </td>

                    {/* Acciones visuales */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", alignItems: "center" }}>
                        <Link
                          to={`/admin/personal/${item.id}`}
                          className="btn-secondary"
                          style={{
                            textDecoration: "none",
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.8rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                          title="Consultar detalle de usuario (U-03)"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "13px", height: "13px" }}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>Detalle</span>
                        </Link>
                        <Link
                          to={`/admin/personal/${item.id}`}
                          className="btn-secondary"
                          style={{
                            textDecoration: "none",
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.8rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                          title="Editar registro de usuario (U-02)"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "13px", height: "13px" }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          <span>Editar</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN ESTÁTICA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--border-color)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            <div>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredPersonal.length} registros)
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{ padding: "0.35rem 0.7rem", opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
              >
                ‹ Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={num === currentPage ? "btn-primary" : "btn-secondary"}
                  onClick={() => setCurrentPage(num)}
                  style={{ minWidth: "34px", padding: "0.35rem 0.6rem" }}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{ padding: "0.35rem 0.7rem", opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
              >
                Siguiente ›
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
