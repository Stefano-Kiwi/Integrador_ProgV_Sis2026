import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSedeById, getSedes } from "../../data/sedesData";
import "../../admin.css";

export default function AdminSedeDetalle() {
  const { id } = useParams<{ id: string }>();

  // Buscar la sede seleccionada o fallback a la primera
  const initialSede = (id ? getSedeById(id) : null) || getSedes()[0];
  const sede = initialSede;

  // Simulador de Aforo dinámico (RF-05 / RN-01)
  const [aforo, setAforo] = useState(sede.aforoActual);

  const porcentajeAforo = Math.min(100, Math.round((aforo / sede.capacidadMax) * 100));
  const aforoColor =
    porcentajeAforo >= 90
      ? "var(--accent-red)"
      : porcentajeAforo >= 75
      ? "var(--accent-yellow)"
      : "var(--accent-green)";

  const handleSimularEntrada = () => {
    if (aforo < sede.capacidadMax) {
      setAforo((prev) => prev + 1);
    } else {
      alert("¡Alerta de Aforo! La sede ha alcanzado su capacidad máxima permitida (RF-05). Molinetes bloqueados.");
    }
  };

  const handleSimularSalida = () => {
    if (aforo > 0) {
      setAforo((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* NAVEGACION BREADCRUMB */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
        <Link to="/admin/sedes" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          ← Volver a Sedes (S-01)
        </Link>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Ficha Técnica (S-03)</span>
      </div>

      {/* BANNER PRINCIPAL DE LA SEDE */}
      <div
        className="sede-detail-banner-header"
        style={{ backgroundImage: `url('${sede.imagenUrl}')` }}
      >
        <div className="sede-detail-banner-content">
          <div className="sede-detail-title-box">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
              <span
                style={{
                  background: "var(--accent-orange)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                }}
              >
                S-03 DETALLE
              </span>
              <span
                style={{
                  background: sede.estado === "Operativa" ? "rgba(0, 255, 135, 0.2)" : "rgba(255, 176, 32, 0.2)",
                  color: sede.estado === "Operativa" ? "var(--accent-green)" : "var(--accent-yellow)",
                  border: `1px solid ${sede.estado === "Operativa" ? "var(--accent-green)" : "var(--accent-yellow)"}`,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "12px",
                }}
              >
                ● {sede.estado}
              </span>
            </div>
            <h1>{sede.nombre}</h1>
            <p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {sede.direccion} • {sede.ciudad}, {sede.provincia}
            </p>
          </div>

          <div className="sede-detail-header-actions">
            <Link to={`/admin/sedes/${sede.id}/editar`} className="btn-secondary" style={{ textDecoration: "none" }}>
              ✏️ Modificar Sede (S-02)
            </Link>
            <Link to="/admin/controlacceso" className="btn-primary" style={{ textDecoration: "none" }}>
              📡 Molinete en Vivo (A-01)
            </Link>
          </div>
        </div>
      </div>

      {/* METRICAS CLAVE DE ESTA SEDE */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Aforo Local</span>
            <span>👥</span>
          </div>
          <div className="sede-metric-val" style={{ color: aforoColor }}>
            {porcentajeAforo}%
          </div>
          <div className="sede-metric-sub" style={{ color: aforoColor }}>
            <span>{aforo} / {sede.capacidadMax} personas</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Socios Locales</span>
            <span>💳</span>
          </div>
          <div className="sede-metric-val">{sede.sociosAsignados.toLocaleString()}</div>
          <div className="sede-metric-sub">
            <span>Sede con libre acceso multi-sede</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Canchas Deportivas</span>
            <span>🎾</span>
          </div>
          <div className="sede-metric-val">{sede.canchas.length}</div>
          <div className="sede-metric-sub" style={{ color: "var(--text-muted)" }}>
            <span>{sede.canchas.filter((c) => c.estado === "Disponible").length} disponibles hoy</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Clases de Hoy</span>
            <span>📅</span>
          </div>
          <div className="sede-metric-val">{sede.clasesHoy.length}</div>
          <div className="sede-metric-sub">
            <span>{sede.salasCount} salas activas</span>
          </div>
        </div>
      </div>

      {/* GRID DE DOS COLUMNAS */}
      <div className="sede-detail-grid">
        {/* COLUMNA IZQUIERDA: AFORO + CANCHAS + CLASES */}
        <div>
          {/* SIMULADOR DE AFORO EN VIVO (RF-05) */}
          <div className="sede-aforo-interactive-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Monitoreo de Aforo en Tiempo Real (RF-05)</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Validación instantánea por torniquetes y lectores QR de FitZone
                </p>
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: aforoColor,
                  border: `1px solid ${aforoColor}`,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "20px",
                }}
              >
                {porcentajeAforo >= 90 ? "CAPACIDAD CRÍTICA" : "NIVEL ESTABLE"}
              </span>
            </div>

            <div className="aforo-counter-row">
              <div>
                <span className="aforo-number-huge" style={{ color: aforoColor }}>
                  {aforo}
                </span>
                <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                  / {sede.capacidadMax} personas
                </span>
              </div>
              <div className="aforo-simulator-buttons">
                <button
                  type="button"
                  className="btn-aforo-sim"
                  onClick={handleSimularSalida}
                  title="Simular salida de un socio"
                >
                  - 1 Socio Sale
                </button>
                <button
                  type="button"
                  className="btn-aforo-sim"
                  onClick={handleSimularEntrada}
                  title="Simular ingreso por QR de un socio"
                  style={{ borderColor: "var(--accent-green)", color: "var(--accent-green)" }}
                >
                  + 1 Socio Entra (QR)
                </button>
              </div>
            </div>

            <div className="sede-aforo-bar-track" style={{ height: "10px" }}>
              <div
                className="sede-aforo-bar-fill"
                style={{
                  width: `${porcentajeAforo}%`,
                  backgroundColor: aforoColor,
                }}
              ></div>
            </div>
          </div>

          {/* CANCHAS DE LA SEDE (RF-09, RF-10, RF-12) */}
          <div className="sede-submodule-card">
            <div className="submodule-header">
              <div className="submodule-title">
                <span>🎾</span>
                <span>Canchas Deportivas Asignadas (RF-09)</span>
              </div>
              <Link to="/admin/canchas" style={{ color: "var(--accent-orange)", fontSize: "0.85rem", textDecoration: "none" }}>
                Ver Grilla Completa de Turnos →
              </Link>
            </div>

            <div className="canchas-status-list">
              {sede.canchas.map((cancha) => {
                const badgeColor =
                  cancha.estado === "Disponible"
                    ? "var(--accent-green)"
                    : cancha.estado === "Ocupada"
                    ? "var(--accent-orange)"
                    : "var(--accent-red)";

                return (
                  <div key={cancha.id} className="cancha-status-item">
                    <div className="cancha-status-top">
                      <div>
                        <div className="cancha-name">{cancha.nombre}</div>
                        <div className="cancha-type">{cancha.tipo}</div>
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: badgeColor,
                          background: "rgba(255,255,255,0.05)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          border: `1px solid ${badgeColor}`,
                        }}
                      >
                        {cancha.estado}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                      <span className="cancha-price-tag">
                        {cancha.precioHora > 0 ? `$${cancha.precioHora.toLocaleString()} / hr` : "En pausa"}
                      </span>
                      <Link
                        to="/admin/canchas"
                        className="btn-secondary"
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem", textDecoration: "none" }}
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLASES DE HOY EN LA SEDE (RF-06) */}
          <div className="sede-submodule-card">
            <div className="submodule-header">
              <div className="submodule-title">
                <span>📅</span>
                <span>Clases Grupales Programadas para Hoy (RF-06)</span>
              </div>
              <Link to="/admin/clases" style={{ color: "var(--accent-orange)", fontSize: "0.85rem", textDecoration: "none" }}>
                Ir a Agenda Semanal →
              </Link>
            </div>

            <table className="clases-simple-table">
              <thead>
                <tr>
                  <th>Horario</th>
                  <th>Actividad</th>
                  <th>Instructor</th>
                  <th>Sala</th>
                  <th>Ocupación / Cupo</th>
                </tr>
              </thead>
              <tbody>
                {sede.clasesHoy.map((clase) => {
                  const lleno = clase.cupoActual >= clase.cupoMax;
                  return (
                    <tr key={clase.id}>
                      <td style={{ fontWeight: 700, color: "var(--accent-orange)" }}>{clase.horario}</td>
                      <td style={{ fontWeight: 600 }}>{clase.nombre}</td>
                      <td style={{ color: "var(--text-muted)" }}>{clase.instructor}</td>
                      <td>{clase.sala}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: lleno ? "var(--accent-yellow)" : "var(--accent-green)",
                          }}
                        >
                          {clase.cupoActual} / {clase.cupoMax}
                        </span>
                        {lleno && (
                          <span style={{ fontSize: "0.75rem", color: "var(--accent-yellow)", marginLeft: "0.4rem" }}>
                            (Lista de Espera)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN TÉCNICA Y STAFF */}
        <div>
          {/* FICHA TÉCNICA DE LA SUCURSAL */}
          <div className="sede-info-sidebar-box">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Información de Contacto & Operaciones
            </h3>

            <div className="info-item-block">
              <span className="info-item-label">Dirección</span>
              <span className="info-item-value">{sede.direccion}</span>
            </div>

            <div className="info-item-block">
              <span className="info-item-label">Localidad</span>
              <span className="info-item-value">{sede.ciudad}, {sede.provincia}</span>
            </div>

            <div className="info-item-block">
              <span className="info-item-label">Teléfono Central</span>
              <span className="info-item-value">{sede.telefono}</span>
            </div>

            <div className="info-item-block">
              <span className="info-item-label">Email Operativo</span>
              <span className="info-item-value">{sede.email}</span>
            </div>

            <div className="info-item-block">
              <span className="info-item-label">Horario de Atención</span>
              <span className="info-item-value">{sede.horario}</span>
            </div>

            <div className="info-item-block">
              <span className="info-item-label">Instalaciones & Servicios</span>
              <div className="sede-services-tags" style={{ marginTop: "0.3rem" }}>
                {sede.servicios.map((srv, idx) => (
                  <span key={idx} className="sede-service-chip">
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* EQUIPO Y PERSONAL DE LA SEDE (A3 / A4) */}
          <div className="sede-info-sidebar-box" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Personal Asignado a la Sede
            </h3>

            {sede.staff.map((persona) => (
              <div key={persona.id} className="staff-member-row">
                <div>
                  <div className="staff-name">{persona.nombre}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{persona.turno}</div>
                </div>
                <span className="staff-role-badge">{persona.rol}</span>
              </div>
            ))}

            <button
              className="btn-secondary"
              style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.8rem", padding: "0.6rem" }}
              onClick={() => alert("Módulo PE-01 Personal se integrará en la Fase 2")}
            >
              Administrar Turnos de Personal →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
