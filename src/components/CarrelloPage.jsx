import React, { useState, useEffect } from "react";
import { Button, Form, ToastContainer, Toast } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../assets/styles/CarrelloPage.css";

function Carrello() {
  const [cart, setCart] = useState([]);
  const [totale, setTotale] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dataRitiro, setDataRitiro] = useState("");
  const [orarioRitiro, setOrarioRitiro] = useState("");
  const [esigenzeParticolari, setEsigenzeParticolari] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const total = storedCart.reduce((acc, item) => acc + item.price, 0);
    setTotale(total);
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");

    setToastMessage("Ordine inviato con successo!");
    setShowToast(true);
    localStorage.removeItem("cart");
    setCart([]);
    navigate("/successorder", { state: { totale } });

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

    if (
      !dataRitiro ||
      !orarioRitiro ||
      (deliveryMethod === "domicilio" && (!telefono || !indirizzo))
    ) {
      setToastMessage("Per favore, completa tutti i campi necessari.");
      setShowToast(true);
      return;
    }

    const user = jwt_decode(token);

    const ordine = {
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
        esigenzeParticolari || "Nessuna esigenza particolare",
      data: dataRitiro,
      orario: orarioRitiro,
      username: user.sub,
      conto: totale,
      telefono: telefono,
      indirizzo: indirizzo,
    };

    console.log(ordine);
    const url =
      deliveryMethod === "asporto"
        ? "http://localhost:8085/api/ordini/asporto/invia"
        : "http://localhost:8085/api/ordini/domicilio/invia";

    console.log("Inizio invio ordine");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ordine),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error(
          "Errore nell'invio dell'ordine. Status:",
          response.status
        );
        setToastMessage(`Errore nell'invio dell'ordine: ${responseText}`);
        setShowToast(true);
        return;
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
              <Form>
                <h3>Data di ritiro</h3>
                <Form.Group controlId="formDataRitiro">
                  <Form.Control
                    type="date"
                    value={dataRitiro}
                    onChange={(e) => setDataRitiro(e.target.value)}
                  />
                </Form.Group>

                <h3 className="mt-4">Orario di ritiro preferenziale</h3>
                <Form.Group
                  controlId="formOrarioRitiro"
                  className="pickup-time"
                >
                  <Form.Control
                    type="time"
                    value={orarioRitiro}
                    onChange={(e) => setOrarioRitiro(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  controlId="formEsigenzeParticolari"
                  className="mt-4"
                >
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
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Inserisci il tuo numero di telefono"
                      />
                    </Form.Group>

                    <Form.Group controlId="formIndirizzo" className="mt-4">
                      <Form.Control
                        type="text"
                        value={indirizzo}
                        onChange={(e) => setIndirizzo(e.target.value)}
                        placeholder="Inserisci l'indirizzo di consegna"
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
                    (deliveryMethod === "domicilio" &&
                      (!telefono || !indirizzo))
                  }
                >
                  Procedi con l'Ordine
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrello;
