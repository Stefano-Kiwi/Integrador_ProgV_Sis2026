import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../admin.css";
import {
  MOCK_REPORTES_SEDES,
  MOCK_HISTORICO_MENSUAL,
  MOCK_DEPORTES_METRICAS,
  MOCK_CLASES_DEMANDA,
} from "../../data/reportesConfigData";

type PeriodoFilter = "mes" | "trimestre" | "semestre" | "anio";
type TabView = "financiero" | "canchas" | "clases" | "socios";

export default function AdminReportes() {
  const [periodo, setPeriodo] = useState<PeriodoFilter>("mes");
  const [selectedSedeId, setSelectedSedeId] = useState<string>("todas");
  const [activeTab, setActiveTab] = useState<TabView>("financiero");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatMoney = (val: number) => {
    return "$" + val.toLocaleString("es-AR");
  };

  // Filtrado de sedes
  const filteredSedes = useMemo(() => {
    if (selectedSedeId === "todas") return MOCK_REPORTES_SEDES;
    return MOCK_REPORTES_SEDES.filter((s) => s.sedeId === selectedSedeId);
  }, [selectedSedeId]);

  // Totales consolidados según filtro
  const totales = useMemo(() => {
    return filteredSedes.reduce(
      (acc, s) => ({
        ingresoTotal: acc.ingresoTotal + s.ingresoTotal,
        ingresoMembresias: acc.ingresoMembresias + s.ingresoMembresias,
        ingresoCanchas: acc.ingresoCanchas + s.ingresoCanchas,
        ingresoClases: acc.ingresoClases + s.ingresoClases,
        sociosActivos: acc.sociosActivos + s.sociosActivos,
        sociosNuevos: acc.sociosNuevos + s.sociosNuevos,
        sociosBajas: acc.sociosBajas + s.sociosBajas,
        horasCancha: acc.horasCancha + s.horasCanchaReservadas,
        clasesDictadas: acc.clasesDictadas + s.clasesDictadas,
        ocupacionPromedio: Math.round(
          (acc.ocupacionPromedio * acc.count + s.tasaOcupacionCanchas) / (acc.count + 1)
        ),
        aforoPromedio: Math.round(
          (acc.aforoPromedio * acc.count + s.aforoPromedio) / (acc.count + 1)
        ),
        asistenciaClases: Math.round(
          (acc.asistenciaClases * acc.count + s.asistenciaClasesPct) / (acc.count + 1)
        ),
        count: acc.count + 1,
      }),
      {
        ingresoTotal: 0,
        ingresoMembresias: 0,
        ingresoCanchas: 0,
        ingresoClases: 0,
        sociosActivos: 0,
        sociosNuevos: 0,
        sociosBajas: 0,
        horasCancha: 0,
        clasesDictadas: 0,
        ocupacionPromedio: 0,
        aforoPromedio: 0,
        asistenciaClases: 0,
        count: 0,
      }
    );
  }, [filteredSedes]);

  const maxIngresoSede = useMemo(() => {
    return Math.max(...MOCK_REPORTES_SEDES.map((s) => s.ingresoTotal), 1);
  }, []);

  const handleExport = () => {
    setShowExportModal(false);
    setToastMessage(`Generando y descargando informe gerencial (${exportFormat.toUpperCase()})...`);
    setTimeout(() => {
      setToastMessage("¡Informe generado y descargado con éxito!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
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
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Reportes Consolidados (RP-01)</span>
      </div>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              MÓDULO RP-01 · BUSINESS INTELLIGENCE
            </span>
          </div>
          <h1>Reportes Consolidados</h1>
          <p>Análisis integral de rendimiento financiero, ocupación deportiva y aforo multi-sede</p>
        </div>

        <div className="report-header-controls">
          {/* Selector de Período */}
          <div className="report-period-selector">
            <button
              className={`report-period-btn ${periodo === "mes" ? "active" : ""}`}
              onClick={() => setPeriodo("mes")}
            >
              Este Mes
            </button>
            <button
              className={`report-period-btn ${periodo === "trimestre" ? "active" : ""}`}
              onClick={() => setPeriodo("trimestre")}
            >
              Trimestre
            </button>
            <button
              className={`report-period-btn ${periodo === "semestre" ? "active" : ""}`}
              onClick={() => setPeriodo("semestre")}
            >
              Semestre
            </button>
            <button
              className={`report-period-btn ${periodo === "anio" ? "active" : ""}`}
              onClick={() => setPeriodo("anio")}
            >
              Año 2026
            </button>
          </div>

          {/* Selector de Sede */}
          <select
            className="form-control"
            style={{ width: "auto", minWidth: "180px", padding: "0.5rem 0.85rem", fontSize: "0.85rem" }}
            value={selectedSedeId}
            onChange={(e) => setSelectedSedeId(e.target.value)}
          >
            <option value="todas">🏢 Todas las Sedes (Red FitZone)</option>
            {MOCK_REPORTES_SEDES.map((s) => (
              <option key={s.sedeId} value={s.sedeId}>
                {s.nombreSede}
              </option>
            ))}
          </select>

          {/* Botón Exportar */}
          <button className="report-export-btn" onClick={() => setShowExportModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar Informe
          </button>
        </div>
      </header>

      {/* KPI METRICS OVERVIEW */}
      <section className="report-kpi-grid">
        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-label">Ingresos Consolidados</span>
            <div className="report-kpi-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="report-kpi-value">{formatMoney(totales.ingresoTotal)}</div>
          <div className="report-kpi-footer">
            <span className="trend-badge-up">↑ +14.2%</span>
            <span className="trend-badge-sub">vs. período anterior</span>
          </div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-label">Ocupación de Canchas</span>
            <div className="report-kpi-icon-wrap" style={{ backgroundColor: "rgba(0, 255, 135, 0.12)", color: "var(--accent-green)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
          </div>
          <div className="report-kpi-value">{totales.ocupacionPromedio}%</div>
          <div className="report-kpi-footer">
            <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>{totales.horasCancha} hs</span>
            <span className="trend-badge-sub">reservadas en el período</span>
          </div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-label">Asistencia a Clases</span>
            <div className="report-kpi-icon-wrap" style={{ backgroundColor: "rgba(255, 176, 32, 0.12)", color: "var(--accent-yellow)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
          </div>
          <div className="report-kpi-value">{totales.asistenciaClases}%</div>
          <div className="report-kpi-footer">
            <span style={{ color: "var(--accent-yellow)", fontWeight: 700 }}>{totales.clasesDictadas} clases</span>
            <span className="trend-badge-sub">dictadas con éxito</span>
          </div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-label">Socios Activos</span>
            <div className="report-kpi-icon-wrap" style={{ backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="report-kpi-value">{totales.sociosActivos.toLocaleString("es-AR")}</div>
          <div className="report-kpi-footer">
            <span className="trend-badge-up">+{totales.sociosNuevos} altas</span>
            <span className="trend-badge-sub">(-{totales.sociosBajas} bajas)</span>
          </div>
        </div>
      </section>

      {/* PESTAÑAS DE VISTA */}
      <div className="fase4-nav-tabs">
        <button
          className={`fase4-tab-link ${activeTab === "financiero" ? "active" : ""}`}
          onClick={() => setActiveTab("financiero")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          1. Rendimiento Financiero
        </button>

        <button
          className={`fase4-tab-link ${activeTab === "canchas" ? "active" : ""}`}
          onClick={() => setActiveTab("canchas")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          2. Canchas & Ocupación (Strategy)
        </button>

        <button
          className={`fase4-tab-link ${activeTab === "clases" ? "active" : ""}`}
          onClick={() => setActiveTab("clases")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          3. Clases & Lista de Espera (Observer)
        </button>

        <button
          className={`fase4-tab-link ${activeTab === "socios" ? "active" : ""}`}
          onClick={() => setActiveTab("socios")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          4. Socios, Mora & Retención (RN-03)
        </button>
      </div>

      {/* CONTENIDO TAB 1: FINANCIERO */}
      {activeTab === "financiero" && (
        <>
          {/* Gráfico de Barras: Recaudación por Sede */}
          <div className="chart-container-card">
            <div className="chart-card-header">
              <div className="chart-title-box">
                <h3>Recaudación Total Comparativa por Sede</h3>
                <p>Distribución de ingresos generados en el período seleccionado ($ ARS)</p>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--accent-orange)", fontWeight: 700 }}>
                Total: {formatMoney(totales.ingresoTotal)}
              </div>
            </div>

            <div className="bars-vertical-wrapper">
              {filteredSedes.map((sede) => {
                const heightPct = Math.round((sede.ingresoTotal / maxIngresoSede) * 100);
                return (
                  <div key={sede.sedeId} className="bar-column-group">
                    <div className="bar-pill-track">
                      <div className="bar-pill-fill" style={{ height: `${heightPct}%` }}>
                        <span className="bar-tooltip-val">{formatMoney(sede.ingresoTotal)}</span>
                      </div>
                    </div>
                    <span className="bar-bottom-label" title={sede.nombreSede}>
                      {sede.ciudad}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Barra de Distribución por Concepto */}
            <div className="stacked-distribution-box">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-pure)" }}>Distribución por Línea de Ingreso</span>
                <span style={{ color: "var(--text-muted)" }}>100% Consolidado</span>
              </div>
              <div className="stacked-bar-track">
                <div
                  className="stacked-segment segment-orange"
                  style={{ width: `${Math.round((totales.ingresoMembresias / totales.ingresoTotal) * 100)}%` }}
                  title="Membresías"
                ></div>
                <div
                  className="stacked-segment segment-green"
                  style={{ width: `${Math.round((totales.ingresoCanchas / totales.ingresoTotal) * 100)}%` }}
                  title="Canchas"
                ></div>
                <div
                  className="stacked-segment segment-yellow"
                  style={{ width: `${Math.round((totales.ingresoClases / totales.ingresoTotal) * 100)}%` }}
                  title="Clases Grupales"
                ></div>
              </div>
              <div className="distribution-legend-row">
                <div className="dist-legend-item">
                  <div className="dist-legend-bullet" style={{ backgroundColor: "var(--accent-orange)" }}></div>
                  <span>Membresías: <strong>{formatMoney(totales.ingresoMembresias)}</strong> ({Math.round((totales.ingresoMembresias / totales.ingresoTotal) * 100)}%)</span>
                </div>
                <div className="dist-legend-item">
                  <div className="dist-legend-bullet" style={{ backgroundColor: "var(--accent-green)" }}></div>
                  <span>Canchas: <strong>{formatMoney(totales.ingresoCanchas)}</strong> ({Math.round((totales.ingresoCanchas / totales.ingresoTotal) * 100)}%)</span>
                </div>
                <div className="dist-legend-item">
                  <div className="dist-legend-bullet" style={{ backgroundColor: "var(--accent-yellow)" }}></div>
                  <span>Clases Grupales: <strong>{formatMoney(totales.ingresoClases)}</strong> ({Math.round((totales.ingresoClases / totales.ingresoTotal) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla Desglosada por Sede */}
          <div className="report-table-card">
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Detalle de Facturación por Sede</h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{filteredSedes.length} sedes auditadas</span>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Sede / Ciudad</th>
                    <th>Membresías</th>
                    <th>Canchas Deportivas</th>
                    <th>Clases Grupales</th>
                    <th>Total Facturado</th>
                    <th>% Red</th>
                    <th>Socios</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSedes.map((sede) => {
                    const pctRed = Math.round((sede.ingresoTotal / totales.ingresoTotal) * 100);
                    return (
                      <tr key={sede.sedeId}>
                        <td>
                          <strong>{sede.nombreSede}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--accent-orange)" }}>{sede.ciudad}</div>
                        </td>
                        <td>{formatMoney(sede.ingresoMembresias)}</td>
                        <td>{formatMoney(sede.ingresoCanchas)}</td>
                        <td>{formatMoney(sede.ingresoClases)}</td>
                        <td>
                          <span style={{ fontWeight: 800, color: "var(--accent-green)" }}>{formatMoney(sede.ingresoTotal)}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "40px", height: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ width: `${pctRed}%`, height: "100%", backgroundColor: "var(--accent-orange)" }}></div>
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{pctRed}%</span>
                          </div>
                        </td>
                        <td>{sede.sociosActivos}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CONTENIDO TAB 2: CANCHAS */}
      {activeTab === "canchas" && (
        <div className="chart-container-card">
          <div className="chart-card-header">
            <div className="chart-title-box">
              <h3>Rendimiento y Ocupación de Canchas por Deporte (Strategy Pattern)</h3>
              <p>Análisis de franjas horarias Pico (19:00 - 21:00 hs con recargo) vs Valle</p>
            </div>
            <span className="sport-tag sport-tag-padel">Tarifa Dinámica RF-11 Activa</span>
          </div>

          <div className="table-responsive" style={{ marginBottom: "1.5rem" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Disciplina / Cancha</th>
                  <th>Horas Reservadas</th>
                  <th>Recaudación</th>
                  <th>Ocupación Valle</th>
                  <th>Ocupación Pico (Recargo +20%)</th>
                  <th>Tasa Cancelaciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DEPORTES_METRICAS.map((dep, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{dep.deporte}</strong>
                    </td>
                    <td>{dep.horasReservadas} hs</td>
                    <td style={{ color: "var(--accent-green)", fontWeight: 700 }}>{formatMoney(dep.recaudacion)}</td>
                    <td>
                      <span className="status-pill status-pill-operativa">{dep.ocupacionVallePct}%</span>
                    </td>
                    <td>
                      <span className="status-pill status-pill-pico">{dep.ocupacionPicoPct}% Pico</span>
                    </td>
                    <td>
                      <span style={{ color: dep.cancelacionesPct > 4 ? "var(--accent-red)" : "var(--text-muted)" }}>
                        {dep.cancelacionesPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Callout de Estrategia de Precios */}
          <div className="config-callout-box">
            <div className="config-callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="config-callout-text">
              <h4>Impacto del Patrón Strategy en Recaudación (RF-11)</h4>
              <p>
                La aplicación de tarifas diferenciadas (Descuento socio del 15% + Recargo nocturno del 20%) incrementó la rentabilidad de las canchas en un <strong>+18.6%</strong> en el horario pico de 19:00 a 21:00 hs, maximizando la rotación sin sobreventa gracias al lock transaccional (RN-02).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 3: CLASES */}
      {activeTab === "clases" && (
        <div className="chart-container-card">
          <div className="chart-card-header">
            <div className="chart-title-box">
              <h3>Demanda de Clases Grupales y Gestión Observer (RF-08)</h3>
              <p>Rastreo de lista de espera y reasignación automática de cupos liberados</p>
            </div>
            <span className="status-pill status-pill-pagado">Patrón Observer Activo</span>
          </div>

          <div className="table-responsive" style={{ marginBottom: "1.5rem" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Clase Grupal</th>
                  <th>Instructor</th>
                  <th>Sede</th>
                  <th>Asistencia</th>
                  <th>Socios en Espera (C-06)</th>
                  <th>Cupos Reasignados (Observer)</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CLASES_DEMANDA.map((cl, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{cl.tipoClase}</strong>
                    </td>
                    <td>{cl.instructor}</td>
                    <td>{cl.sede}</td>
                    <td>
                      <span className="status-pill status-pill-operativa">{cl.asistenciaPct}%</span>
                    </td>
                    <td>
                      <span className="waitlist-pos-badge waitlist-pos-1" style={{ width: "auto", padding: "0 0.5rem", borderRadius: "12px" }}>
                        {cl.enListaEspera} socios
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>+{cl.cuposLiberadosObserver} rescatados</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="config-callout-box">
            <div className="config-callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px" }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className="config-callout-text">
              <h4>Efectividad de Notificaciones Automáticas (RF-08)</h4>
              <p>
                El mecanismo de lista de espera recuperó un promedio del <strong>87% de los cupos cancelados</strong> con menos de 2 horas de anticipación, notificando en tiempo real al siguiente socio en fila y manteniendo el aforo de las salas de fitness al máximo rendimiento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 4: SOCIOS */}
      {activeTab === "socios" && (
        <div className="chart-container-card">
          <div className="chart-card-header">
            <div className="chart-title-box">
              <h3>Evolución de Socios, Morosidad y Retención (RN-03)</h3>
              <p>Comportamiento histórico y aplicación de políticas de acceso y mora multi-sede</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ backgroundColor: "rgba(11, 15, 25, 0.5)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Socios al Día</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-green)", marginTop: "0.25rem" }}>91.5%</div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>2.425 socios con acceso total y reserva con descuento</p>
            </div>

            <div style={{ backgroundColor: "rgba(11, 15, 25, 0.5)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>En Período de Gracia (Días 1 a 5)</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-yellow)", marginTop: "0.25rem" }}>6.2%</div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>164 socios con aviso preventivo de cuota vencida</p>
            </div>

            <div style={{ backgroundColor: "rgba(11, 15, 25, 0.5)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Beneficios Suspendidos (RN-03)</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-red)", marginTop: "0.25rem" }}>2.3%</div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>61 socios en mora (habilitados solo a tarifa externo)</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mes Histórico</th>
                  <th>Facturación Global</th>
                  <th>Membresías</th>
                  <th>Canchas</th>
                  <th>Padrón Total</th>
                  <th>Retención</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORICO_MENSUAL.map((h, idx) => (
                  <tr key={idx}>
                    <td><strong>{h.mes}</strong></td>
                    <td style={{ color: "var(--accent-green)", fontWeight: 700 }}>{formatMoney(h.ingresosTotales)}</td>
                    <td>{formatMoney(h.membresias)}</td>
                    <td>{formatMoney(h.canchas)}</td>
                    <td>{h.sociosTotales} socios</td>
                    <td>
                      <span className="trend-badge-up">94.8%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE EXPORTACIÓN */}
      {showExportModal && (
        <div className="sede-modal-overlay">
          <div className="sede-modal-box">
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Exportar Reporte Ejecutivo Consolidado</h3>
              <button className="sede-modal-close" onClick={() => setShowExportModal(false)}>✕</button>
            </div>

            <div className="sede-modal-body">
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Seleccione el formato para descargar el consolidado con tablas comparativas, métricas de ocupación y auditoría multi-sede para el período: <strong>{periodo.toUpperCase()}</strong>.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0.5rem 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: exportFormat === "pdf" ? "rgba(255, 94, 58, 0.1)" : "transparent" }}>
                  <input type="radio" name="format" checked={exportFormat === "pdf"} onChange={() => setExportFormat("pdf")} />
                  <div>
                    <strong>Documento PDF Ejecutivo (Completo)</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Incluye gráficos, balances y firma digitalizada de gerencia</div>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: exportFormat === "excel" ? "rgba(255, 94, 58, 0.1)" : "transparent" }}>
                  <input type="radio" name="format" checked={exportFormat === "excel"} onChange={() => setExportFormat("excel")} />
                  <div>
                    <strong>Libro de Cálculo Excel (.xlsx)</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tablas dinámicas, fórmulas de ocupación e ingresos por sede</div>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: exportFormat === "csv" ? "rgba(255, 94, 58, 0.1)" : "transparent" }}>
                  <input type="radio" name="format" checked={exportFormat === "csv"} onChange={() => setExportFormat("csv")} />
                  <div>
                    <strong>Archivo Plano CSV (.csv)</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Ideal para exportación a sistemas contables y ERPs</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="sede-modal-footer">
              <button className="sede-btn-edit" onClick={() => setShowExportModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleExport} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Confirmar y Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
