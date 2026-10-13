import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const LOCALIDADES = ["Concordia", "Federación", "Chajarí"] as const;
type Localidad = (typeof LOCALIDADES)[number];

export default function Navbar() {
    const navigate = useNavigate();
    const [locality, setLocality] = useState<Localidad>("Concordia");

    const [isScrolled, setIsScrolled] = useState(false);
    const [isLocalityOpen, setIsLocalityOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const localityRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Manejo de Click-Away (cerrar al hacer clic fuera) y Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (localityRef.current && !localityRef.current.contains(event.target as Node)) {
                setIsLocalityOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsLocalityOpen(false);
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleSelectLocality = (city: Localidad) => {
        setLocality(city);
        setIsLocalityOpen(false);
    };

    const handleGoToProfile = () => {
        setIsProfileOpen(false);
        navigate("/perfil");
    };

    const handleGoToEditProfile = () => {
        setIsProfileOpen(false);
        navigate("/perfil/editar");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        setIsProfileOpen(false);
        navigate("/login");
    };

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
                    </ul>
                </nav>

                {/* 3. Acciones de Usuario: Menús Desplegables de Localidad y Perfil */}
                <div className="nav-user-controls" id="nav-user-controls">
                    {/* Menú Desplegable: Localidad */}
                    <div className="localidad-menu" id="localidad-menu-wrapper" ref={localityRef}>
                        <button
                            type="button"
                            className={`localidad-trigger ${isLocalityOpen ? "active" : ""}`}
                            id="localidad-trigger"
                            aria-label="Abrir menú de localidad"
                            aria-haspopup="true"
                            aria-expanded={isLocalityOpen}
                            onClick={() => {
                                setIsLocalityOpen((prev) => !prev);
                                setIsProfileOpen(false);
                            }}
                        >
                            <div className="localidad-icon-wrap">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div className="localidad-meta">
                                <span className="localidad-label">Localidad</span>
                                <span className="localidad-name">{locality}</span>
                            </div>
                            <svg
                                className={`profile-chevron ${isLocalityOpen ? "open" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Lista desplegable con opciones: Concordia, Federación, Chajarí */}
                        {isLocalityOpen && (
                            <div
                                className="nav-dropdown-menu localidad-dropdown"
                                role="menu"
                                aria-label="Seleccionar localidad activa"
                            >
                                <div className="dropdown-header">
                                    <span className="dropdown-header-title">SELECCIONAR LOCALIDAD</span>
                                </div>
                                {LOCALIDADES.map((city) => {
                                    const isSelected = locality === city;
                                    return (
                                        <button
                                            key={city}
                                            type="button"
                                            role="menuitem"
                                            className={`dropdown-item ${isSelected ? "active" : ""}`}
                                            onClick={() => handleSelectLocality(city)}
                                        >
                                            <div className="dropdown-item-left">
                                                <svg
                                                    className="dropdown-item-icon"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                <span>{city}</span>
                                            </div>
                                            {isSelected && (
                                                <svg
                                                    className="dropdown-item-check"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Menú Desplegable: PERFIL */}
                    <div className="profile-menu" id="profile-menu-wrapper" ref={profileRef}>
                        <button
                            type="button"
                            className={`profile-trigger ${isProfileOpen ? "active" : ""}`}
                            id="profile-trigger"
                            aria-label="Abrir menú de usuario y perfil"
                            aria-haspopup="true"
                            aria-expanded={isProfileOpen}
                            onClick={() => {
                                setIsProfileOpen((prev) => !prev);
                                setIsLocalityOpen(false);
                            }}
                        >
                            <div className="profile-avatar-wrap">
                                <div className="profile-avatar">Gym</div>
                                <span className="online-indicator" title="Conectado" />
                            </div>
                            <div className="profile-meta">
                                <span className="profile-name">Lucas Benítez</span>
                                <span className="profile-role">El Tremendo Plan</span>
                            </div>
                            <svg
                                className={`profile-chevron ${isProfileOpen ? "open" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Desplegable de Perfil: Ir a perfil y Cerrar sesión */}
                        {isProfileOpen && (
                            <div
                                className="nav-dropdown-menu profile-dropdown"
                                role="menu"
                                aria-label="Opciones de perfil de usuario"
                            >


                                <button
                                    type="button"
                                    role="menuitem"
                                    className="dropdown-item"
                                    id="btn-nav-ir-perfil"
                                    onClick={handleGoToProfile}
                                >
                                    <div className="dropdown-item-left">
                                        <svg
                                            className="dropdown-item-icon"
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
                                        <span>Mi perfil</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="dropdown-item"
                                    id="btn-nav-editar-perfil"
                                    onClick={handleGoToEditProfile}
                                >
                                    <div className="dropdown-item-left">
                                        <svg
                                            className="dropdown-item-icon"
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
                                    </div>
                                </button>

                                <div className="dropdown-divider" />

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="dropdown-item dropdown-item-danger"
                                    id="btn-nav-cerrar-sesion"
                                    onClick={handleLogout}
                                >
                                    <div className="dropdown-item-left">
                                        <svg
                                            className="dropdown-item-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        <span>Cerrar sesión</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
