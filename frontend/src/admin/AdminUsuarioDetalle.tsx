import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { obtenerUsuarioPorId } from "../services/usuariosService";
import type { UsuarioApi } from "../services/usuariosService";
import { obtenerToken } from "../services/authService";
import "../admin.css";

export default function AdminUsuarioDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarUsuario() {
      setCargando(true);
      setError(null);
      setUsuario(null);

      const usuarioId = Number(id);

      if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        setError("El identificador del usuario no es válido.");
        setCargando(false);
        return;
      }

      try {
        const resultado = await obtenerUsuarioPorId(usuarioId);

        if (activo) {
          setUsuario(resultado);
        }
      } catch (err) {
        if (!activo) return;

        if (!obtenerToken()) {
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(
          err instanceof TypeError
            ? "No se pudo conectar con el servidor."
            : err instanceof Error
              ? err.message
              : "No se pudo consultar el usuario.",
        );
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarUsuario();

    return () => {
      activo = false;
    };
  }, [id, intento, navigate]);

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Detalle del usuario</h1>
          <p>Información registrada en FitZone.</p>
        </div>

        <Link
          to="/admin/personal"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Volver a Personal
        </Link>
      </header>

      {cargando ? (
        <section className="panel-card" role="status">
          Cargando usuario...
        </section>
      ) : error ? (
        <section className="panel-card">
          <p role="alert">{error}</p>

          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() => setIntento((actual) => actual + 1)}
          >
            Reintentar
          </button>
        </section>
      ) : usuario ? (
        <>
          <section
            className="panel-card"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--accent-orange)",
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {usuario.nombre.charAt(0)}
              {usuario.apellido.charAt(0)}
            </div>

            <div>
              <h2>
                {usuario.nombre} {usuario.apellido}
              </h2>
              <p>{usuario.email}</p>
              <span className="user-role-badge">
                {usuario.rol.clase_rol}
              </span>
            </div>
          </section>

          <section className="panel-card">
            <h2>Información del usuario</h2>

            <dl
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              {[
                { etiqueta: "Identificador", valor: usuario.id },
                { etiqueta: "DNI", valor: usuario.dni },
                { etiqueta: "Nombre", valor: usuario.nombre },
                { etiqueta: "Apellido", valor: usuario.apellido },
                { etiqueta: "Correo", valor: usuario.email },
                {
                  etiqueta: "Teléfono",
                  valor: usuario.telefono || "Sin teléfono registrado",
                },
                {
                  etiqueta: "Rol",
                  valor: usuario.rol.clase_rol,
                },
                {
                  etiqueta: "Sede base",
                  valor:
                    usuario.sede_base?.nombre || "Sin sede asignada",
                },
                {
                  etiqueta: "Fecha de alta",
                  valor: new Date(usuario.creado_at).toLocaleString(
                    "es-AR",
                  ),
                },
              ].map((dato) => (
                <div key={dato.etiqueta}>
                  <dt
                    style={{
                      color: "var(--text-muted)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {dato.etiqueta}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {dato.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : null}
    </>
  );
}