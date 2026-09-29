import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
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
      label: "Canchas Deportivas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
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
    {
      path: "/admin/pagos",
      label: "Reportes & Analíticas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-body-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <svg viewBox="0 0 24 24" fill="var(--accent-orange)" style={{ width: "24px" }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <div className="brand-title">
            FITZONE <span>PANEL</span>
          </div>
        </div>
        <div className="brand-subtitle">Sedes autorizadas: 25+</div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)) ? "active" : ""
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-profile">
          <div className="user-avatar" style={{ backgroundImage: "url('/src/assets/gerardo.jpg')" }}></div>
          <div className="user-info">
            <h4>Gerardo Ruiz</h4>
            <p>Gerente Central</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
