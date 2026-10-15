import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";

interface AdminLayoutProps {
  children?: ReactNode;
}

type UserRole = "admin" | "gerente" | "recepcion" | "instructor";

interface RoleConfig {
  name: string;
  badge: string;
  avatar: string;
  allowedPaths: string[];
}

const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  admin: {
    name: "Gerardo Ruiz",
    badge: "Admin General",
    avatar: "/src/assets/gerardo.jpg",
    allowedPaths: [
      "/admin",
      "/admin/sedes",
      "/admin/personal",
      "/admin/instructores",
      "/admin/tipos-clase",
      "/admin/tipos-cancha",
      "/admin/planes",
      "/admin/socios",
      "/admin/clases",
      "/admin/canchas",
      "/admin/reservas",
      "/admin/controlacceso",
      "/admin/pagos",
      "/admin/reportes",
      "/admin/configuracion",
    ],
  },
  gerente: {
    name: "Valeria Morales",
    badge: "Gerente de Sede",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    allowedPaths: [
      "/admin",
      "/admin/sedes",
      "/admin/personal",
      "/admin/instructores",
      "/admin/tipos-clase",
      "/admin/tipos-cancha",
      "/admin/planes",
      "/admin/socios",
      "/admin/clases",
      "/admin/canchas",
      "/admin/reservas",
      "/admin/pagos",
      "/admin/reportes",
      "/admin/configuracion",
    ],
  },
  recepcion: {
    name: "Lucas Benítez",
    badge: "Recepcionista",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    allowedPaths: ["/admin/socios", "/admin/canchas", "/admin/reservas", "/admin/controlacceso", "/admin/pagos"],
  },
  instructor: {
    name: "Martín Palermo",
    badge: "Instructor Fitness",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    allowedPaths: ["/admin/clases", "/admin/instructores", "/admin/tipos-clase", "/admin/controlacceso"],
  },
};

const SEDES = [
  { id: "parana-centro", name: "Sede Paraná Centro (Central)", ciudad: "Paraná", aforo: "77% Aforo" },
  { id: "concordia-costanera", name: "Sede Concordia Costanera", ciudad: "Concordia", aforo: "75% Aforo" },
  { id: "gualeguaychu-parque", name: "Sede Gualeguaychú Parque", ciudad: "Gualeguaychú", aforo: "60% Aforo" },
  { id: "concepcion-uruguay", name: "Sede Concepción del Uruguay", ciudad: "C. del Uruguay", aforo: "78% Aforo" },
  { id: "colon-costa", name: "Sede Colón Río", ciudad: "Colón", aforo: "49% Aforo" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [currentSede, setCurrentSede] = useState<string>("parana-centro");
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

  const activeRoleData = ROLES_CONFIG[currentRole];
  const activeSedeData = SEDES.find((s) => s.id === currentSede) || SEDES[0];

  // Filtrado de categorías e ítems autorizados por el rol activo
  const visibleCategories = NAV_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => activeRoleData.allowedPaths.includes(item.path)),
  })).filter((category) => category.items.length > 0);

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

        {/* SELECTOR DE SEDE (OCULTO EN MODO COLAPSADO) */}
        {!isCollapsed && (
          <div className="sede-selector-box">
            <label className="sede-selector-label" htmlFor="sede-select">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "13px", height: "13px" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Sede Operativa Activa:
            </label>
            <select
              id="sede-select"
              className="sede-select-dropdown"
              value={currentSede}
              onChange={(e) => setCurrentSede(e.target.value)}
            >
              {SEDES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="sede-status-indicator">
              <span className="live-dot"></span>
              <span>{activeSedeData.ciudad} • {activeSedeData.aforo}</span>
            </div>
          </div>
        )}

        {/* SIMULADOR DE ROL (OCULTO EN MODO COLAPSADO) */}
        {!isCollapsed && (
          <div className="role-switcher-box">
            <label className="role-switcher-label" htmlFor="role-select">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "13px", height: "13px" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Rol de Usuario:
            </label>
            <select
              id="role-select"
              className="role-select-dropdown"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            >
              <option value="admin">Administrador General</option>
              <option value="gerente">Gerente de Sede</option>
              <option value="recepcion">Recepcionista</option>
              <option value="instructor">Instructor Fitness</option>
            </select>
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

        {/* PERFIL DEL USUARIO (CLICKABLE) */}
        <Link
          to="/profile"
          className="user-profile"
          title={isCollapsed ? `Perfil: ${activeRoleData.name} (${activeRoleData.badge})` : "Ver Perfil de Usuario"}
        >
          <div
            className="user-avatar"
            style={{
              backgroundImage: `url('${activeRoleData.avatar}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          {!isCollapsed && (
            <>
              <div className="user-info">
                <h4>{activeRoleData.name}</h4>
                <span className="user-role-badge">{activeRoleData.badge}</span>
              </div>
              <div className="user-profile-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </>
          )}
        </Link>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

