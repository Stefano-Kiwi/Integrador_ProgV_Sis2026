import { useState } from "react";
import { Link } from "react-router-dom";
import "../../admin.css";
import {
  getConfiguracionGlobal,
  saveConfiguracionGlobal,
  resetConfiguracionGlobal,
  type ConfiguracionGlobal,
} from "../../data/reportesConfigData";

type ConfigSection = "general" | "reglas" | "membresias" | "pagos" | "alertas";

export default function AdminConfiguracion() {
  const [config, setConfig] = useState<ConfiguracionGlobal>(() => getConfiguracionGlobal());
  const [activeSection, setActiveSection] = useState<ConfigSection>("general");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleInputChange = <K extends keyof ConfiguracionGlobal>(
    key: K,
    value: ConfiguracionGlobal[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveConfiguracionGlobal(config);
    setHasChanges(false);
    setToastMessage("¡Configuración global guardada correctamente en el sistema!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que desea restablecer la configuración global a los valores iniciales de fábrica?")) {
      const def = resetConfiguracionGlobal();
      setConfig(def);
      setHasChanges(false);
      setToastMessage("Configuración restablecida a los valores predeterminados.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="toast-feedback-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "20px" }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {toastMessage}
        </div>
      )}

      {/* BREADCRUMB */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        <Link to="/admin" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Admin
        </Link>
        <span>/</span>
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Configuración Global (CF-01)</span>
      </div>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              MÓDULO CF-01 · SISTEMA CORPORATIVO
            </span>
          </div>
          <h1>Configuración Global del Sistema</h1>
          <p>Definición de parámetros maestros, reglas de negocio, pasarelas de pago y políticas de red</p>
        </div>

        <div className="header-controls">
          <button className="sede-btn-edit" onClick={handleReset}>
            Restablecer Valores
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Guardar Cambios
          </button>
        </div>
      </header>

      {/* LAYOUT EN DOS COLUMNAS */}
      <div className="config-layout-grid">
        {/* MENÚ DE SECCIONES DE CONFIGURACIÓN */}
        <nav className="config-nav-menu">
          <button
            className={`config-nav-btn ${activeSection === "general" ? "active" : ""}`}
            onClick={() => setActiveSection("general")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            1. Parámetros de Cadena
          </button>

          <button
            className={`config-nav-btn ${activeSection === "reglas" ? "active" : ""}`}
            onClick={() => setActiveSection("reglas")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            2. Reglas & Deporte (Strategy)
          </button>

          <button
            className={`config-nav-btn ${activeSection === "membresias" ? "active" : ""}`}
            onClick={() => setActiveSection("membresias")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            3. Membresías & Mora (RN-03)
          </button>

          <button
            className={`config-nav-btn ${activeSection === "pagos" ? "active" : ""}`}
            onClick={() => setActiveSection("pagos")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            4. Pasarela de Pagos (RF-13)
          </button>

          <button
            className={`config-nav-btn ${activeSection === "alertas" ? "active" : ""}`}
            onClick={() => setActiveSection("alertas")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            5. Alertas & Observer (RF-08)
          </button>
        </nav>

        {/* PANEL DE DETALLE ACTIVO */}
        <div className="config-card-pane">
          {/* SECCIÓN 1: PARÁMETROS GENERALES */}
          {activeSection === "general" && (
            <>
              <div className="config-pane-header">
                <h2 className="config-pane-title">
                  <span style={{ color: "var(--accent-orange)" }}>01.</span> Parámetros Corporativos de la Cadena
                </h2>
                <p className="config-pane-subtitle">
                  Información legal, institucional y configuración base que rige en todas las sucursales
                </p>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Nombre Comercial de la Cadena</span>
                  <span className="config-row-desc">Marca pública visualizada en el portal de socios y en los comprobantes</span>
                </div>
                <div className="config-row-control">
                  <input
                    type="text"
                    className="form-control"
                    value={config.cadenaNombre}
                    onChange={(e) => handleInputChange("cadenaNombre", e.target.value)}
                  />
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Razón Social y CUIT</span>
                  <span className="config-row-desc">Datos fiscales para facturación electrónica y recibos válidos</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Razón Social"
                    value={config.cadenaRazonSocial}
                    onChange={(e) => handleInputChange("cadenaRazonSocial", e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: "140px" }}
                    placeholder="CUIT"
                    value={config.cadenaCuit}
                    onChange={(e) => handleInputChange("cadenaCuit", e.target.value)}
                  />
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Moneda Predeterminada del Sistema</span>
                  <span className="config-row-desc">Moneda de cotización para cuotas, alquileres y turnos</span>
                </div>
                <div className="config-row-control">
                  <select
                    className="form-control"
                    value={config.cadenaMoneda}
                    onChange={(e) => handleInputChange("cadenaMoneda", e.target.value)}
                  >
                    <option value="ARS ($)">ARS ($) - Peso Argentino</option>
                    <option value="USD ($)">USD ($) - Dólar Estadounidense</option>
                  </select>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Zona Horaria Oficial</span>
                  <span className="config-row-desc">Alineación para slots de reservas de canchas y turnos de clase</span>
                </div>
                <div className="config-row-control">
                  <input
                    type="text"
                    className="form-control"
                    value={config.cadenaZonaHoraria}
                    disabled
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Modo Mantenimiento Global</span>
                  <span className="config-row-desc">Inhabilita temporalmente reservas para mantenimiento de servidores</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.modoMantenimientoGlobal}
                      onChange={(e) => handleInputChange("modoMantenimientoGlobal", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* SECCIÓN 2: REGLAS Y DEPORTE */}
          {activeSection === "reglas" && (
            <>
              <div className="config-pane-header">
                <h2 className="config-pane-title">
                  <span style={{ color: "var(--accent-orange)" }}>02.</span> Reglas de Negocio Deportivas (Patrón Strategy)
                </h2>
                <p className="config-pane-subtitle">
                  Estrategias de precio dinámico para canchas (RF-11) y normas de reserva de clases (RF-06/07)
                </p>
              </div>

              <div className="config-callout-box">
                <div className="config-callout-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="config-callout-text">
                  <h4>Patrón Strategy Activo para Liquidación de Canchas (RF-11)</h4>
                  <p>
                    El cálculo final de la cancha se efectúa con la interfaz <code>PricingStrategy</code>: aplica la tarifa base, descuenta beneficio al socio activo y aplica recargo nocturno según las franjas configuradas abajo.
                  </p>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Tarifa Horario Pico (Peak Hour Strategy)</span>
                  <span className="config-row-desc">Aplica recargo automático a los turnos nocturnos de alta demanda</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.horarioPicoHabilitado}
                      onChange={(e) => handleInputChange("horarioPicoHabilitado", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>

              {config.horarioPicoHabilitado && (
                <div className="config-row-item" style={{ backgroundColor: "rgba(255, 176, 32, 0.04)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div className="config-row-info">
                    <span className="config-row-label">Franja Horaria Pico y Recargo (%)</span>
                    <span className="config-row-desc">Rango de horas y porcentaje adicional sobre el costo base de cancha</span>
                  </div>
                  <div className="config-row-control" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="time"
                      className="form-control"
                      value={config.horarioPicoInicio}
                      onChange={(e) => handleInputChange("horarioPicoInicio", e.target.value)}
                    />
                    <span>a</span>
                    <input
                      type="time"
                      className="form-control"
                      value={config.horarioPicoFin}
                      onChange={(e) => handleInputChange("horarioPicoFin", e.target.value)}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "0.5rem" }}>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "70px" }}
                        min="0"
                        max="100"
                        value={config.recargoHorarioPicoPct}
                        onChange={(e) => handleInputChange("recargoHorarioPicoPct", Number(e.target.value))}
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Descuento a Socios Activos en Canchas</span>
                  <span className="config-row-desc">Porcentaje bonificado en alquiler de espacios para usuarios con membresía al día</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="0"
                    max="100"
                    value={config.descuentoSocioCanchaPct}
                    onChange={(e) => handleInputChange("descuentoSocioCanchaPct", Number(e.target.value))}
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Anticipación de Reserva de Clases (RF-07)</span>
                  <span className="config-row-desc">Días máximos con los que un socio puede apartar cupo en clases grupales</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="1"
                    max="15"
                    value={config.diasAnticipacionClases}
                    onChange={(e) => handleInputChange("diasAnticipacionClases", Number(e.target.value))}
                  />
                  <span>días ({config.diasAnticipacionClases * 24} hs)</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Límite de Cancelación sin Penalidad</span>
                  <span className="config-row-desc">Horas antes de la clase en que se puede cancelar liberando cupo sin sanción</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="1"
                    max="24"
                    value={config.limiteHorasCancelacionSinPenalidad}
                    onChange={(e) => handleInputChange("limiteHorasCancelacionSinPenalidad", Number(e.target.value))}
                  />
                  <span>horas</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Validación Anti-Duplicación de Sedes (RN-01)</span>
                  <span className="config-row-desc">Impide que un mismo socio esté presente en dos sedes al mismo tiempo</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.antiDuplicacionSedesHabilitada}
                      onChange={(e) => handleInputChange("antiDuplicacionSedesHabilitada", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* SECCIÓN 3: MEMBRESÍAS Y MOROSIDAD */}
          {activeSection === "membresias" && (
            <>
              <div className="config-pane-header">
                <h2 className="config-pane-title">
                  <span style={{ color: "var(--accent-orange)" }}>03.</span> Políticas de Membresía y Control de Mora
                </h2>
                <p className="config-pane-subtitle">
                  Reglas de vencimiento de cuota, días de gracia y restricción automática de beneficios (RN-03)
                </p>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Días de Gracia para Vencimiento</span>
                  <span className="config-row-desc">Plazo en el que el socio sigue gozando de acceso con aviso preventivo</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="0"
                    max="30"
                    value={config.diasGraciaMorosidad}
                    onChange={(e) => handleInputChange("diasGraciaMorosidad", Number(e.target.value))}
                  />
                  <span>días</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Suspensión de Beneficios por Mora (RN-03)</span>
                  <span className="config-row-desc">Bloquea reservas de clases y tarifa con descuento a socios con cuota impaga</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.bloquearTurnosSocioMoroso}
                      onChange={(e) => handleInputChange("bloquearTurnosSocioMoroso", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Facturación Electrónica Automática (RF-14)</span>
                  <span className="config-row-desc">Emisión automática de CAE y ticket PDF con cada pago registrado</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.facturaElectronicaAutoHabilitada}
                      onChange={(e) => handleInputChange("facturaElectronicaAutoHabilitada", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* SECCIÓN 4: PASARELA DE PAGOS */}
          {activeSection === "pagos" && (
            <>
              <div className="config-pane-header">
                <h2 className="config-pane-title">
                  <span style={{ color: "var(--accent-orange)" }}>04.</span> Pasarela de Pagos Simulada (RF-13 / RNF-02)
                </h2>
                <p className="config-pane-subtitle">
                  Integración con pasarela mock (MercadoPago / Modo / Payway) garantizando tokenización segura
                </p>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Proveedor de Pasarela</span>
                  <span className="config-row-desc">Entorno de procesamiento activo para cobros de señas y membresías</span>
                </div>
                <div className="config-row-control">
                  <select
                    className="form-control"
                    value={config.pasarelaProveedor}
                    onChange={(e) => handleInputChange("pasarelaProveedor", e.target.value as any)}
                  >
                    <option value="mercadopago">MercadoPago Checkout Pro (Mock)</option>
                    <option value="modo">MODO Transferencias (Simulador)</option>
                    <option value="payway">Payway Prisma (Sandbox)</option>
                  </select>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Modo Sandbox de Pruebas</span>
                  <span className="config-row-desc">Permite simular aprobaciones, rechazos y pagos sin impacto real</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.pasarelaModoSandbox}
                      onChange={(e) => handleInputChange("pasarelaModoSandbox", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Public Key (Clave Pública)</span>
                  <span className="config-row-desc">Identificador del comercio en la pasarela para tokenizar tarjetas (RNF-02)</span>
                </div>
                <div className="config-row-control">
                  <input
                    type="text"
                    className="form-control"
                    value={config.pasarelaPublicKeyMock}
                    onChange={(e) => handleInputChange("pasarelaPublicKeyMock", e.target.value)}
                  />
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Comisión Estimada por Transacción</span>
                  <span className="config-row-desc">Tasa porcentual descontada en los reportes consolidados financieros</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    style={{ width: "80px" }}
                    value={config.pasarelaComisionPct}
                    onChange={(e) => handleInputChange("pasarelaComisionPct", Number(e.target.value))}
                  />
                  <span>%</span>
                </div>
              </div>
            </>
          )}

          {/* SECCIÓN 5: ALERTAS Y OBSERVER */}
          {activeSection === "alertas" && (
            <>
              <div className="config-pane-header">
                <h2 className="config-pane-title">
                  <span style={{ color: "var(--accent-orange)" }}>05.</span> Alertas Automáticas & Patrón Observer
                </h2>
                <p className="config-pane-subtitle">
                  Gestión de suscripciones a eventos de lista de espera (RF-08) y aforo crítico (RF-05)
                </p>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Reasignación Observer de Lista de Espera</span>
                  <span className="config-row-desc">Notifica instantáneamente al primer socio en cola al liberarse un cupo</span>
                </div>
                <div className="config-row-control">
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.notificarWhatsappListaEspera}
                      onChange={(e) => handleInputChange("notificarWhatsappListaEspera", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Capacidad Máxima de Lista de Espera (C-06)</span>
                  <span className="config-row-desc">Cantidad tope de socios que pueden anotarse en cola por clase</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="1"
                    max="50"
                    value={config.capacidadMaxListaEspera}
                    onChange={(e) => handleInputChange("capacidadMaxListaEspera", Number(e.target.value))}
                  />
                  <span>socios</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Tiempo de Espera para Confirmar Cupo</span>
                  <span className="config-row-desc">Minutos concedidos al socio notificado antes de rotar al siguiente en fila</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="5"
                    max="60"
                    value={config.tiempoEsperaConfirmacionMinutos}
                    onChange={(e) => handleInputChange("tiempoEsperaConfirmacionMinutos", Number(e.target.value))}
                  />
                  <span>minutos</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Frecuencia de Rotación de QR de Socio (RF-04)</span>
                  <span className="config-row-desc">Genera nuevo token temporal para impedir capturas de pantalla compartidas</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    min="15"
                    max="300"
                    value={config.tiempoRotacionQrSegundos}
                    onChange={(e) => handleInputChange("tiempoRotacionQrSegundos", Number(e.target.value))}
                  />
                  <span>segundos</span>
                </div>
              </div>

              <div className="config-row-item">
                <div className="config-row-info">
                  <span className="config-row-label">Alerta por Aforo Crítico Multi-Sede (RF-05)</span>
                  <span className="config-row-desc">Avisa al panel del recepcionista cuando el aforo supera el umbral límite</span>
                </div>
                <div className="config-row-control" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label className="switch-box">
                    <input
                      type="checkbox"
                      checked={config.notificarAlertaAforoCritico}
                      onChange={(e) => handleInputChange("notificarAlertaAforoCritico", e.target.checked)}
                    />
                    <span className="switch-track"></span>
                  </label>
                  {config.notificarAlertaAforoCritico && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "70px" }}
                        min="50"
                        max="98"
                        value={config.aforoCriticoUmbralPct}
                        onChange={(e) => handleInputChange("aforoCriticoUmbralPct", Number(e.target.value))}
                      />
                      <span>%</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* BARRA FLOTANTE DE GUARDADO */}
      <div className="config-sticky-actions">
        <div className="config-actions-msg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", color: hasChanges ? "var(--accent-yellow)" : "var(--accent-green)" }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {hasChanges ? "Hay modificaciones no guardadas en este formulario." : "Todos los parámetros se encuentran sincronizados."}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="sede-btn-edit" onClick={handleReset}>
            Descartar
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Guardar Configuración Global
          </button>
        </div>
      </div>
    </>
  );
}
