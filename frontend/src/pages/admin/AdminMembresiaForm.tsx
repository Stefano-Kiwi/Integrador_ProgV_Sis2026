import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { INITIAL_PLANES } from "../../data/catalogosData";
import {
  FECHA_REFERENCIA_DEMO,
  getMembresias,
  getMembresiaById,
  formatearFechaMembresia,
  formatearImporteMembresia,
} from "../../data/membresiasData";
import "../../admin.css";

export interface CheckoutMembresiaResumen {
  operacion: "Contratación" | "Renovación";
  membresiaOrigenId?: string;
  socioId: string;
  socioNombre: string;
  socioDni: string;
  planId: string;
  planNombre: string;
  fechaInicio: string;
  fechaVencimiento: string;
  renovacionAutomatica: boolean;
  importe: number;
}

function calcularVencimiento(
  fecha: string,
  periodicidad: string,
): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const resultado = new Date(Date.UTC(anio, mes - 1, dia));

  if (periodicidad === "Diario") {
    resultado.setUTCDate(resultado.getUTCDate() + 1);
  } else {
    const meses =
      periodicidad === "Anual"
        ? 12
        : periodicidad === "Trimestral"
          ? 3
          : 1;

    resultado.setUTCDate(1);
    resultado.setUTCMonth(resultado.getUTCMonth() + meses);

    const ultimoDia = new Date(
      Date.UTC(
        resultado.getUTCFullYear(),
        resultado.getUTCMonth() + 1,
        0,
      ),
    ).getUTCDate();

    resultado.setUTCDate(Math.min(dia, ultimoDia));
  }

  return resultado.toISOString().slice(0, 10);
}

export default function AdminMembresiaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const membresia = id ? getMembresiaById(id) : undefined;
  const esRenovacion = Boolean(id);

  const planesActivos = INITIAL_PLANES.filter(
    (plan) => plan.estado === "Activo",
  );

  const socios = getMembresias().filter(
    (item, indice, lista) =>
      lista.findIndex((socio) => socio.socioId === item.socioId) === indice,
  );

  const planInicial =
    membresia &&
    planesActivos.some((plan) => plan.id === membresia.planId)
      ? membresia.planId
      : planesActivos[0]?.id ?? "";

  const inicioMinimo =
    membresia && membresia.fechaVencimiento > FECHA_REFERENCIA_DEMO
      ? membresia.fechaVencimiento
      : FECHA_REFERENCIA_DEMO;

  const [socioId, setSocioId] = useState(membresia?.socioId ?? "");
  const [planId, setPlanId] = useState(planInicial);
  const [fechaInicio, setFechaInicio] = useState(inicioMinimo);
  const [renovacionAutomatica, setRenovacionAutomatica] = useState(
    membresia?.renovacionAutomatica ?? false,
  );

  const socio = socios.find((item) => item.socioId === socioId);
  const plan = planesActivos.find((item) => item.id === planId);

  const fechaVencimiento =
    plan && fechaInicio
      ? calcularVencimiento(fechaInicio, plan.periodicidad)
      : "";

  const destinoVolver = membresia
    ? `/admin/membresias/${membresia.id}`
    : "/admin/membresias";

  if (esRenovacion && !membresia) {
    return (
      <section className="empty-state-card">
        <h1>Membresía no encontrada</h1>
        <p>No se puede iniciar la renovación del registro indicado.</p>
        <Link to="/admin/membresias">Volver al listado</Link>
      </section>
    );
  }

  if (membresia?.estado === "Suspendida") {
    return (
      <section className="panel-card">
        <h1>Membresía suspendida</h1>
        <p style={{ margin: "1rem 0" }}>
          Revisá la suspensión antes de iniciar una renovación.
        </p>
        <Link to={destinoVolver}>Volver al detalle</Link>
      </section>
    );
  }

  return (
    <>
      <header
        className="topbar"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <div className="header-titles">
          <h1>
            {esRenovacion ? "Renovar membresía" : "Contratar membresía"}
          </h1>
          <p>Seleccioná el socio, el plan y el período de contratación.</p>
        </div>
        <Link
          to={destinoVolver}
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Volver
        </Link>
      </header>

      {planesActivos.length === 0 ? (
        <section className="empty-state-card">
          <h2>No hay planes activos disponibles</h2>
          <Link to="/admin/planes">Consultar catálogo de planes</Link>
        </section>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (!socio || !plan || !fechaVencimiento) return;

            const resumen: CheckoutMembresiaResumen = {
              operacion: esRenovacion ? "Renovación" : "Contratación",
              membresiaOrigenId: membresia?.id,
              socioId: socio.socioId,
              socioNombre: socio.socioNombre,
              socioDni: socio.socioDni,
              planId: plan.id,
              planNombre: plan.nombre,
              fechaInicio,
              fechaVencimiento,
              renovacionAutomatica,
              importe: plan.precio,
            };

            navigate("/admin/membresias/checkout", {
              state: { resumen },
            });
          }}
          style={{ display: "grid", gap: "1.5rem" }}
        >
          <section className="panel-card">
            <h2 className="panel-title" style={{ marginBottom: "1.5rem" }}>
              Datos de la membresía
            </h2>

            <div className="form-group">
              <label htmlFor="membresia-socio">Socio</label>
              <select
                id="membresia-socio"
                className="form-control"
                value={socioId}
                onChange={(event) => setSocioId(event.target.value)}
                disabled={esRenovacion}
                required
              >
                <option value="">Seleccioná un socio</option>
                {socios.map((item) => (
                  <option key={item.socioId} value={item.socioId}>
                    {item.socioNombre} — DNI {item.socioDni}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="membresia-plan">Plan</label>
              <select
                id="membresia-plan"
                className="form-control"
                value={planId}
                onChange={(event) => setPlanId(event.target.value)}
                required
              >
                {planesActivos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} — {formatearImporteMembresia(item.precio)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="membresia-inicio">Fecha de inicio</label>
              <input
                id="membresia-inicio"
                type="date"
                className="form-control"
                value={fechaInicio}
                min={inicioMinimo}
                max="2099-12-31"
                required
                onChange={(event) => setFechaInicio(event.target.value)}
              />
            </div>

            {esRenovacion && (
              <p
                style={{
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                }}
              >
                La renovación comienza a partir del{" "}
                {formatearFechaMembresia(inicioMinimo)}.
              </p>
            )}

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <input
                type="checkbox"
                checked={renovacionAutomatica}
                onChange={(event) =>
                  setRenovacionAutomatica(event.target.checked)
                }
              />
              Renovación automática
            </label>
          </section>

          <section className="panel-card">
            <h2 className="panel-title" style={{ marginBottom: "1rem" }}>
              Resumen de contratación
            </h2>

            <p>Socio: {socio?.socioNombre ?? "Sin seleccionar"}</p>
            <p>Plan: {plan?.nombre ?? "Sin seleccionar"}</p>
            <p>
              Inicio:{" "}
              {fechaInicio
                ? formatearFechaMembresia(fechaInicio)
                : "Sin seleccionar"}
            </p>
            <p>
              Vencimiento:{" "}
              {fechaVencimiento
                ? formatearFechaMembresia(fechaVencimiento)
                : "Sin calcular"}
            </p>

            <div
              className="kpi-value"
              style={{ marginTop: "1.25rem" }}
            >
              {plan ? formatearImporteMembresia(plan.precio) : "—"}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Link
                to={destinoVolver}
                className="btn-secondary"
                style={{ textDecoration: "none" }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={!socio || !plan || !fechaVencimiento}
              >
                Continuar al pago
              </button>
            </div>
          </section>
        </form>
      )}
    </>
  );
}