
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { reservarCancha } from "../services/canchasService";
import { obtenerCanchas, type CanchaApi, } from "../services/canchasService";

export default function Canchas() {
  const [canchas, setCanchas] = useState<CanchaApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarCanchas() {
      try {
        const datos = await obtenerCanchas();

        if (activo) {
          setCanchas(datos);
          setError(null);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error al cargar las canchas."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarCanchas();

    return () => {
      activo = false;
    };
  }, []);

  const formatearPrecio = (precio: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(Number(precio));
  };

  const canchasHabilitadas = canchas.filter(
    (cancha) => cancha.estado === "HABILITADA"
  ).length;

  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        <header className="profile-page-header">
          <h1 className="profile-page-title">
            CANCHAS <span className="highlight">DEPORTIVAS</span>
          </h1>

          <p className="profile-page-subtitle">
            Consultá las canchas deportivas de nuestras sedes.
          </p>
        </header>

        <div className="profile-main-grid">
          <div className="profile-column">
            {cargando && (
              <div className="court-card">
                <p>Cargando canchas deportivas...</p>
              </div>
            )}

            {error && (
              <div className="court-card" role="alert">
                <h2>No pudimos cargar las canchas</h2>
                <p>{error}</p>
                <p>Verificá que el backend esté funcionando.</p>
              </div>
            )}

            {!cargando && !error && canchas.length === 0 && (
              <div className="court-card">
                <p>No hay canchas registradas actualmente.</p>
              </div>
            )}

            {!cargando && !error && (
              <div className="courts-grid">
                {canchas.map((cancha) => {
                  const habilitada =
                    cancha.estado === "HABILITADA";

                  const esFutbol = cancha.tipo_cancha.nombre
                    .toLowerCase()
                    .includes("fútbol");

                  return (
                    <article
                      className="court-card"
                      key={cancha.id}
                      id={`cancha-${cancha.id}`}
                    >
                      <div className="court-card-header">
                        <div>
                          <div className="court-meta-group">
                            <span
                              className={
                                esFutbol
                                  ? "court-badge-type football"
                                  : "court-badge-type"
                              }
                            >
                              {cancha.tipo_cancha.nombre}
                            </span>

                            <span
                              className={
                                habilitada
                                  ? "status-badge-active"
                                  : "slot-btn disabled"
                              }
                            >
                              {habilitada
                                ? "● HABILITADA"
                                : "● EN MANTENIMIENTO"}
                            </span>
                          </div>

                          <h2
                            className="court-name"
                            style={{ marginTop: "0.5rem" }}
                          >
                            {cancha.nombre}
                          </h2>
                        </div>

                        <div className="court-pricing">
                          <div className="price-val">
                            {formatearPrecio(cancha.costo_hora)}
                          </div>
                          <div className="price-unit">
                            Por hora
                          </div>
                        </div>
                      </div>

                      <div className="court-slots-section">
                        <span className="slots-title">
                          SEDE
                        </span>

                        <p>{cancha.sede.nombre}</p>
                        <p>{cancha.sede.direccion}</p>
                        <p>{cancha.sede.localidad}</p>
                      </div>

                      <div className="court-actions-row">
                        {habilitada ? (
  <FormularioReserva canchaId={cancha.id} />
) : (
  <span className="slot-btn disabled">
    No disponible por mantenimiento
  </span>
)}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="profile-column">
            <section
              className="active-reservation-card"
              aria-labelledby="estado-canchas"
            >
              <div className="card-title-group">
                <div className="card-title-left">
                  <h2 id="estado-canchas">
                    ESTADO DE LAS CANCHAS
                  </h2>
                </div>
              </div>

              <div>
                <span className="data-label">
                  Total de canchas registradas
                </span>
                <div className="price-val">
                  {cargando ? "..." : canchas.length}
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <span className="data-label">
                  Canchas habilitadas
                </span>
                <div className="price-val">
                  {cargando ? "..." : canchasHabilitadas}
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <span className="data-label">
                  Canchas en mantenimiento
                </span>
                <div className="price-val">
                  {cargando
                    ? "..."
                    : canchas.length - canchasHabilitadas}
                </div>
              </div>

              <p
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                }}
              >
                Los datos se consultan desde el servidor
                FitZone Sports.
              </p>

              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                }}
              >
                La selección de fechas, horarios y las
                reservas se incorporarán a continuación.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


function FormularioReserva({
  canchaId,
}: {
  canchaId: number;
}) {
  const fechaLocal = () => {
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  };

  const [fecha, setFecha] = useState(fechaLocal);
  const [hora, setHora] = useState("18");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservaConfirmada, setReservaConfirmada] = useState<{
    id: number;
    estado: string;
    monto: string | number;
    fecha: string;
    hora: number;
  } | null>(null);

  const horas = Array.from(
    { length: 15 },
    (_, index) => index + 8
  );

  async function handleReservar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (enviando || reservaConfirmada) return;

    setError(null);

    const horaSeleccionada = Number(hora);

    const fechaHora = new Date(
      `${fecha}T${String(horaSeleccionada).padStart(2, "0")}:00:00`
    );

    if (
      !fecha ||
      Number.isNaN(fechaHora.getTime()) ||
      fechaHora <= new Date()
    ) {
      setError("Seleccioná una fecha y hora futuras.");
      return;
    }

    setEnviando(true);

    try {
      const resultado = await reservarCancha(
        canchaId,
        fecha,
        horaSeleccionada
      );

      setReservaConfirmada({
        id: resultado.reserva_id,
        estado: resultado.estado,
        monto: resultado.monto_total,
        fecha,
        hora: horaSeleccionada,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo completar la reserva."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (reservaConfirmada) {
    return (
      <div aria-live="polite">
        <p className="status-badge-active">
          RESERVA REGISTRADA
        </p>

        <p>
          <strong>Número:</strong> #{reservaConfirmada.id}
        </p>

        <p>
          <strong>Fecha:</strong> {reservaConfirmada.fecha}
        </p>

        <p>
          <strong>Horario:</strong>{" "}
          {String(reservaConfirmada.hora).padStart(2, "0")}:00
        </p>

        <p>
          <strong>Importe:</strong> $
          {Number(reservaConfirmada.monto).toLocaleString("es-AR")}
        </p>

        <p>
          <strong>Estado:</strong> {reservaConfirmada.estado}
        </p>

        <p>
          La reserva quedó registrada en el sistema.
          El pago todavía está pendiente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleReservar}>
      <div className="court-slots-section">
        <span className="slots-title">
          SELECCIONÁ FECHA Y HORARIO
        </span>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <label>
            <span className="data-label">Fecha de reserva</span>

            <input
              type="date"
              className="form-input"
              value={fecha}
              min={fechaLocal()}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>

          <label>
            <span className="data-label">Hora de inicio</span>

            <select
              className="form-input"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            >
              {horas.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </label>
        </div>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          La disponibilidad se comprueba al confirmar.
          Los horarios mostrados no garantizan cupo.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            color: "var(--accent-orange)",
            marginTop: "0.75rem",
          }}
        >
          {error}
        </p>
      )}

      <div className="court-actions-row">
        <button
          type="submit"
          className="court-reserve-btn"
          disabled={enviando}
        >
          {enviando ? "PROCESANDO..." : "CONFIRMAR RESERVA"}
        </button>
      </div>

      <p style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
        ¿No iniciaste sesión?{" "}
        <Link to="/login">Ingresá a tu cuenta</Link>
      </p>
    </form>
  );
}
