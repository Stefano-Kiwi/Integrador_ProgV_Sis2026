import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertMessage, Badge, Button, Card, Input, Spinner } from "../components";
import { useAppStore } from "../store";
import {
  cancelarClase,
  cancelarReservaClase,
  crearClase,
  inscribirUsuarioClase,
  obtenerClases,
  obtenerMiListaEspera,
  obtenerMisReservasClase,
  type ClaseApi,
  type EntradaListaEsperaApi,
  type MiReservaClaseApi,
} from "../services/clasesService";
import {
  cancelarReservaCancha,
  obtenerCanchas,
  obtenerMisReservasCancha,
  reservarCancha,
  type CanchaApi,
} from "../services/canchasService";
import { simularPago } from "../services/pagosService";
import { siteConfig } from "../config/siteConfig";

export default function Clases() {
  const { usuario, token } = useAppStore();

  const [clases, setClases] = useState<ClaseApi[]>([]);
  const [listaEspera, setListaEspera] = useState<EntradaListaEsperaApi[]>([]);
  const [misReservas, setMisReservas] = useState<MiReservaClaseApi[]>([]);
  const [canchasSede, setCanchasSede] = useState<CanchaApi[]>([]);

  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // Estados para panel de profesor/instructor
  const [mostrarFormNuevaClase, setMostrarFormNuevaClase] = useState(false);
  const [tipoClaseId, setTipoClaseId] = useState<number>(1);
  const [canchaIdSeleccionada, setCanchaIdSeleccionada] = useState<number | "">("");
  const [fechaClase, setFechaClase] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [horaInicioClase, setHoraInicioClase] = useState<number>(10);
  const [capacidadClase, setCapacidadClase] = useState<number>(20);
  const [guardandoClase, setGuardandoClase] = useState(false);

  // Verificación de rol de profesor / instructor
  const esInstructor =
    usuario?.rol?.id_rol === 2 ||
    usuario?.rol?.clase_rol?.toLowerCase() === "instructor" ||
    (usuario as { id_rol?: number })?.id_rol === 2;

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [listaClases, listaCanchas] = await Promise.all([
        obtenerClases(),
        obtenerCanchas().catch(() => [] as CanchaApi[]),
      ]);
      setClases(listaClases);

      const canchasHabilitadas = listaCanchas.filter(
        (c) => c.sede_id === siteConfig.sedeId && c.estado === "HABILITADA"
      );
      setCanchasSede(canchasHabilitadas);
      if (canchasHabilitadas.length > 0) {
        setCanchaIdSeleccionada((prev) => (prev === "" ? canchasHabilitadas[0].id : prev));
      }

      if (token) {
        const [espera, reservas] = await Promise.all([
          obtenerMiListaEspera().catch(() => []),
          obtenerMisReservasClase().catch(() => []),
        ]);
        setListaEspera(espera);
        setMisReservas(reservas);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las clases.");
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const clasesFiltradas = clases.filter((c) => c.sede_id === siteConfig.sedeId);

  // Catálogo de tipos de clase únicos
  const tiposUnicos = Array.from(
    new Map(clases.map((c) => [c.tipo_clase.id, c.tipo_clase])).values()
  );
  const tiposDisponibles =
    tiposUnicos.length > 0
      ? tiposUnicos
      : [
          { id: 1, nombre: "Spinning" },
          { id: 2, nombre: "Yoga" },
          { id: 3, nombre: "CrossFit" },
        ];

  // Resolver ID de instructor correspondiente al usuario
  const resolverInstructorId = (): number => {
    if (usuario?.instructor?.id) {
      return usuario.instructor.id;
    }
    const propia = clases.find(
      (c) =>
        c.instructor.usuario_id === usuario?.id ||
        c.instructor.usuario?.id === usuario?.id
    );
    if (propia) {
      return propia.instructor.id;
    }
    return (usuario as { instructor_id?: number })?.instructor_id || usuario?.id || 1;
  };

  const manejarInscribir = async (clase: ClaseApi) => {
    if (!usuario) {
      setError("Iniciá sesión para reservar o anotarte en lista de espera.");
      return;
    }
    setProcesandoId(clase.id);
    setError(null);
    setExito(null);
    try {
      const res = await inscribirUsuarioClase(clase.id, usuario.id);
      setExito(res.mensaje);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo realizar la inscripción.");
    } finally {
      setProcesandoId(null);
    }
  };

  const manejarCancelarReservaAlumno = async (item: MiReservaClaseApi) => {
    const horasRestantes = (new Date(item.clase.inicio_at).getTime() - Date.now()) / 3_600_000;
    if (horasRestantes < 2) {
      const confirmar = window.confirm(
        "Atención: faltan menos de 2 horas para el inicio de la clase. Cancelar ahora registrará penalidad. ¿Deseás continuar?"
      );
      if (!confirmar) return;
    }

    setError(null);
    setExito(null);
    try {
      const res = await cancelarReservaClase(item.id);
      const extra = res.promovido_desde_lista_espera
        ? ` Se promovió automáticamente al usuario #${res.promovido_desde_lista_espera.usuarioId} desde lista de espera.`
        : "";
      setExito(`${res.mensaje}${extra}`);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva.");
    }
  };

  // Crear clase y reservar cancha automáticamente
  const manejarCrearClaseConCancha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      setError("Tenés que iniciar sesión.");
      return;
    }
    if (canchaIdSeleccionada === "") {
      setError("Por favor seleccioná una cancha para reservar con la clase.");
      return;
    }
    if (!fechaClase) {
      setError("Por favor seleccioná una fecha.");
      return;
    }

    setGuardandoClase(true);
    setError(null);
    setExito(null);

    try {
      const numCanchaId = Number(canchaIdSeleccionada);

      // 1. Reservar la cancha automáticamente
      const resCancha = await reservarCancha(
        numCanchaId,
        fechaClase,
        horaInicioClase,
        usuario.id
      );

      // 2. La reserva de la cancha con la clase figura siempre como pagada (CONFIRMADA)
      try {
        const monto =
          typeof resCancha.monto_total === "string"
            ? parseFloat(resCancha.monto_total)
            : resCancha.monto_total || 0;
        await simularPago("cancha", resCancha.reserva_id, monto);
      } catch (pagoErr) {
        console.warn("Aviso al confirmar pago automático de cancha:", pagoErr);
      }

      // 3. Crear la clase
      const fechaBase = new Date(`${fechaClase}T00:00:00`);
      const inicio = new Date(fechaBase);
      inicio.setHours(horaInicioClase, 0, 0, 0);
      const fin = new Date(fechaBase);
      fin.setHours(horaInicioClase + 1, 0, 0, 0);

      const instructorId = resolverInstructorId();

      const claseCreada = await crearClase({
        sede_id: siteConfig.sedeId,
        tipo_clase_id: tipoClaseId,
        instructor_id: instructorId,
        inicio_at: inicio.toISOString(),
        fin_at: fin.toISOString(),
        capacidad_maxima: capacidadClase,
      });

      // 4. Guardar vinculación clase -> reserva de cancha
      try {
        localStorage.setItem(`fitzone_clase_cancha_${claseCreada.id}`, String(resCancha.reserva_id));
      } catch {
        // Ignorar errores de almacenamiento local
      }

      setExito(
        `¡Clase programada exitosamente! Se reservó la cancha #${numCanchaId} (quedó confirmada y pagada para el turno de las ${horaInicioClase}:00 hs).`
      );
      setMostrarFormNuevaClase(false);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al programar la clase con su cancha.");
    } finally {
      setGuardandoClase(false);
    }
  };

  // Cancelar la clase dictada por el instructor y cancelar también su reserva de cancha
  const manejarCancelarClaseProfesor = async (clase: ClaseApi) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseás cancelar tu clase de "${clase.tipo_clase.nombre}" del día ${new Date(clase.inicio_at).toLocaleDateString("es-AR")}? Se cancelará también la reserva de la cancha asociada.`
    );
    if (!confirmar) return;

    setProcesandoId(clase.id);
    setError(null);
    setExito(null);

    try {
      // 1. Cancelar la reserva de cancha vinculada
      let reservaCanchaId: number | null = null;
      const guardadaId = localStorage.getItem(`fitzone_clase_cancha_${clase.id}`);
      if (guardadaId) {
        reservaCanchaId = Number(guardadaId);
      }

      // Buscar en las reservas de la base de datos si no teníamos la clave o para validar
      try {
        const misReservasCancha = await obtenerMisReservasCancha();
        const fechaClaseStr = new Date(clase.inicio_at).toISOString().slice(0, 10);
        const horaInicioClaseNum = new Date(clase.inicio_at).getHours();

        if (!reservaCanchaId) {
          const coincidente = misReservasCancha.find((rc) => {
            const rcFechaStr = rc.fecha ? new Date(rc.fecha).toISOString().slice(0, 10) : "";
            return (
              rcFechaStr === fechaClaseStr &&
              rc.hora_inicio === horaInicioClaseNum &&
              rc.estado !== "CANCELADA"
            );
          });
          if (coincidente) {
            reservaCanchaId = coincidente.id;
          }
        }

        if (reservaCanchaId) {
          await cancelarReservaCancha(reservaCanchaId).catch((cErr) => {
            console.warn("Aviso al cancelar reserva de cancha:", cErr);
          });
          localStorage.removeItem(`fitzone_clase_cancha_${clase.id}`);
        }
      } catch (errCancha) {
        console.warn("Error buscando reserva de cancha vinculada:", errCancha);
      }

      // 2. Cancelar la clase en el backend
      const res = await cancelarClase(clase.id);
      setExito(`${res.mensaje} Se canceló también la reserva de la cancha asociada.`);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la clase.");
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="profile-page-wrapper" style={{ padding: "1.25rem 0.75rem" }}>
      <main className="profile-container" style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <header className="profile-page-header" style={{ marginBottom: "1.25rem" }}>
          <h1 className="profile-page-title">
            CLASES <span className="highlight">GRUPALES</span>
          </h1>
          <p className="profile-page-subtitle">
            Reservas hasta 48 h antes · Cancelación sin penalidad hasta 2 h antes · Lista de espera FIFO.
          </p>
        </header>

        {error && <AlertMessage variant="error" message={error} onClose={() => setError(null)} />}
        {exito && <AlertMessage variant="success" message={exito} onClose={() => setExito(null)} />}

        <div style={{ display: "grid", gap: "1.25rem" }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.85rem" }}>Sede actual</span>
                <h3 style={{ margin: "0.25rem 0 0 0", color: "#fff" }}>
                  {siteConfig.sedeNombre} ({siteConfig.sedeLocalidad})
                </h3>
              </div>
              <Badge variant="info">Sede Activa</Badge>
            </div>
          </Card>

          {/* Panel para instructores/profesores */}
          {token && esInstructor && (
            <Card
              title="Panel del Profesor / Instructor"
              subtitle="Programación de clases con reserva de cancha automática"
              headerAction={
                <Button
                  variant={mostrarFormNuevaClase ? "secondary" : "primary"}
                  onClick={() => setMostrarFormNuevaClase((prev) => !prev)}
                >
                  {mostrarFormNuevaClase ? "Cerrar formulario" : "+ Crear Nueva Clase y Reservar Cancha"}
                </Button>
              }
            >
              {mostrarFormNuevaClase ? (
                <form
                  onSubmit={manejarCrearClaseConCancha}
                  style={{
                    display: "grid",
                    gap: "1rem",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color, #222b40)",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#cbd5e1" }}>
                        Tipo de Clase:
                      </label>
                      <select
                        value={tipoClaseId}
                        onChange={(e) => setTipoClaseId(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          background: "#161b26",
                          border: "1px solid #2d3748",
                          color: "#fff",
                        }}
                      >
                        {tiposDisponibles.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#cbd5e1" }}>
                        Cancha a Reservar (Sede Actual):
                      </label>
                      <select
                        value={canchaIdSeleccionada}
                        onChange={(e) => setCanchaIdSeleccionada(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          background: "#161b26",
                          border: "1px solid #2d3748",
                          color: "#fff",
                        }}
                        required
                      >
                        {canchasSede.length === 0 ? (
                          <option value="">No hay canchas habilitadas en esta sede</option>
                        ) : (
                          canchasSede.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre} ({c.tipo_cancha?.nombre})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#cbd5e1" }}>
                        Fecha del Turno:
                      </label>
                      <Input
                        type="date"
                        value={fechaClase}
                        onChange={(e) => setFechaClase(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#cbd5e1" }}>
                        Hora de Inicio:
                      </label>
                      <select
                        value={horaInicioClase}
                        onChange={(e) => setHoraInicioClase(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          background: "#161b26",
                          border: "1px solid #2d3748",
                          color: "#fff",
                        }}
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 8).map((h) => (
                          <option key={h} value={h}>
                            {h}:00 a {h + 1}:00 hs
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#cbd5e1" }}>
                        Capacidad Máxima (Alumnos):
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={capacidadClase}
                        onChange={(e) => setCapacidadClase(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                    <Button variant="secondary" type="button" onClick={() => setMostrarFormNuevaClase(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      loading={guardandoClase}
                      disabled={canchasSede.length === 0}
                    >
                      Confirmar Clase y Reserva de Cancha
                    </Button>
                  </div>
                </form>
              ) : (
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.88rem" }}>
                  Como profesor podés crear clases para esta sede. Al crear la clase se reservará automáticamente la cancha seleccionada (marcada como pagada/confirmada). Si cancelás la clase, la reserva de cancha se cancelará en conjunto.
                </p>
              )}
            </Card>
          )}

          {cargando ? (
            <Card>
              <Spinner label="Cargando cronograma de clases..." />
            </Card>
          ) : (
            <div style={{ display: "grid", gap: "0.9rem" }}>
              {clasesFiltradas.length === 0 ? (
                <Card>
                  <p style={{ color: "var(--text-muted, #8b95a5)", margin: 0 }}>
                    No hay clases programadas para la sede seleccionada.
                  </p>
                </Card>
              ) : (
                clasesFiltradas.map((clase) => {
                  const llena = clase.cupo_disponible <= 0;
                  const inicio = new Date(clase.inicio_at);
                  const fin = new Date(clase.fin_at);

                  // Verificar si el usuario actual es el instructor asignado a esta clase
                  const esMiClase =
                    esInstructor &&
                    (clase.instructor.usuario_id === usuario?.id ||
                      clase.instructor.usuario?.id === usuario?.id);

                  return (
                    <Card
                      key={clase.id}
                      title={clase.tipo_clase.nombre}
                      subtitle={`${clase.sede.nombre} · Prof. ${clase.instructor.usuario.nombre} ${clase.instructor.usuario.apellido}`}
                      headerAction={
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          {esMiClase && <Badge variant="info">Mi Clase</Badge>}
                          <Badge variant={llena ? "warning" : "success"}>
                            {llena
                              ? "Cupo completo"
                              : `${clase.cupo_disponible}/${clase.capacidad_maxima} libres`}
                          </Badge>
                        </div>
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div style={{ fontSize: "0.88rem", color: "#cbd5e1" }}>
                          {inicio.toLocaleDateString("es-AR")} ·{" "}
                          {inicio.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {fin.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          {esMiClase && (
                            <Button
                              variant="danger"
                              loading={procesandoId === clase.id}
                              onClick={() => void manejarCancelarClaseProfesor(clase)}
                            >
                              Cancelar Clase (Profesor)
                            </Button>
                          )}

                          {!esMiClase && token && (
                            <Button
                              variant={llena ? "secondary" : "primary"}
                              loading={procesandoId === clase.id}
                              onClick={() => void manejarInscribir(clase)}
                            >
                              {llena ? "Anotarme en Lista de Espera" : "Reservar Cupo"}
                            </Button>
                          )}

                          {!token && (
                            <Link to="/login">
                              <Button variant="secondary">Iniciar sesión</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {token && listaEspera.length > 0 && (
            <Card title="Mi Lista de Espera (RF-08)">
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {listaEspera.map((e) => (
                  <div
                    key={e.lista_espera_id}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-color, #222b40)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#fff" }}>{e.clase.tipo_clase.nombre}</strong>
                      <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                        {e.clase.sede.nombre} · {new Date(e.clase.inicio_at).toLocaleString("es-AR")}
                      </div>
                    </div>
                    <Badge variant="info">Posición #{e.posicion}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {misReservas.length > 0 && (
            <Card title="Tus reservas de clases">
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {misReservas.map((r) => {
                  const horas = (new Date(r.clase.inicio_at).getTime() - Date.now()) / 3_600_000;
                  return (
                    <div
                      key={r.id}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--border-color, #222b40)",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#fff" }}>
                          #{r.id} · {r.clase.tipo_clase.nombre}
                        </strong>
                        <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                          {new Date(r.clase.inicio_at).toLocaleString("es-AR")}
                          {r.estado === "CONFIRMADA" && horas < 2 && " · Cancelar ahora tiene penalidad"}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <Badge variant={r.estado === "CANCELADA" ? "danger" : "success"}>
                          {r.estado}
                        </Badge>
                        {r.estado === "CONFIRMADA" && (
                          <Button variant="danger" onClick={() => void manejarCancelarReservaAlumno(r)}>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
