import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion, cerrarSesion } from "../services/authService";
import "../admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (enviando) return;

    setError(null);

    if (!email.trim() || !password) {
      setError("Completá el correo y la contraseña.");
      return;
    }

    setEnviando(true);

    try {
      cerrarSesion();
      await iniciarSesion(email, password);
      setPassword("");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor. Intentá nuevamente."
          : err instanceof Error
            ? err.message
            : "No se pudo iniciar sesión."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <div
            className="brand"
            style={{ justifyContent: "center", margin: 0 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="var(--accent-orange)"
              style={{ width: "32px" }}
              aria-hidden="true"
            >
              <polygon points="13 2 3 14 12 10 12 21 3 14" />
            </svg>

            <div
              className="brand-title"
              style={{ fontSize: "1.6rem" }}
            >
              FITZONE <span>PANEL</span>
            </div>
          </div>

          <p className="login-subtitle">
            Ingresá con tu cuenta para acceder al panel.
          </p>
        </header>

        {error && (
          <div
            className="login-alert-error"
            role="alert"
            id="login-error"
          >
            <div className="login-alert-content">
              <div className="login-alert-title">
                No se pudo iniciar sesión
              </div>
              <div className="login-alert-msg">{error}</div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          aria-busy={enviando}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="email">Correo electrónico</label>

            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={enviando}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Contraseña</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control"
                placeholder="Tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={enviando}
                aria-describedby={error ? "login-error" : undefined}
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((actual) => !actual)}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={enviando}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              fontSize: "1rem",
              padding: "0.85rem",
              textAlign: "center",
            }}
          >
            {enviando ? "Ingresando..." : "Ingresar al sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}