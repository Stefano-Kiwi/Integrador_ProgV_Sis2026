import { useParams, useNavigate } from "react-router-dom";
import "../../admin.css";

export default function PagoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock payment data based on id (in real app would fetch)
  const mockPayment = {
    id,
    fecha: new Date().toLocaleDateString(),
    monto: 1200,
    plan: "Plan Premium",
    estado: "Confirmado",
  };

  const handleBack = () => {
    navigate("/admin/membresias");
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Detalle de Pago</h1>
          <p>ID: {mockPayment.id}</p>
        </div>
      </header>
      <div className="catalog-card" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="catalog-card-header">
          <h3>{mockPayment.plan}</h3>
        </div>
        <div className="price-highlight-box" style={{ margin: "1rem 0" }}>
          <span className="price-period-label">Monto</span>
          <div className="price-big-number">${mockPayment.monto.toLocaleString()}</div>
        </div>
        <p>Fecha: {mockPayment.fecha}</p>
        <p>Estado: {mockPayment.estado}</p>
        <div className="catalog-card-footer">
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleBack}>Volver a Membresías</button>
        </div>
      </div>
    </>
  );
}
