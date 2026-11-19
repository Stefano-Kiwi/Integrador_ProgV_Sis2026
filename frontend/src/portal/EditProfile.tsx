import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store";

// Estructura real devuelta por GET /usuarios/:id.
interface PerfilApi {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono: string | null;
  sede_base: { id: number; nombre: string } | null;
}

interface Formulario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

const FORMULARIO_VACIO: Formulario = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
};

function mensajeHttp(status: number): string {
  switch (status) {
    case 400:
      return "Hay datos inválidos. Revisá los campos del formulario.";
    case 401:
      return "Tu sesión venció. Volvé a iniciar sesión.";
    case 403:
      return "No tenés permiso para modificar este perfil.";
    case 404:
      return "No encontramos el perfil solicitado.";
    case 409:
      return "Ese correo electrónico ya está registrado.";
    default:
      return `No se pudo completar la operación (HTTP ${status}).`;
  }
}

function esPerfilApi(dato: unknown): dato is PerfilApi {
  if (!dato || typeof dato !== "object") return false;
  const usuario = dato as Record<string, unknown>;
  return (
    typeof usuario.id === "number" &&
    typeof usuario.nombre === "string" &&
    typeof usuario.apellido === "string" &&
    typeof usuario.email === "string" &&
    typeof usuario.dni === "string" &&
    (usuario.telefono === null || typeof usuario.telefono === "string")
  );
}

export default function EditProfile() {
  const { usuario, token, cargandoSesion, refrescarSesion } = useAppStore();
  const [perfil, setPerfil] = useState<PerfilApi | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VACIO);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const usuarioId = usuario?.id;

  useEffect(() => {
    if (!usuarioId || !token) return;

    const controlador = new AbortController();

    async function cargarPerfil(id: number, jwt: string) {
      setCargandoPerfil(true);
      setError(null);
      setExito(null);
      try {
        const respuesta = await fetch(`/backend/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
          signal: controlador.signal,
        });

        if (!respuesta.ok) throw new Error(mensajeHttp(respuesta.status));
        const datos: unknown = await respuesta.json();
        if (!esPerfilApi(datos)) {
          throw new Error("La API devolvió datos de perfil incorrectos.");
        }
        if (controlador.signal.aborted) return;

        setPerfil(datos);
        setFormulario({
          nombre: datos.nombre,
          apellido: datos.apellido,
          email: datos.email,
          telefono: datos.telefono ?? "",
        });
      } catch (e) {
        if (!controlador.signal.aborted) {
          setPerfil(null);
          setError(e instanceof Error ? e.message : "No se pudo cargar tu perfil.");
        }
      } finally {
        if (!controlador.signal.aborted) setCargandoPerfil(false);
      }
    }

    void cargarPerfil(usuarioId, token);
    return () => controlador.abort();
  }, [usuarioId, token]);

  function actualizarCampo(campo: keyof Formulario, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setExito(null);
  }

  async function guardarCambios(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!perfil || !token || guardando) return;

    const cambios: Formulario = {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
    };

    if (!cambios.nombre || !cambios.apellido || !cambios.email) {
      setError("Nombre, apellido y correo son obligatorios.");
      return;
    }

    setGuardando(true);
    setError(null);
    setExito(null);

    try {
      const respuesta = await fetch(`/backend/usuarios/${perfil.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });
      if (!respuesta.ok) throw new Error(mensajeHttp(respuesta.status));

      const datos: unknown = await respuesta.json();
      if (!esPerfilApi(datos)) {
        throw new Error("La API guardó los cambios, pero devolvió una respuesta inesperada.");
      }

      setPerfil(datos);
      setFormulario({
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        telefono: datos.telefono ?? "",
      });
      await refrescarSesion();
      setExito("Los cambios se guardaron correctamente en la base de datos.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron guardar los datos.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="edit-profile-wrapper">
      <main className="edit-profile-container">
        <header className="edit-profile-header">
          <div>
            <h1 className="edit-profile-title">
              EDITAR <span className="highlight">DATOS PERSONALES</span>
            </h1>
            <p className="edit-profile-subtitle">
              Consultá tus datos reales y actualizá tu información de contacto.
            </p>
          </div>
          <Link to="/perfil" className="back-to-profile-btn">
            Volver a Mi Perfil
          </Link>
        </header>

        {error && (
          <p role="alert" style={{ color: "#ff9199", margin: "1rem 0" }}>
            {error}
          </p>
        )}
        {exito && (
          <p role="status" style={{ color: "#00e68a", margin: "1rem 0" }}>
            {exito}
          </p>
        )}

        {!cargandoSesion && (!usuario || !token) ? (
          <section className="edit-section-card">
            <p>Iniciá sesión para consultar y modificar tu perfil.</p>
            <Link to="/login" className="back-to-profile-btn">
              Ir al inicio de sesión
            </Link>
          </section>
        ) : cargandoSesion || cargandoPerfil ? (
          <section className="edit-section-card">
            <p>Cargando tu perfil...</p>
          </section>
        ) : perfil ? (
          <div className="edit-profile-grid">
            <section className="edit-section-card" aria-labelledby="heading-personal-data">
              <div className="card-title-group">
                <div className="card-title-left">
                  <h2 id="heading-personal-data">INFORMACIÓN GENERAL Y DE CONTACTO</h2>
                </div>
                <span className="card-title-badge">Datos reales</span>
              </div>

              <form onSubmit={(e) => void guardarCambios(e)} className="edit-form-grid">
                <div className="form-group">
                  <label className="input-label" htmlFor="editar-nombre">Nombre</label>
                  <div className="input-container">
                    <input id="editar-nombre" className="form-input" type="text" autoComplete="given-name"
                      maxLength={100} required value={formulario.nombre}
                      onChange={(e) => actualizarCampo("nombre", e.target.value)}
                      style={{ paddingLeft: "1rem" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="editar-apellido">Apellido</label>
                  <div className="input-container">
                    <input id="editar-apellido" className="form-input" type="text" autoComplete="family-name"
                      maxLength={100} required value={formulario.apellido}
                      onChange={(e) => actualizarCampo("apellido", e.target.value)}
                      style={{ paddingLeft: "1rem" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="editar-email">Correo electrónico</label>
                  <div className="input-container">
                    <input id="editar-email" className="form-input" type="email" autoComplete="email"
                      maxLength={150} required value={formulario.email}
                      onChange={(e) => actualizarCampo("email", e.target.value)}
                      style={{ paddingLeft: "1rem" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="editar-telefono">Teléfono</label>
                  <div className="input-container">
                    <input id="editar-telefono" className="form-input" type="tel" autoComplete="tel"
                      maxLength={30} value={formulario.telefono}
                      onChange={(e) => actualizarCampo("telefono", e.target.value)}
                      style={{ paddingLeft: "1rem" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="editar-dni">DNI (no editable)</label>
                  <div className="input-container">
                    <input id="editar-dni" className="form-input" type="text" readOnly
                      value={perfil.dni} style={{ paddingLeft: "1rem", opacity: 0.65 }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="editar-sede">Sede base (no editable)</label>
                  <div className="input-container">
                    <input id="editar-sede" className="form-input" type="text" readOnly
                      value={perfil.sede_base?.nombre ?? "Sin sede asignada"}
                      style={{ paddingLeft: "1rem", opacity: 0.65 }} />
                  </div>
                </div>

                <div className="edit-form-actions full-span">
                  <Link to="/perfil" className="btn-edit-cancel">Cancelar</Link>
                  <button type="submit" className="btn-edit-save" id="btn-save-personal"
                    disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        ) : (
          <section className="edit-section-card">
            <p>No fue posible obtener tus datos. Revisá el mensaje de error o volvé a Mi Perfil.</p>
          </section>
        )}
      </main>
    </div>
  );
}
