import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearSede } from "../services/sedesService";
import { obtenerToken } from "../services/authService";
import "../admin.css";

export default function AdminSedeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const envioEnCurso = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (envioEnCurso.current || id) return;

    setError(null);

    const aforoMaximo = Number(capacidad);

    if (!nombre.trim() || !direccion.trim() || !localidad.trim()) {
      setError("Completá nombre, dirección y localidad.");
      return;
    }

    if (
      !Number.isInteger(aforoMaximo) ||
      aforoMaximo <= 0 ||
      aforoMaximo > 2147483647
    ) {
      setError("La capacidad debe ser un número entero positivo válido.");
      return;
    }

    if (!obtenerToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    envioEnCurso.current = true;
    setGuardando(true);

    try {
      const sede = await crearSede({
        nombre,
        direccion,
        localidad,
        aforo_maximo: aforoMaximo,
      });

      navigate(`/admin/sedes/${sede.id}`, { replace: true });
    } catch (err) {
      if (!obtenerToken()) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor. Revisá la conexión antes de reintentar."
          : err instanceof Error
            ? err.message
            : "No se pudo guardar la sede.",
      );
    } finally {
      envioEnCurso.current = false;
      setGuardando(false);
    }
  }

  if (id) {
    return (
      <section className="table-container" style={{ padding: "2rem" }}>
        <h1>Edición no disponible</h1>
        <p>
          La API todavía no ofrece una operación para modificar sedes.
        </p>
        <Link to="/admin/sedes" className="btn-secondary">
          Volver a sedes
        </Link>
      </section>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Nueva sede</h1>
          <p>Registrá una sucursal en FitZone.</p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-busy={guardando}
        style={{ maxWidth: "800px", marginBottom: "2rem" }}
      >
        <section
          className="table-container"
          style={{ padding: "2rem" }}
        >
          {error && (
            <div
              className="login-alert-error"
              role="alert"
              style={{ marginBottom: "1.5rem" }}
            >
              {error}
            </div>
          )}

          <fieldset
            disabled={guardando}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
              display: "grid",
              gap: "1.25rem",
            }}
          >
            <div className="form-group">
              <label htmlFor="sede-nombre">Nombre de la sede</label>
              <input
                id="sede-nombre"
                type="text"
                className="form-control"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sede-direccion">Dirección</label>
              <input
                id="sede-direccion"
                type="text"
                className="form-control"
                value={direccion}
                onChange={(event) => setDireccion(event.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sede-localidad">Localidad</label>
              <input
                id="sede-localidad"
                type="text"
                className="form-control"
                value={localidad}
                onChange={(event) => setLocalidad(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sede-capacidad">
                Capacidad máxima de personas
              </label>
              <input
                id="sede-capacidad"
                type="number"
                className="form-control"
                value={capacidad}
                onChange={(event) => setCapacidad(event.target.value)}
                min={1}
                max={2147483647}
                step={1}
                required
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <button type="submit" className="btn-primary">
                {guardando ? "Guardando..." : "Crear sede"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/admin/sedes")}
              >
                Cancelar
              </button>
            </div>
          </fieldset>
        </section>
      </form>
    </>
  );
}