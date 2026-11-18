import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { savePago } from "../../data/pagosData";
import type { Transaction } from "../../data/pagosData";
import type { CheckoutMembresiaResumen } from "./AdminMembresiaForm";
import {
  formatearFechaMembresia,
  formatearImporteMembresia,
} from "../../data/membresiasData";
import "../../admin.css";

type ResultadoPago = "Aprobado" | "Pendiente" | "Rechazado";

interface CheckoutState {
  resumen?: CheckoutMembresiaResumen;
}

export default function AdminMembresiaCheckout() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;
  const resumen = state?.resumen;

  const [medioPago, setMedioPago] = useState<Transaction["medioPago"]>("MercadoPago");
  const [escenario, setEscenario] = useState<ResultadoPago>("Aprobado");
  const [resultado, setResultado] = useState<ResultadoPago | null>(null);
  const [pagoId, setPagoId] = useState<string | null>(null);

  if (!resumen) {
    return (
      <section className="empty-state-card">
        <h1>No hay una contratación seleccionada</h1>
        <p>Iniciá una contratación o renovación antes de ingresar al pago.</p>
        <Link
          to="/admin/membresias"
          className="btn-primary"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          Volver a membresías
        </Link>
      </section>
    );
  }

  const mensajes: Record<ResultadoPago, string> = {
    Aprobado:
      "El pago de demostración fue aprobado. No se realizó ningún cobro real.",
    Pendiente:
      "El pago de demostración quedó pendiente de confirmación. Todavía no debe considerarse aprobado.",
    Rechazado:
      "El pago de demostración fue rechazado. Podés seleccionar otro medio y volver a intentarlo.",
  };

  const claseResultado =
    resultado === "Aprobado"
      ? "status-active"
      : resultado === "Pendiente"
        ? "status-warning"
        : "status-inactive";

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Checkout de membresía</h1>
          <p>{resumen.operacion} · Pago simulado</p>
        </div>
      </header>

      <section className="panel-card">
        <h2 className="panel-title" style={{ marginBottom: "1rem" }}>
          Resumen del pago
        </h2>

        <dl style={{ margin: 0, display: "grid", gap: "1rem" }}>
          <div>
            <dt style={{ color: "var(--text-muted)" }}>Socio</dt>
            <dd style={{ margin: 0 }}>{resumen.socioNombre}</dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-muted)" }}>DNI</dt>
            <dd style={{ margin: 0 }}>{resumen.socioDni}</dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-muted)" }}>Plan</dt>
            <dd style={{ margin: 0 }}>{resumen.planNombre}</dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-muted)" }}>Vigencia</dt>
            <dd style={{ margin: 0 }}>
              {formatearFechaMembresia(resumen.fechaInicio)} al{" "}
              {formatearFechaMembresia(resumen.fechaVencimiento)}
            </dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-muted)" }}>
              Renovación automática
            </dt>
            <dd style={{ margin: 0 }}>
              {resumen.renovacionAutomatica ? "Activada" : "Desactivada"}
            </dd>
          </div>
        </dl>

        <div className="kpi-value" style={{ marginTop: "1.5rem" }}>
          {formatearImporteMembresia(resumen.importe)}
        </div>
        <p style={{ color: "var(--text-muted)" }}>Total a pagar</p>
      </section>

      {resultado ? (
        <section className="panel-card" role="status">
          <span className={`status-badge ${claseResultado}`}>
            {resultado}
          </span>

          <h2 style={{ marginTop: "1rem" }}>Resultado del pago</h2>
          <p style={{ margin: "1rem 0", lineHeight: 1.6 }}>
            {mensajes[resultado]}
          </p>
          <p>Medio seleccionado: {medioPago}</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {resultado === "Rechazado" && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setResultado(null)}
              >
                Reintentar pago
              </button>
            )}

            <Link
              to="/admin/membresias"
              className="btn-secondary"
              style={{ textDecoration: "none" }}
            >
              Volver a membresías
            </Link>
          </div>
        </section>
      ) : (
        <form
          className="panel-card"
          onSubmit={(event) => {
            event.preventDefault();

            const identificador = `DEMO-${crypto.randomUUID()}`;

            const pago: Transaction = {
                id: identificador,
                socio: resumen.socioNombre,
                dni: resumen.socioDni,
                concepto: `${resumen.operacion} de Membresía: ${resumen.planNombre}`,
                fecha: new Date().toLocaleString("es-AR"),
                monto: resumen.importe,
                medioPago,
                estado: escenario,
                comprobanteNro:
                escenario === "Aprobado"
                    ? `SIM-${identificador.slice(5, 13).toUpperCase()}`
                    : "",
            };

            savePago(pago);
            setPagoId(pago.id);
            setResultado(escenario);
            }}
        >
          <h2 className="panel-title" style={{ marginBottom: "1.5rem" }}>
            Medio de pago
          </h2>

          <div className="form-group">
            <label htmlFor="checkout-medio">Seleccioná un medio</label>
            <select
              id="checkout-medio"
              className="form-control"
              value={medioPago}
              onChange={(event) => setMedioPago(event.target.value as Transaction["medioPago"])}
            >
              <option value="MercadoPago">MercadoPago</option>
              <option value="Modo">Modo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="checkout-resultado">
              Resultado de demostración
            </label>
            <select
              id="checkout-resultado"
              className="form-control"
              value={escenario}
              onChange={(event) =>
                setEscenario(event.target.value as ResultadoPago)
              }
            >
              <option value="Aprobado">Aprobado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Operación de demostración. No se solicitarán datos bancarios
            ni se realizará un cobro.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Link
              to="/admin/membresias"
              className="btn-secondary"
              style={{ textDecoration: "none" }}
            >
              Cancelar
              {pagoId && (
            <Link
                to={`/admin/pagos/${encodeURIComponent(pagoId)}`}
                className="btn-primary"
                style={{ textDecoration: "none" }}
            >
                Ver detalle del pago
            </Link>
            )}
            </Link>
            <button type="submit" className="btn-primary">
              Simular pago de {formatearImporteMembresia(resumen.importe)}
            </button>
          </div>
        </form>
      )}
    </>
  );
}