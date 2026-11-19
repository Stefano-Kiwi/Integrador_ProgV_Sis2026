
import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  obtenerCanchas,
  type CanchaApi,
} from "../../services/canchasService";
import {
  obtenerUsuarios,
  type UsuarioApi,
} from "../../services/usuariosService";
import {
  crearReservaAdmin,
  type ReservaAdminCreada,
} from "../../services/reservasAdminService";
import "../../admin.css";

function fechaLocalManana(): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function dinero(valor: number | string): string {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

export default function AdminReservaForm() {
  const [searchParams] = useSearchParams();
  const canchaInicialId = Number(searchParams.get("canchaId"));

  const [canchas, setCanchas] = useState<CanchaApi[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);

  const [canchaId, setCanchaId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [fecha, setFecha] = useState(fechaLocalManana);
  const [horaInicio, setHoraInicio] = useState(18);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<ReservaAdminCreada | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [canchasApi, usuariosApi] = await Promise.all([
          obtenerCanchas(),
          obtenerUsuarios(),
        ]);

        if (!activo) return;

        const disponibles = canchasApi.filter(
          c => c.estado === "HABILITADA"
        );

        const clientes = usuariosApi.filter(
          u => u.rol.clase_rol.toLowerCase() === "cliente"
        );

        const canchaInicial =
          disponibles.find(c => c.id === canchaInicialId) ??
          disponibles[0];

        setCanchas(disponibles);
        setUsuarios(clientes);

        setCanchaId(String(canchaInicial?.id ?? ""));
        setUsuarioId(String(clientes[0]?.id ?? ""));
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los datos."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarDatos();

    return () => {
      activo = false;
    };
  }, [canchaInicialId]);

  const canchaSeleccionada = canchas.find(
    c => String(c.id) === canchaId
  );

  const usuarioSeleccionado = usuarios.find(
    u => String(u.id) === usuarioId
  );

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (guardando || resultado) return;

    setError(null);

    if (!canchaSeleccionada || !usuarioSeleccionado || !fecha) {
      setError("Seleccioná una cancha, un socio y una fecha.");
      return;
    }

    const horaTexto = String(horaInicio).padStart(2, "0");

    const fechaHoraLocal = new Date(
      `${fecha}T${horaTexto}:00:00`
    );

    if (
      Number.isNaN(fechaHoraLocal.getTime()) ||
      fechaHoraLocal.getTime() <= Date.now()
    ) {
      setError(
        "Seleccioná una fecha y un horario futuros."
      );
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await crearReservaAdmin({
        cancha_id: canchaSeleccionada.id,
        usuario_id: usuarioSeleccionado.id,
        fecha,
        hora_inicio: horaInicio,
      });

      setResultado(respuesta);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar la reserva."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      paddingBottom: "3rem",
    }}>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            fontSize: "0.8rem",
            color: "var(--accent-orange)",
            fontWeight: 700,
          }}>
            Módulo R-03
          </span>

          <h1>Crear Reserva de Cancha</h1>

          <p>
            Registrar un turno deportivo para un socio
            de FitZone Sports.
          </p>
        </div>

        <Link
          to="/admin/canchas/listado"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          ← Volver a Canchas
        </Link>
      </header>

      {cargando ? (
        <div className="reserva-step-card">
          Cargando canchas y socios...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}>
          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={guardando || Boolean(resultado)}
              style={{
                border: 0,
                padding: 0,
                margin: 0,
                minWidth: 0,
              }}
            >
              <div className="reserva-step-card">
                <h2 className="reserva-step-title">
                  <span className="step-num-badge">1</span>
                  Seleccionar Cancha
                </h2>

                <div className="form-group">
                  <label htmlFor="reserva-cancha">
                    Cancha disponible *
                  </label>

                  <select
                    id="reserva-cancha"
                    className="form-control"
                    value={canchaId}
                    onChange={e => setCanchaId(e.target.value)}
                    required
                  >
                    {canchas.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} — {c.tipo_cancha.nombre}
                        {" — "}
                        {c.sede.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {canchaSeleccionada && (
                  <p style={{
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}>
                    Tarifa base:{" "}
                    <strong>
                      {dinero(canchaSeleccionada.costo_hora)}
                    </strong>
                    {" "}por hora.
                  </p>
                )}
              </div>

              <div className="reserva-step-card">
                <h2 className="reserva-step-title">
                  <span className="step-num-badge">2</span>
                  Titular de la Reserva
                </h2>

                <div className="form-group">
                  <label htmlFor="reserva-usuario">
                    Socio *
                  </label>

                  <select
                    id="reserva-usuario"
                    className="form-control"
                    value={usuarioId}
                    onChange={e => setUsuarioId(e.target.value)}
                    required
                  >
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} {u.apellido}
                        {" — "}
                        {u.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="reserva-step-card">
                <h2 className="reserva-step-title">
                  <span className="step-num-badge">3</span>
                  Fecha y Horario
                </h2>

                <div className="form-group">
                  <label htmlFor="reserva-fecha">
                    Fecha del turno *
                  </label>

                  <input
                    id="reserva-fecha"
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reserva-hora">
                    Hora de inicio *
                  </label>

                  <select
                    id="reserva-hora"
                    className="form-control"
                    value={horaInicio}
                    onChange={e =>
                      setHoraInicio(Number(e.target.value))
                    }
                  >
                    {Array.from({ length: 24 }, (_, hora) => (
                      <option key={hora} value={hora}>
                        {String(hora).padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </div>

                <p style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}>
                  El backend permite reservar horarios de
                  una hora exacta. La ocupación se valida
                  al confirmar la solicitud.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  style={{ color: "var(--accent-red)" }}
                >
                  {error}
                </p>
              )}

              {!resultado && (
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}>
                  <Link
                    to="/admin/canchas/listado"
                    className="btn-secondary"
                  >
                    Cancelar
                  </Link>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                      guardando ||
                      !canchaSeleccionada ||
                      !usuarioSeleccionado
                    }
                  >
                    {guardando
                      ? "Registrando..."
                      : "Confirmar Reserva"}
                  </button>
                </div>
              )}
            </fieldset>

            {resultado && (
              <div
                className="reserva-step-card"
                style={{ marginTop: "1rem" }}
                aria-live="polite"
              >
                <h2>Reserva registrada correctamente</h2>

                <p>
                  <strong>ID de reserva:</strong>{" "}
                  #{resultado.reserva_id}
                </p>

                <p>
                  <strong>Estado:</strong>{" "}
                  {resultado.estado}
                </p>

                <p>
                  <strong>Monto:</strong>{" "}
                  {dinero(resultado.monto_total)}
                </p>

                <p>{resultado.mensaje}</p>

                <p style={{
                  color: "var(--accent-orange)",
                  fontWeight: 700,
                }}>
                  El turno está pendiente de pago.
                  No se registró ningún cobro.
                </p>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setResultado(null);
                    setError(null);
                  }}
                >
                  Registrar otra reserva
                </button>
              </div>
            )}
          </form>

          <aside className="reserva-summary-sticky">
            <div className="reserva-step-card">
              <span style={{
                color: "var(--accent-orange)",
                fontWeight: 800,
              }}>
                RESUMEN DEL TURNO
              </span>

              <h2 style={{ marginTop: "1rem" }}>
                {canchaSeleccionada?.nombre ||
                  "Sin cancha seleccionada"}
              </h2>

              <p>
                {canchaSeleccionada?.tipo_cancha.nombre}
              </p>

              <p>
                {canchaSeleccionada?.sede.nombre}
              </p>

              <p>
                <strong>Socio:</strong>{" "}
                {usuarioSeleccionado
                  ? `${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}`
                  : "Sin seleccionar"}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {fecha || "Sin definir"}
              </p>

              <p>
                <strong>Hora:</strong>{" "}
                {String(horaInicio).padStart(2, "0")}:00
              </p>

              <div className="cancha-pricing-box">
                <div className="cancha-price-main">
                  {canchaSeleccionada
                    ? dinero(canchaSeleccionada.costo_hora)
                    : "$0"}
                </div>

                <span>Tarifa base por hora</span>
              </div>

              <div style={{
                marginTop: "1rem",
                padding: "1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}>
                La cancha está habilitada, pero eso no
                garantiza que el horario esté libre.
                El servidor verifica el conflicto cuando
                se envía la reserva.
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
