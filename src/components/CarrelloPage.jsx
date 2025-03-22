import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/CarrelloPage.css";
import { Trash3Fill } from "react-bootstrap-icons";
import jwt_decode from "jwt-decode";

function Carrello() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart =
    location.state?.cart || JSON.parse(localStorage.getItem("cart")) || [];

  const [deliveryOption, setDeliveryOption] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updatedCart, setUpdatedCart] = useState(cart);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      });
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }, [updatedCart]);

  const getTotalPrice = () => {
    let total = updatedCart.reduce((total, item) => total + item.price, 0);
    if (deliveryOption === "Domicilio") {
      total += 1;
    }
    return total.toFixed(2);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const removeItemFromCart = (index) => {
    const newCart = updatedCart.filter((_, idx) => idx !== index);
    setUpdatedCart(newCart);
  };

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Token non trovato, assicurati di essere loggato.");
      return null;
    }

    try {
      const decodedToken = jwt_decode(token);
      return decodedToken.username || decodedToken.sub || decodedToken.name;
    } catch (error) {
      console.error("Errore nella decodifica del token:", error);
      return null;
    }
  };

  const handleSubmitOrder = async () => {
    const userInfo = getUsernameFromToken();
    if (!userInfo) {
      alert("Per inviare l'ordine, è necessario essere loggati.");
      navigate("/login");
      return;
    }

    if (
      !pickupDate ||
      !pickupTime ||
      (deliveryOption === "Domicilio" && (!address || !phoneNumber))
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    console.log(userInfo);

    const orderData = {
      idUtente: userInfo.id,
      nomeUtente: userInfo.nome,
      cognomeUtente: userInfo.cognome,
      dataRitiro: deliveryOption === "Asporto" ? pickupDate : deliveryDate,
      orarioRitiro: pickupTime,
      totale: getTotalPrice(),
      idPizze: [],
      idPanuozzi: [],
      idFritti: [],
      idBibite: [],
    };

    updatedCart.forEach((item) => {
      if (item.name.toLowerCase().includes("pizza")) {
        orderData.idPizze.push(item.id);
      } else if (item.name.toLowerCase().includes("panuozzo")) {
        orderData.idPanuozzi.push(item.id);
      } else if (item.name.toLowerCase().includes("fritto")) {
        orderData.idFritti.push(item.id);
      } else if (item.name.toLowerCase().includes("bibita")) {
        orderData.idBibite.push(item.id);
      }
    });

    try {
      const response = await fetch(
        "http://localhost:8085/api/ordini/asporto/invia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        alert("Ordine inviato con successo!");
        setUpdatedCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
        // navigate("/Ordine_inviato");
      }
    } catch (error) {
      console.error("Errore durante l'invio dell'ordine:", error);
      alert("Si è verificato un errore durante l'invio dell'ordine.");
    }
  };

  return (
    <div className="carrello-container">
      <h4 className="carrello-title">Il tuo Ordine</h4>
      <div className="carrello-items">
        {updatedCart.map((item, index) => (
          <div key={index} className="carrello-item">
            <span className="item-name">{item.name}</span>
            <span className="item-price">€{item.price}</span>
            <span
              className="item-remove"
              onClick={() => removeItemFromCart(index)}
            >
              <div className="trash-icon-container">
                <Trash3Fill />
              </div>
            </span>
          </div>
        ))}
      </div>
      <div className="add-products">
        <Link to="/shop">
          <Button className="btn-transparent">Aggiungi prodotti</Button>
        </Link>
      </div>
      <div className="total">
        <h3>Totale: €{getTotalPrice()}</h3>
      </div>
      <div className="decisional-section">
        <div className="delivery-option-container">
          <div
            className={`delivery-option ${
              deliveryOption === "Asporto" ? "selected" : ""
            }`}
            onClick={() =>
              handleDeliveryOptionChange({ target: { value: "Asporto" } })
            }
          >
            <h3>Asporto</h3>
          </div>
          <div
            className={`delivery-option ${
              deliveryOption === "Domicilio" ? "selected" : ""
            }`}
            onClick={() =>
              handleDeliveryOptionChange({ target: { value: "Domicilio" } })
            }
          >
            <h3>Domicilio</h3>
          </div>
        </div>

        {(deliveryOption === "Asporto" || deliveryOption === "Domicilio") && (
          <div className="mt-4">
            <h3>
              {deliveryOption === "Asporto"
                ? "Data di ritiro"
                : "Data di consegna"}
              :
            </h3>
            <Form.Group className="pickup-date">
              <Form.Control
                type="date"
                value={deliveryOption === "Asporto" ? pickupDate : deliveryDate}
                onChange={(e) =>
                  deliveryOption === "Asporto"
                    ? setPickupDate(e.target.value)
                    : setDeliveryDate(e.target.value)
                }
                placeholder="gg/mm/aaaa"
              />
            </Form.Group>
            <h3 className="mt-4">
              {deliveryOption === "Asporto"
                ? "Orario di ritiro"
                : "Orario di consegna"}{" "}
              preferenziale:
            </h3>
            <Form.Group className="pickup-time">
              <Form.Control
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                placeholder="--:--"
              />
            </Form.Group>
          </div>
        )}

        {deliveryOption === "Domicilio" && (
          <div className="domicilio-details mt-4">
            <Form.Group>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Inserisci il tuo indirizzo"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Inserisci il tuo numero di telefono"
                maxLength="10"
              />
            </Form.Group>
          </div>
        )}
      </div>

      <Button className="checkout-btn" onClick={handleSubmitOrder}>
        Invia l'ordine!
      </Button>
    </div>
  );
}

export default Carrello;
