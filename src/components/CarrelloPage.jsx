import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Form,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../assets/styles/CarrelloPage.css"; // Aggiungi il tuo stile personalizzato

function Carrello() {
  const [cart, setCart] = useState([]); // Stato per il carrello
  const [totale, setTotale] = useState(0); // Stato per il totale dell'ordine
  const [showToast, setShowToast] = useState(false); // Stato per la gestione del Toast
  const [toastMessage, setToastMessage] = useState(""); // Messaggio del Toast
  const [dataRitiro, setDataRitiro] = useState(""); // Stato per la data di ritiro
  const [orarioRitiro, setOrarioRitiro] = useState(""); // Stato per l'orario di ritiro
  const [esigenzeParticolari, setEsigenzeParticolari] = useState(""); // Stato per le esigenze particolari
  const navigate = useNavigate();

  // Carica il carrello dal localStorage al montaggio del componente
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const total = storedCart.reduce((acc, item) => acc + item.price, 0);
    setTotale(total);
  }, []);

  // Funzione per il checkout e invio dell'ordine
  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");

    // Verifica se il token esiste e se è valido
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
      alert("Il tuo token non è valido. Effettua il login di nuovo.");
      navigate("/login");
      return;
    }

    // Verifica se la data e l'orario di ritiro sono stati selezionati
    if (!dataRitiro || !orarioRitiro) {
      setToastMessage(
        "Per favore, seleziona una data e un orario per il ritiro."
      );
      setShowToast(true);
      return;
    }

    const user = jwt_decode(token); // Decodifica il token per ottenere il nome utente
    console.log("User decoded:", user);

    // Crea l'oggetto dell'ordine
    const ordineAsporto = {
      pizzeIds: cart
        .filter((item) => item.type === "pizza")
        .map((item) => item.id),
      panuozziIds: cart
        .filter((item) => item.type === "panuozzo")
        .map((item) => item.id),
      frittiIds: cart
        .filter((item) => item.type === "fritto")
        .map((item) => item.id),
      bibiteIds: cart
        .filter((item) => item.type === "bibita")
        .map((item) => item.id),
      esigenzeParticolari:
        esigenzeParticolari || "Nessuna esigenza particolare", // Default value if empty
      data: dataRitiro,
      orario: orarioRitiro,
      username: user.sub,
      conto: totale,
    };

    console.log("Ordine Asporto:", ordineAsporto);

    // Invia l'ordine all'API
    try {
      const response = await fetch(
        "http://localhost:8085/api/ordini/asporto/invia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Corretta sintassi per l'autenticazione
          },
          body: JSON.stringify(ordineAsporto),
        }
      );

      if (response.ok) {
        setToastMessage("Ordine inviato con successo!");
        setShowToast(true);
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        console.error(
          "Errore nell'invio dell'ordine. Status:",
          response.status
        );
        throw new Error("Errore nell'invio dell'ordine");
      }
    } catch (error) {
      console.error("Errore durante l'invio dell'ordine:", error);
      setToastMessage("Errore durante l'invio dell'ordine. Riprova.");
      setShowToast(true);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedCart = cart.filter((item) => item.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const newTotale = updatedCart.reduce((acc, item) => acc + item.price, 0);
    setTotale(newTotale);
  };

  return (
    <div className="carrello-container">
      <h4 className="carrello-title">Il tuo Ordine</h4>

      <ToastContainer
        className="p-3"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        <Toast
          className={`bg-${
            toastMessage.includes("Errore") ? "danger" : "light"
          }`}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="carrello-items">
        {cart.length > 0 ? (
          <div className="carrello-items">
            {cart.map((item) => (
              <div key={item.key} className="carrello-item">
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
              <h3 className="total">Totale: €{totale.toFixed(2)}</h3>
            </div>
            <div className="add-products">
              <Button
                className="btn-transparent"
                onClick={() => navigate("/shop")}
              >
                Aggiungi prodotti
              </Button>
            </div>
          </div>
        ) : (
          <div className="carrello-empty">
            <p>Il carrello è vuoto.</p>
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
            <div className="delivery-option selected">Asporto</div>
          </div>

          <div className="domicilio-details">
            <Form>
              <Form.Group controlId="formDataRitiro">
                <Form.Label>Data di ritiro</Form.Label>
                <Form.Control
                  type="date"
                  value={dataRitiro}
                  onChange={(e) => setDataRitiro(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formOrarioRitiro" className="mt-2">
                <Form.Label>Orario di ritiro</Form.Label>
                <Form.Control
                  className="pickup-time"
                  type="time"
                  value={orarioRitiro}
                  onChange={(e) => setOrarioRitiro(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEsigenzeParticolari" className="mt-2">
                <Form.Label>Esigenze particolari</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={esigenzeParticolari}
                  onChange={(e) => setEsigenzeParticolari(e.target.value)}
                  placeholder="Inserisci eventuali esigenze particolari..."
                />
              </Form.Group>

              <button
                className="checkout-btn mt-3"
                onClick={handleCheckout}
                disabled={cart.length === 0 || !dataRitiro || !orarioRitiro} // Disabilita il pulsante se il carrello è vuoto o se i campi obbligatori non sono compilati
              >
                Procedi con l'Ordine
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrello;
