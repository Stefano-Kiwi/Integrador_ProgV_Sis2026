import { useLocation, useNavigate } from "react-router-dom";
import { INITIAL_PLANES } from "../../data/catalogosData";
import "../../admin.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const planId = query.get("planId");
  const plan = INITIAL_PLANES.find(p => p.id === planId);

  if (!plan) {
    return <div>Plan no encontrado.</div>;
  }

  const handleConfirm = () => {
    // Generate a mock payment ID (could be timestamp based)
    const paymentId = `pay-${Date.now()}`;
    // In a real app, we'd process the payment here.
    navigate(`/admin/pago/${paymentId}`);
  };

  const handleCancel = () => {
    navigate(`/admin/membresias`);
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Checkout Simulado</h1>
          <p>{plan.nombre} ({plan.periodicidad})</p>
        </div>
      </header>
      <div className="catalog-card" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="price-highlight-box" style={{ margin: "1rem 0" }}>
          <span className="price-period-label">Total a pagar</span>
          <div className="price-big-number">${plan.precio.toLocaleString()}</div>
        </div>
        {/* Mock payment fields */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Tarjeta (mock):</label>
          <input type="text" placeholder="4242 4242 4242 4242" disabled style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div className="catalog-card-footer" style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleConfirm}>Confirmar Pago</button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </>
  );
}
