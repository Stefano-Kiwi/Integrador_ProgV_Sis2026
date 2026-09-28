import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`tremendo-header ${isScrolled ? "scrolled" : ""}`}
            id="tremendo-header"
        >
            <div className="nav-container">
                {/* 1. Marca / Logotipo */}
                <Link
                    to="/"
                    className="nav-brand"
                    id="brand-link"
                    aria-label="El Tremendo Gym Inicio"
                >
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
                    <span className="brand-text">
                        EL TREMENDO<span className="highlight"> GYM</span>
                    </span>
                </Link>

                {/* 2. Menú de Navegación Principal (Escritorio) */}
                <nav className="nav-menu" aria-label="Navegación principal">
                    <ul className="nav-links">
                        {/* Enlace: Login */}
                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                end
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                id="nav-gym"
                            >
                                <svg
                                    className="nav-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
                                </svg>
                                <span>Login</span>
                            </NavLink>
                        </li>

                        {/* Enlace: CLASES GRUPALES */}
                        <li className="nav-item">
                            <NavLink
                                to="/clases"
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                id="nav-clases"
                            >
                                <svg
                                    className="nav-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                                </svg>
                                <span>Clases Grupales</span>
                            </NavLink>
                        </li>

                        {/* Enlace: CANCHAS DEPORTIVAS */}
                        <li className="nav-item">
                            <NavLink
                                to="/canchas"
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                id="nav-canchas"
                            >
                                <svg
                                    className="nav-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                <span>Canchas Deportivas</span>
                            </NavLink>
                        </li>

                        {/* Enlace: PAGOS Y FACTURACIÓN */}
                        <li className="nav-item">
                            <NavLink
                                to="/pagos"
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                id="nav-pagos"
                            >
                                <svg
                                    className="nav-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                    <path d="M6 15h2M10 15h4" />
                                </svg>
                                <span>Pagos y Facturación</span>
                            </NavLink>
                        </li>

                        {/* Enlace: USUARIOS */}
                        <li className="nav-item">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                id="nav-usuarios"
                            >
                                <svg
                                    className="nav-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span>Usuarios</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Menú Desplegable: PERFIL */}
                <div className="profile-menu" id="profile-menu">
                    <Link
                        to="/profile"
                        className="profile-trigger"
                        id="profile-trigger"
                        aria-label="Abrir menú de usuario y perfil"
                        style={{ textDecoration: "none" }}
                    >
                        <div className="profile-avatar-wrap">
                            <div className="profile-avatar">Gym</div>
                            <span className="online-indicator" title="Conectado" />
                        </div>
                        <div className="profile-meta">
                            <span className="profile-name">Totalmente no soy el Mati</span>
                            <span className="profile-role">El Tremendo Plan</span>
                        </div>
                        <svg
                            className="profile-chevron"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
}
