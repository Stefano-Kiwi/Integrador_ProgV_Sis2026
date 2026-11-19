
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerUsuarios,
  type UsuarioApi,
} from "../../services/usuariosService";
import {
  obtenerCanchas,
  type CanchaApi,
} from "../../services/canchasService";
import {
  obtenerClases,
  type ClaseApi,
} from "../../services/clasesService";
import {
  obtenerPlanes,
  type PlanApi,
} from "../../services/planesService";
import {
  obtenerSedes,
  type SedeApi,
} from "../../services/sedesService";
import {
  obtenerPagosAdmin,
  type PagoApi,
} from "../../services/pagosAdminService";
import "../../admin.css";

interface DatosDashboard {
  usuarios: UsuarioApi[] | null;
  canchas: CanchaApi[] | null;
  clases: ClaseApi[] | null;
  planes: PlanApi[] | null;
  sedes: SedeApi[] | null;
  pagos: PagoApi[] | null;
}

function dinero(valor: number): string {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

function fechaArgentina(valor: string): string {
  return new Date(valor).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export default function Dashboard() {
  const [datos, setDatos] = useState<DatosDashboard | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarDashboard() {
      const nombres = [
        "Usuarios",
        "Canchas",
        "Clases",
        "Planes",
        "Sedes",
        "Pagos",
      ];

      const resultados = await Promise.allSettled([
        obtenerUsuarios(),
        obtenerCanchas(),
        obtenerClases(),
        obtenerPlanes(),
        obtenerSedes(),
        obtenerPagosAdmin(),
      ] as const);

      if (!activo) return;

      const [usuarios, canchas, clases, planes, sedes, pagos] =
        resultados;

      setDatos({
        usuarios:
          usuarios.status === "fulfilled"
            ? usuarios.value
            : null,
        canchas:
          canchas.status === "fulfilled"
            ? canchas.value
            : null,
        clases:
          clases.status === "fulfilled"
            ? clases.value
            : null,
        planes:
          planes.status === "fulfilled"
            ? planes.value
            : null,
        sedes:
          sedes.status === "fulfilled"
            ? sedes.value
            : null,
        pagos:
          pagos.status === "fulfilled"
            ? pagos.value
            : null,
      });

      const problemas = resultados.flatMap((resultado, indice) => {
        if (resultado.status === "fulfilled") {
          return [];
        }

        const motivo =
          resultado.reason instanceof Error
            ? resultado.reason.message
            : "Error desconocido";

        return [`${nombres[indice]}: ${motivo}`];
      });

      setErrores(problemas);
      setCargando(false);
    }

    void cargarDashboard();

    return () => {
      activo = false;
    };
  }, [recarga]);

  function actualizar() {
    setCargando(true);
    setErrores([]);
    setRecarga(valor => valor + 1);
  }

  const ahora = Date.now();

  const sociosRegistrados = datos?.usuarios?.filter(
    usuario =>
      usuario.rol.clase_rol.toLowerCase() === "cliente"
  ).length;

  const canchasHabilitadas = datos?.canchas?.filter(
    cancha => cancha.estado === "HABILITADA"
  ).length;

  const canchasMantenimiento = (datos?.canchas ?? []).filter(
    cancha => cancha.estado === "EN_MANTENIMIENTO"
  );

  const clasesFuturas = (datos?.clases ?? [])
    .filter(clase => new Date(clase.inicio_at).getTime() > ahora)
    .sort(
      (a, b) =>
        new Date(a.inicio_at).getTime() -
        new Date(b.inicio_at).getTime()
    );

  const clasesCompletas = clasesFuturas.filter(
    clase => clase.cupo_disponible === 0
  );

  const pagosAprobados = datos?.pagos?.filter(
    pago => pago.estado === "APROBADO"
  );

  const importeAprobado = pagosAprobados?.reduce(
    (suma, pago) => suma + Number(pago.monto),
    0
  );

  const tarjetas = [
    {
      titulo: "Socios registrados",
      valor:
        sociosRegistrados === undefined
          ? "—"
          : String(sociosRegistrados),
      descripcion: "Usuarios con rol Cliente",
      icono: "👥",
      ruta: "/admin/personal",
      enlace: "Ver usuarios",
    },
    {
      titulo: "Canchas habilitadas",
      valor:
        canchasHabilitadas === undefined
          ? "—"
          : String(canchasHabilitadas),
      descripcion: `De ${datos?.canchas?.length ?? "—"} canchas`,
      icono: "🏟️",
      ruta: "/admin/canchas/listado",
      enlace: "Ver inventario",
    },
    {
      titulo: "Próximas clases",
      valor:
        datos?.clases == null
          ? "—"
          : String(clasesFuturas.length),
      descripcion: "Clases que todavía no comenzaron",
      icono: "📅",
      ruta: "/admin/clases",
      enlace: "Ver agenda",
    },
    {
      titulo: "Pagos aprobados",
      valor:
        importeAprobado === undefined
          ? "—"
          : dinero(importeAprobado),
      descripcion: "Total histórico registrado (simulación)",
      icono: "💳",
      ruta: "/admin/pagos",
      enlace: "Ver pagos",
    },
  ];

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    dateStyle: "full",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Panel de Administración</h1>
          <p>
            Resumen operativo de FitZone Sports con
            información registrada en PostgreSQL.
          </p>
        </div>

        <div
          className="header-controls"
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span
            className="btn-secondary"
            style={{ cursor: "default" }}
          >
            📅 {fechaHoy}
          </span>

          <button
            className="btn-secondary"
            type="button"
            onClick={actualizar}
            disabled={cargando}
          >
            ↻ Actualizar
          </button>
        </div>
      </header>

      {cargando && (
        <div className="panel-card">
          Actualizando indicadores desde el backend...
        </div>
      )}

      {!cargando && errores.length > 0 && (
        <div
          className="panel-card"
          role="alert"
          style={{ marginBottom: "1rem" }}
        >
          <h3>Algunos indicadores no están disponibles</h3>
          <p>
            El resto de los módulos continúa funcionando.
          </p>

          <ul>
            {errores.map((error, indice) => (
              <li key={indice}>{error}</li>
            ))}
          </ul>

          <button
            className="btn-secondary"
            type="button"
            onClick={actualizar}
          >
            Reintentar consultas
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        {tarjetas.map(tarjeta => (
          <Link
            to={tarjeta.ruta}
            key={tarjeta.titulo}
            className="panel-card kpi-card-interactive"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="kpi-header">
              {tarjeta.titulo}
              <span>{tarjeta.icono}</span>
            </div>

            <div
              className="kpi-value"
              style={{
                fontSize: tarjeta.titulo === "Pagos aprobados"
                  ? "1.8rem"
                  : undefined,
              }}
            >
              {tarjeta.valor}
            </div>

            <div
              className="kpi-trend"
              style={{ color: "var(--text-muted)" }}
            >
              {tarjeta.descripcion}
            </div>

            <span className="card-explore-hint">
              {tarjeta.enlace} →
            </span>
          </Link>
        ))}

        <div className="charts-area">
          <section className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                Próximas Clases Grupales
              </div>

              <Link
                to="/admin/clases"
                style={{
                  color: "var(--accent-orange)",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Ver agenda →
              </Link>
            </div>

            {datos?.clases == null ? (
              <p style={{ color: "var(--text-muted)" }}>
                Información no disponible.
              </p>
            ) : clasesFuturas.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                No hay clases futuras programadas.
              </p>
            ) : (
              <div className="ranking-list">
                {clasesFuturas.slice(0, 5).map(clase => (
                  <div
                    key={clase.id}
                    className="ranking-item"
                    style={{
                      padding: "0.65rem 0",
                      borderBottom:
                        "1px solid var(--border-color)",
                    }}
                  >
                    <div className="ranking-info">
                      <span>
                        <strong>
                          {clase.tipo_clase.nombre}
                        </strong>

                        <span style={{
                          display: "block",
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          marginTop: "0.2rem",
                        }}>
                          {fechaArgentina(clase.inicio_at)}
                        </span>

                        <span style={{
                          display: "block",
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}>
                          {clase.instructor.usuario.nombre}
                          {" "}
                          {clase.instructor.usuario.apellido}
                        </span>
                      </span>

                      <strong>
                        {clase.cupo_disponible} libres
                      </strong>
                    </div>

                    <div className="ranking-bar-bg">
                      <div
                        className="ranking-bar-fill"
                        style={{
                          width: `${
                            clase.capacidad_maxima > 0
                              ? Math.min(
                                  100,
                                  ((clase.capacidad_maxima -
                                    clase.cupo_disponible) /
                                    clase.capacidad_maxima) * 100
                                )
                              : 0
                          }%`,
                          background: "var(--accent-orange)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                Infraestructura y Membresías
              </div>
            </div>

            <div className="ranking-list">
              {[
                {
                  titulo: "Sedes registradas",
                  cantidad: datos?.sedes?.length,
                  ruta: "/admin/sedes",
                },
                {
                  titulo: "Planes de membresía",
                  cantidad: datos?.planes?.length,
                  ruta: "/admin/planes",
                },
                {
                  titulo: "Canchas en mantenimiento",
                  cantidad: datos?.canchas
                    ? canchasMantenimiento.length
                    : undefined,
                  ruta: "/admin/canchas",
                },
                {
                  titulo: "Clases futuras completas",
                  cantidad: datos?.clases
                    ? clasesCompletas.length
                    : undefined,
                  ruta: "/admin/clases",
                },
              ].map(indicador => (
                <Link
                  key={indicador.titulo}
                  to={indicador.ruta}
                  className="ranking-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.8rem 0",
                    textDecoration: "none",
                    color: "inherit",
                    borderBottom:
                      "1px solid var(--border-color)",
                  }}
                >
                  <span>{indicador.titulo}</span>

                  <strong>
                    {indicador.cantidad ?? "—"}
                  </strong>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="alerts-area">
          <div
            className="panel-title"
            style={{ marginBottom: "0.5rem" }}
          >
            Alertas Operativas
          </div>

          {canchasMantenimiento.map(cancha => (
            <Link
              to={`/admin/canchas/${cancha.id}`}
              key={cancha.id}
              className="alert-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="alert-title">
                🔧 Cancha en mantenimiento
              </div>

              <div className="alert-desc">
                {cancha.nombre}
                {" — "}
                {cancha.sede.nombre}
              </div>

              <span style={{
                fontSize: "0.8rem",
                color: "var(--accent-orange)",
              }}>
                Ver cancha →
              </span>
            </Link>
          ))}

          {clasesCompletas.map(clase => (
            <Link
              to="/admin/clases"
              key={`clase-${clase.id}`}
              className="alert-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="alert-title">
                📅 Clase sin cupos
              </div>

              <div className="alert-desc">
                {clase.tipo_clase.nombre}
                {" — "}
                {fechaArgentina(clase.inicio_at)}
              </div>

              <span style={{
                fontSize: "0.8rem",
                color: "var(--accent-orange)",
              }}>
                Ver clases →
              </span>
            </Link>
          ))}

          {datos?.canchas != null &&
            datos?.clases != null &&
            canchasMantenimiento.length === 0 &&
            clasesCompletas.length === 0 && (
              <div className="alert-card">
                <div className="alert-title">
                  ✓ Sin alertas detectadas
                </div>

                <div className="alert-desc">
                  No se encontraron canchas en
                  mantenimiento ni clases futuras
                  sin cupos.
                </div>
              </div>
            )}

          {(datos?.canchas == null ||
            datos?.clases == null) && (
            <div className="alert-card">
              <div className="alert-title">
                Información parcial
              </div>

              <div className="alert-desc">
                Algunas fuentes no están disponibles.
                No podemos confirmar todas las alertas.
              </div>
            </div>
          )}

          <Link
            to="/admin/canchas/listado"
            className="btn-primary"
            style={{
              display: "block",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Gestionar Canchas
          </Link>
        </div>
      </div>
    </>
  );
}
