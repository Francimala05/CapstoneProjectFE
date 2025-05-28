import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/SuccessOrder.css";
import { Button } from "react-bootstrap";

function SuccessOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totaleConSpedizione } = location.state || {};
  return (
    <div className="successorder-container">
      <h1 className="text-warning">
        Il tuo ordine è stato correttamente inviato!
      </h1>
      <h2 className="mt-4 messpay">
        Pagherai{" "}
        {totaleConSpedizione ? `€${totaleConSpedizione.toFixed(2)}` : ""} in
        contanti.
        <br className="mb-3" /> Grazie per averci scelto!
      </h2>
      <div className="add-products">
        <Button
          className="btn-transparent mt-4 mb-2"
          onClick={() => navigate("/shop")}
        >
          Inizia un nuovo ordine
        </Button>
      </div>
    </div>
  );
}

export default SuccessOrder;
