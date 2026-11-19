import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {cerrarSesion, obtenerMiPerfil, obtenerToken,} from "../services/authService";
import { obtenerSedes } from "../services/sedesService";
import type { SedeApi } from "../services/sedesService";
import type { UsuarioSesion } from "../services/authService";
import {
  getPermisosUsuario,
  getRutasPermitidasAdmin,
  puedeAccederARutaAdmin,
} from "../services/permissions";
import { useAppStore } from "../store";

import "../admin.css";

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  const [intentoPerfil, setIntentoPerfil] = useState(0);

useEffect(() => {
  let activo = true;

  async function cargarPerfil() {
    setErrorPerfil(null);
    setUsuario(null);

    try {
      const perfil = await obtenerMiPerfil();

      if (activo) {
        setUsuario(perfil);
      }
    } catch (error) {
      if (!activo) return;

      if (!obtenerToken()) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setErrorPerfil(
        error instanceof TypeError
          ? "No se pudo conectar con el servidor."
          : error instanceof Error
            ? error.message
            : "No se pudo cargar el perfil.",
      );
    }
  }

  void cargarPerfil();

  return () => {
    activo = false;
  };
}, [navigate, intentoPerfil]);

function handleCerrarSesion() {
  cerrarSesion();
  navigate("/admin/login", { replace: true });
}
  const [currentSede, setCurrentSede] = useState("");
const [sedes, setSedes] = useState<SedeApi[]>([]);
const [cargandoSedes, setCargandoSedes] = useState(true);
const [errorSedes, setErrorSedes] = useState<string | null>(null);
const [intentoSedes, setIntentoSedes] = useState(0);

useEffect(() => {
  let activo = true;

  async function cargarSedes() {
    setCargandoSedes(true);
    setErrorSedes(null);

    try {
      const datos = await obtenerSedes();

      if (activo) {
        setSedes(datos);

        setCurrentSede((anterior) =>
          datos.some((sede) => String(sede.id) === anterior)
            ? anterior
            : "",
        );
      }
    } catch (error) {
      if (activo) {
        setErrorSedes(
          error instanceof TypeError
            ? "No se pudo conectar con el servidor."
            : error instanceof Error
              ? error.message
              : "No se pudieron cargar las sedes.",
        );
      }
    } finally {
      if (activo) {
        setCargandoSedes(false);
      }
    }
  }

  void cargarSedes();

  return () => {
    activo = false;
  };
}, [intentoSedes]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  interface NavItem {
    path: string;
    label: string;
    icon: ReactNode;
  }

  interface NavCategory {
    id: string;
    title: string;
    items: NavItem[];
  }

  const NAV_CATEGORIES: NavCategory[] = [
    {
      id: "general",
      title: "General",
      items: [
        {
          path: "/admin",
          label: "Dashboard",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
          ),
        },
      ],
    },
    {
      id: "operaciones",
      title: "Operaciones Deportivas",
      items: [
        {
          path: "/admin/clases",
          label: "Clases Grupales",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          ),
        },
        {
          path: "/admin/canchas",
          label: "Canchas",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          ),
        },
        {
          path: "/admin/reservas",
          label: "Reservas Canchas",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          ),
        },
        {
          path: "/admin/controlacceso",
          label: "Control de Acceso",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          ),
        },
      ],
    },
    {
      id: "socios",
      title: "Socios & Membresías",
      items: [
        {
          path: "/admin/socios",
          label: "Socios",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
        },
        {
          path: "/admin/membresias",
          label: "Membresías",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: "18px" }}
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M5 17v-1a4 4 0 0 1 8 0v1" />
              <path d="M15 8h3" />
              <path d="M15 12h3" />
              <path d="M15 16h3" />
            </svg>
          ),
        },
        {
          path: "/admin/planes",
          label: "Planes de Membresía",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          ),
        },
        {
          path: "/admin/pagos",
          label: "Reportes & Pagos",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ),
        },
      ],
    },
    {
      id: "estructura",
      title: "Estructura & Equipo",
      items: [
        {
          path: "/admin/sedes",
          label: "Sedes",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M3 21h18"></path>
              <path d="M5 21V7l8-4v18"></path>
              <path d="M19 21V11l-6-4"></path>
              <path d="M9 9h1"></path>
              <path d="M9 13h1"></path>
              <path d="M9 17h1"></path>
            </svg>
          ),
        },
        {
          path: "/admin/personal",
          label: "Personal",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
        },
        {
          path: "/admin/instructores",
          label: "Instructores",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          ),
        },
      ],
    },
    {
      id: "catalogos",
      title: "Catálogos & Config.",
      items: [
        {
          path: "/admin/tipos-clase",
          label: "Tipos de Clase",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          ),
        },
        {
          path: "/admin/tipos-cancha",
          label: "Tipos de Cancha",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          ),
        },
      ],
    },
    {
      id: "reportes-config",
      title: "Reportes & Sistema (Fase 5)",
      items: [
        {
          path: "/admin/reportes",
          label: "Reportes Consolidados",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ),
        },
        {
          path: "/admin/configuracion",
          label: "Configuración Global",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
        },
      ],
    },
  ];

  const permisos = getPermisosUsuario(usuario);
  const { seleccionarSede } = useAppStore();

  // Bloqueo por URL directa según rol centralizado (permissions.ts)
  useEffect(() => {
    if (!usuario) return;
    if (!puedeAccederARutaAdmin(location.pathname, usuario)) {
      navigate("/403", { replace: true });
    }
  }, [usuario, location.pathname, navigate]);

  // Si es Gerente, fijar siempre su sede asignada (no puede cambiar manualmente a otra sede)
  useEffect(() => {
    if (permisos.esGerente && permisos.sedeAsignadaId) {
      setCurrentSede(String(permisos.sedeAsignadaId));
      seleccionarSede(permisos.sedeAsignadaId);
    }
  }, [permisos.esGerente, permisos.sedeAsignadaId, seleccionarSede]);

  const rutasPermitidas = getRutasPermitidasAdmin(usuario);
  const activeSedeData = sedes.find((sede) => String(sede.id) === currentSede,);

  // Filtrado de categorías e ítems autorizados por el rol activo
  const visibleCategories = NAV_CATEGORIES.map((category) => ({...category, 
  items: category.items.filter((item) => rutasPermitidas.includes(item.path), ),})).filter((category) => category.items.length > 0);

  return (
    <div className="admin-body-wrapper">
      {/* SIDEBAR COLAPSABLE */}
      <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* CABECERA BRAND & BOTÓN TOGGLE */}
        <div className="brand-header">
          <div className="brand" title="FitZone Panel">
            <svg viewBox="0 0 24 24" fill="var(--accent-orange)" style={{ width: "24px", minWidth: "24px", flexShrink: 0 }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            {!isCollapsed && (
              <div className="brand-title">
                FITZONE <span>PANEL</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Abrir menú (expandir)" : "Cerrar menú (colapsar)"}
            aria-label={isCollapsed ? "Abrir menú lateral" : "Cerrar menú lateral"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {isCollapsed ? (
                <polyline points="9 18 15 12 9 6"></polyline>
              ) : (
                <polyline points="15 18 9 12 15 6"></polyline>
              )}
            </svg>
          </button>
        </div>

      {/* CONSULTA DE SEDES */}
      {!isCollapsed && (
        <div className="sede-selector-box">
          <label className="sede-selector-label" htmlFor="sede-select">
            Consultar sede:
          </label>

          {cargandoSedes ? (
            <p role="status">Cargando sedes...</p>
          ) : errorSedes ? (
            <div>
              <p role="alert">{errorSedes}</p>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIntentoSedes((actual) => actual + 1)}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <select
                id="sede-select"
                className="sede-select-dropdown"
                value={currentSede}
                disabled={sedes.length === 0 || !permisos.puedeCambiarDeSede}
                onChange={(event) => {
                  if (!permisos.puedeCambiarDeSede) return;
                  setCurrentSede(event.target.value);
                  seleccionarSede(Number(event.target.value) || null);
                }}
              >
                <option value="">
                  {sedes.length === 0
                    ? "No hay sedes registradas"
                    : "Seleccioná una sede"}
                </option>

                {sedes.map((sede) => (
                  <option key={sede.id} value={String(sede.id)}>
                    {sede.nombre}
                  </option>
                ))}
              </select>

              {activeSedeData && (
                <div style={{ marginTop: "0.75rem" }}>
                  <p style={{ color: "var(--text-muted)" }}>
                    {activeSedeData.localidad}
                  </p>

                  <Link
                    to={`/admin/sedes/${activeSedeData.id}`}
                    className="btn-secondary"
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                      marginTop: "0.5rem",
                    }}
                  >
                    Ver detalle
                  </Link>
                </div>
              )}

              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: "0.75rem" }}
                onClick={() => setIntentoSedes((actual) => actual + 1)}
              >
                Actualizar sedes
              </button>
            </>
          )}
        </div>
      )}
      
        {/* MENÚ DE NAVEGACIÓN AGRUPADO POR CATEGORÍAS */}
        <nav className="nav-menu">
          {visibleCategories.map((category, catIndex) => (
            <div key={category.id} className="nav-group">
              {catIndex > 0 && <div className="nav-group-divider" />}
              {!isCollapsed && (
                <div className="nav-group-title">
                  <span>{category.title}</span>
                </div>
              )}
              <div className="nav-group-items">
                {category.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/admin" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-link ${isActive ? "active" : ""}`}
                      title={item.label}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        
        <div
  className="user-profile"
  title={
    usuario
      ? `${usuario.nombre} ${usuario.apellido} · ${usuario.rol.clase_rol}`
      : "Perfil de la sesión"
  }
>
  <div
    className="user-avatar"
    aria-hidden="true"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--accent-orange)",
      color: "#fff",
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {usuario
      ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`
      : "…"}
  </div>

  {!isCollapsed && (
    <div className="user-info">
      {usuario ? (
        <>
          <h4>
            {usuario.nombre} {usuario.apellido}
          </h4>
          <span className="user-role-badge">
            {usuario.rol.clase_rol}
          </span>
        </>
      ) : errorPerfil ? (
        <>
          <p role="alert">{errorPerfil}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIntentoPerfil((actual) => actual + 1)}
          >
            Reintentar
          </button>
        </>
      ) : (
        <span role="status">Cargando perfil...</span>
      )}
    </div>
  )}
</div>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleCerrarSesion}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          style={{
            margin: "0.75rem",
            padding: "0.75rem",
            flexShrink: 0,
          }}
        >
          {isCollapsed ? "Salir" : "Cerrar sesión"}
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

