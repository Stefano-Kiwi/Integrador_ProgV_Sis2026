
import { useEffect, useState, type FormEvent } from "react";
import {
  obtenerUsuarios,
  type UsuarioApi,
} from "../services/usuariosService";
import {
  inscribirUsuarioClase,
  type ResultadoInscripcion,
} from "../services/clasesService";

interface Props {
  claseId: number;
  finalizada: boolean;
  onInscripcionExitosa: () => void;
}

export default function AdminInscripcionClase({
  claseId,
  finalizada,
  onInscripcionExitosa,
}: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<ResultadoInscripcion | null>(null);
  const [ultimaClaseInscripta, setUltimaClaseInscripta] =
    useState<number | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        const datos = await obtenerUsuarios();
        if (!activo) return;

        const clientes = datos.filter(
          u => u.rol.clase_rol === "Cliente"
        );

        setUsuarios(clientes);
        setUsuarioId(String(clientes[0]?.id ?? ""));
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron consultar los socios."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarUsuarios();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    // El resultado anterior no corresponde a otra clase.
    if (ultimaClaseInscripta !== claseId) {
      setResultado(null);
      setError(null);
    }
  }, [claseId, ultimaClaseInscripta]);

  async function inscribir(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando || finalizada || !usuarioId || resultado) return;

    setEnviando(true);
    setError(null);

    try {
      const respuesta = await inscribirUsuarioClase(
        claseId,
        Number(usuarioId)
      );

      setResultado(respuesta);
      setUltimaClaseInscripta(claseId);
      onInscripcionExitosa();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar la inscripción."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="reserva-step-card">
      <h3>Inscripción de socios</h3>

      {finalizada ? (
        <p>Esta clase ya finalizó. No se permiten nuevas inscripciones desde el panel.</p>
      ) : cargando ? (
        <p>Cargando socios...</p>
      ) : (
        <form onSubmit={inscribir}>
          <div className="form-group">
            <label htmlFor="usuario-inscripcion">Socio</label>
            <select
              id="usuario-inscripcion"
              className="form-control"
              value={usuarioId}
              onChange={e => {
                setUsuarioId(e.target.value);
                setResultado(null);
                setError(null);
              }}
              required
            >
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} — {u.email}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={enviando || !usuarios.length || Boolean(resultado)}
          >
            {enviando ? "Inscribiendo..." : "Inscribir socio"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" style={{ color: "var(--accent-red)" }}>
          {error}
        </p>
      )}

      {resultado && (
        <div aria-live="polite" style={{ marginTop: "1rem" }}>
          <strong>
            {resultado.estado === "CONFIRMADA"
              ? "Inscripción confirmada"
              : "Ingresó a lista de espera"}
          </strong>

          <p>{resultado.mensaje}</p>
        </div>
      )}
    </section>
  );
}
