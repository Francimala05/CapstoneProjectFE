import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../assets/styles/CarrelloPage.css";

function Carrello() {
  const [cart, setCart] = useState([]);
  const [totale, setTotale] = useState(0);
  const [dataRitiro, setDataRitiro] = useState("");
  const [orarioRitiro, setOrarioRitiro] = useState("");
  const [esigenzeParticolari, setEsigenzeParticolari] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Carrello recuperato dal localStorage:", storedCart);
    setCart(storedCart);
    const total = storedCart.reduce((acc, item) => acc + item.price, 0);
    setTotale(total);
    console.log("Cart:", storedCart);
  }, []);

  useEffect(() => {
    if (showAlert) {
      console.log("Alert visibile:", alertMessage);
    }
  }, [showAlert, alertMessage]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    let totaleConSpedizione = totale;

    if (deliveryMethod === "domicilio") {
      totaleConSpedizione += 1; // Aggiunge 1€ per la consegna
    }

    if (!token) {
      alert("Token mancante, per favore effettua il login.");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        alert("Il tuo token è scaduto, effettua il login di nuovo.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Token invalido", error);
      navigate("/login");
      return;
    }

    let alertMessage = "";
    if (!dataRitiro) {
      alertMessage += "La data di ritiro/consegna è obbligatoria. ";
    }
    if (!orarioRitiro) {
      alertMessage += "L'orario di ritiro/consegna è obbligatorio. ";
    }
    if (deliveryMethod === "domicilio" && (!telefono || !indirizzo)) {
      if (!telefono) {
        alertMessage +=
          "Il numero di telefono è obbligatorio per la consegna a domicilio. ";
      }
      if (!indirizzo) {
        alertMessage +=
          "L'indirizzo è obbligatorio per la consegna a domicilio. ";
      }
    }

    if (alertMessage) {
      setAlertMessage(alertMessage);
      setShowAlert(true);
      return;
    }

    const user = jwt_decode(token);

    const ordine = {
      pizze: cart
        .filter((item) => item.type === "pizza")
        .map((item) => ({ id: item.id })),
      panuozzi: cart
        .filter((item) => item.type === "panuozzo")
        .map((item) => ({ id: item.id })),
      fritti: cart
        .filter((item) => item.type === "fritto")
        .map((item) => ({ id: item.id })),
      bibite: cart
        .filter((item) => item.type === "bibita")
        .map((item) => ({ id: item.id })),
      esigenzeParticolari:
        esigenzeParticolari || "Nessuna esigenza particolare",
      data: dataRitiro,
      orario: orarioRitiro + ":00",
      username: user.sub,
      conto: totaleConSpedizione,
      telefono: telefono,
      indirizzo: indirizzo,
    };

    console.log("Pizze:", ordine.pizze);
    console.log("Panuozzi:", ordine.panuozzi);
    console.log("Fritti:", ordine.fritti);
    console.log("Bibite:", ordine.bibite);
    console.log("Esigenze Particolari:", ordine.esigenzeParticolari);
    console.log("Data:", ordine.data);
    console.log("Orario:", ordine.orario);
    console.log("Username:", ordine.username);
    console.log("Telefono:", ordine.telefono);
    console.log("Indirizzo:", ordine.indirizzo);

    const url =
      deliveryMethod === "asporto"
        ? "http://localhost:8085/api/ordini/asporto/invia"
        : "http://localhost:8085/api/ordini/domicilio/invia";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ordine),
      });

      if (!response.ok) {
        const responseText = await response.text();
        setAlertMessage(`Errore nell'invio dell'ordine: ${responseText}`);
        setShowAlert(true);
        return;
      }
      console.log("Ordine inviato con successo, risposta:", response);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/successorder", { state: { totaleConSpedizione } });
    } catch (error) {
      console.error("Errore durante l'invio dell'ordine:", error);
      setAlertMessage("Errore durante l'invio dell'ordine. Riprova.");
      setShowAlert(true);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedCart = cart.filter((item) => item.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const newTotale = updatedCart.reduce((acc, item) => acc + item.price, 0);
    setTotale(newTotale);

    console.log("Carrello aggiornato dopo rimozione:", updatedCart);
  };

  return (
    <div className="carrello-container">
      <h4 className="carrello-title">Il tuo Ordine</h4>

      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <div className="carrello-items">
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <div key={item.id} className="carrello-item">
                <div className="item-name">{item.name}</div>
                <div className="item-price">€{item.price}</div>
                <div className="item-remove">
                  <div
                    className="trash-icon-container"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Trash3Fill color="white" />
                  </div>
                </div>
              </div>
            ))}
            <div className="total">
              <h3 className="total">
                Totale: €
                {(deliveryMethod === "domicilio" ? totale + 1 : totale).toFixed(
                  2
                )}
              </h3>
            </div>
            <div className="add-products">
              <Button
                className="btn-transparent"
                onClick={() => navigate("/shop")}
              >
                Aggiungi prodotti
              </Button>
            </div>
          </>
        ) : (
          <div className="carrello-empty">
            <p className="carrello-vuoto">Il carrello è vuoto.</p>
            <Button
              className="btn-transparent"
              onClick={() => navigate("/shop")}
            >
              Aggiungi prodotti
            </Button>
          </div>
        )}

        <div className="decisional-section">
          <div className="delivery-option-container">
            <div
              className={`delivery-option ${
                deliveryMethod === "asporto" ? "selected" : ""
              }`}
              onClick={() => setDeliveryMethod("asporto")}
            >
              Asporto
            </div>
            <div
              className={`delivery-option ${
                deliveryMethod === "domicilio" ? "selected" : ""
              }`}
              onClick={() => setDeliveryMethod("domicilio")}
            >
              Domicilio
            </div>
          </div>

          {deliveryMethod && (
            <div className="domicilio-details">
              <h3>
                {deliveryMethod === "asporto"
                  ? "Data di ritiro"
                  : "Data di consegna"}
              </h3>
              <Form.Group controlId="formDataRitiro">
                <Form.Control
                  type="date"
                  value={dataRitiro}
                  onChange={(e) => setDataRitiro(e.target.value)}
                />
              </Form.Group>

              <h3 className="mt-4">
                Orario{" "}
                {deliveryMethod === "asporto" ? "di ritiro" : "di consegna"}{" "}
                preferenziale
              </h3>
              <Form.Group controlId="formOrarioRitiro" className="pickup-time">
                <Form.Control
                  type="time"
                  value={orarioRitiro}
                  onChange={(e) => setOrarioRitiro(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEsigenzeParticolari" className="mt-4">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={esigenzeParticolari}
                  onChange={(e) => setEsigenzeParticolari(e.target.value)}
                  placeholder="Inserisci eventuali esigenze particolari..."
                />
              </Form.Group>

              {deliveryMethod === "domicilio" && (
                <>
                  <Form.Group controlId="formTelefono" className="mt-4">
                    <Form.Control
                      type="tel"
                      value={telefono}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setTelefono(value);
                        }
                      }}
                      placeholder="Telefono"
                    />
                  </Form.Group>

                  <Form.Group controlId="formIndirizzo" className="mt-4">
                    <Form.Control
                      type="text"
                      value={indirizzo}
                      onChange={(e) => setIndirizzo(e.target.value)}
                      placeholder="Indirizzo"
                    />
                  </Form.Group>
                </>
              )}

              <button
                className="checkout-btn mt-3"
                onClick={handleCheckout}
                disabled={
                  cart.length === 0 ||
                  !dataRitiro ||
                  !orarioRitiro ||
                  (deliveryMethod === "domicilio" && (!telefono || !indirizzo))
                }
              >
                Procedi con l'Ordine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrello;
