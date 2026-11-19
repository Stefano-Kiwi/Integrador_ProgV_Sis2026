import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertMessage, Badge, Button, Card, Spinner } from "../components";
import { useAppStore } from "../store";
import {
  cancelarReservaClase,
  inscribirUsuarioClase,
  obtenerClases,
  obtenerMiListaEspera,
  obtenerMisReservasClase,
  type ClaseApi,
  type EntradaListaEsperaApi,
  type MiReservaClaseApi,
} from "../services/clasesService";
import { siteConfig } from "../config/siteConfig";

export default function Clases() {
  const { usuario, token } = useAppStore();

  const [clases, setClases] = useState<ClaseApi[]>([]);
  const [listaEspera, setListaEspera] = useState<EntradaListaEsperaApi[]>([]);
  const [misReservas, setMisReservas] = useState<MiReservaClaseApi[]>([]);

  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const listaClases = await obtenerClases();
      setClases(listaClases);

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

  const manejarCancelar = async (item: MiReservaClaseApi) => {
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
                <h3 style={{ margin: "0.25rem 0 0 0", color: "#fff" }}>{siteConfig.sedeNombre} ({siteConfig.sedeLocalidad})</h3>
              </div>
              <Badge variant="info">Sede Activa</Badge>
            </div>
          </Card>

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
                  return (
                    <Card
                      key={clase.id}
                      title={clase.tipo_clase.nombre}
                      subtitle={`${clase.sede.nombre} · Prof. ${clase.instructor.usuario.nombre} ${clase.instructor.usuario.apellido}`}
                      headerAction={
                        <Badge variant={llena ? "warning" : "success"}>
                          {llena
                            ? "Cupo completo"
                            : `${clase.cupo_disponible}/${clase.capacidad_maxima} libres`}
                        </Badge>
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

                        {token ? (
                          <Button
                            variant={llena ? "secondary" : "primary"}
                            loading={procesandoId === clase.id}
                            onClick={() => manejarInscribir(clase)}
                          >
                            {llena ? "Anotarme en Lista de Espera" : "Reservar Cupo"}
                          </Button>
                        ) : (
                          <Link to="/login">
                            <Button variant="secondary">Iniciar sesión</Button>
                          </Link>
                        )}
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
                          <Button variant="danger" onClick={() => manejarCancelar(r)}>
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
