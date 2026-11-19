import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  // Estados de datos personales (estáticos con valores simulados)
  const [personalData, setPersonalData] = useState({
    nombreCompleto: "Lucas Benítez",
    username: "lucas.benitez",
    email: "lucas.benitez@eltremendo.com",
    telefono: "+54 9 11 4523-9981",
    dni: "40.892.112",
    domicilio: "Av. Cabildo 2450, Piso 4 B, Ciudad Autónoma de Buenos Aires",
  });

  // Estados de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Feedback visual simulado
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación visual estática para el usuario
    setProfileSuccessMsg("Datos personales actualizados correctamente (Simulación visual estática).");
    setTimeout(() => setProfileSuccessMsg(""), 4000);
  };

  const handleCancelPersonal = () => {
    navigate("/perfil");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación visual estática
    setPasswordSuccessMsg("Contraseña cambiada con éxito (Simulación visual estática).");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccessMsg(""), 4000);
  };

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    navigate("/perfil");
  };

  return (
    <div className="edit-profile-wrapper">
      <main className="edit-profile-container">
        {/* Encabezado Principal */}
        <header className="edit-profile-header">
          <div>
            <h1 className="edit-profile-title">
              EDITAR <span className="highlight">DATOS PERSONALES</span>
            </h1>
            <p className="edit-profile-subtitle">
              Gestiona tu información de contacto de socio y las credenciales de tu cuenta.
            </p>
          </div>

          <Link to="/perfil" className="back-to-profile-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Volver a Mi Perfil</span>
          </Link>
        </header>

        <div className="edit-profile-grid">
          {/* SECCIÓN 1: FORMULARIO DE DATOS PERSONALES */}
          <section className="edit-section-card" aria-labelledby="heading-personal-data">
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
                <h2 id="heading-personal-data">INFORMACIÓN GENERAL Y DE CONTACTO</h2>
              </div>
              <span className="card-title-badge">Socio Activo</span>
            </div>

            {profileSuccessMsg && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(0, 255, 135, 0.12)",
                  border: "1px solid rgba(0, 255, 135, 0.3)",
                  color: "var(--accent-neon)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>✓ {profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePersonal} className="edit-form-grid" autoComplete="off">
              {/* Nombre y Apellido */}
              <div className="form-group">
                <label htmlFor="nombreCompleto" className="input-label">
                  Nombre y Apellido
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    className="form-input"
                    value={personalData.nombreCompleto}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
              </div>

              {/* Nombre de Usuario */}
              <div className="form-group">
                <label htmlFor="username" className="input-label">
                  Nombre de Usuario
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                  </svg>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    value={personalData.username}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
              </div>

              {/* Correo Electrónico */}
              <div className="form-group">
                <label htmlFor="email" className="input-label">
                  Correo Electrónico
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={personalData.email}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label htmlFor="telefono" className="input-label">
                  Teléfono de Contacto
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-input"
                    value={personalData.telefono}
                    onChange={handlePersonalChange}
                  />
                </div>
              </div>

              {/* DNI / Documento */}
              <div className="form-group">
                <label htmlFor="dni" className="input-label">
                  DNI / Documento de Identidad
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="7" y1="8" x2="17" y2="8" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                  </svg>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    className="form-input"
                    value={personalData.dni}
                    onChange={handlePersonalChange}
                  />
                </div>
              </div>

              {/* Domicilio */}
              <div className="form-group full-span">
                <label htmlFor="domicilio" className="input-label">
                  Domicilio Habitual
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <input
                    type="text"
                    id="domicilio"
                    name="domicilio"
                    className="form-input"
                    value={personalData.domicilio}
                    onChange={handlePersonalChange}
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="edit-form-actions full-span">
                <button
                  type="button"
                  className="btn-edit-cancel"
                  onClick={handleCancelPersonal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-edit-save" id="btn-save-personal">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </section>

          {/* SECCIÓN 2: FORMULARIO DE CAMBIO DE CONTRASEÑA */}
          <section className="edit-section-card" aria-labelledby="heading-password-section">
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h2 id="heading-password-section">SEGURIDAD Y CAMBIO DE CONTRASEÑA</h2>
              </div>
              <span className="card-title-badge">Credenciales</span>
            </div>

            {passwordSuccessMsg && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(0, 255, 135, 0.12)",
                  border: "1px solid rgba(0, 255, 135, 0.3)",
                  color: "var(--accent-neon)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>✓ {passwordSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="edit-form-grid" autoComplete="off">
              {/* Contraseña Actual */}
              <div className="form-group full-span">
                <label htmlFor="currentPassword" className="input-label">
                  Contraseña Actual
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-input"
                    placeholder="Ingresa tu contraseña actual"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="form-group">
                <label htmlFor="newPassword" className="input-label">
                  Nueva Contraseña
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 2l-2 2m-1.5 1.5L12 11l4 4 5.5-5.5a2.12 2.12 0 0 0 0-3L19 4" />
                    <path d="M9 14l-4 4v4h4l4-4" />
                  </svg>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-input"
                    placeholder="Mínimo 8 caracteres"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Confirmación de Nueva Contraseña */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirmación de la Nueva Contraseña
                </label>
                <div className="input-container">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Repite la nueva contraseña"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Requisitos visuales de seguridad */}
              <div className="password-requirements full-span">
                <div className="req-title">Requisitos de seguridad recomendados</div>
                <ul className="req-list">
                  <li className="req-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Mínimo 8 caracteres de longitud</span>
                  </li>
                  <li className="req-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Al menos una letra mayúscula</span>
                  </li>
                  <li className="req-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Al menos un número o símbolo especial</span>
                  </li>
                </ul>
              </div>

              {/* Botones de Acción */}
              <div className="edit-form-actions full-span">
                <button
                  type="button"
                  className="btn-edit-cancel"
                  onClick={handleCancelPassword}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-edit-save" id="btn-change-password">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Cambiar Contraseña</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
