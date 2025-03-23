import { React } from "react";
import { useLocation } from "react-router-dom";

function SuccessOrder() {
  const location = useLocation();
  const { totale } = location.state || {};
  return (
    <div>
      <h1>Il tuo ordine è stato correttamente inviato!</h1>
      <h2>Pagherai {totale ? `€${totale.toFixed(2)}` : ""} in contanti</h2>
      <p>Grazie per averci scelto!</p>
      <h3>Aggiungi altro ordine</h3>
    </div>
  );
}

export default SuccessOrder;
