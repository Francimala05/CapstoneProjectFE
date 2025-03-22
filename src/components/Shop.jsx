import React, { useEffect, useState } from "react";
import "../assets/styles/Shop.css";
import { Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import { CaretDownFill, CaretRightFill, CartFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function Shop() {
  const [pizzas, setPizzas] = useState([]);
  const [panuozzi, setPanuozzi] = useState([]);
  const [fritti, setFritti] = useState([]);
  const [bibite, setBibite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPizzaSectionVisible, setIsPizzaSectionVisible] = useState(true);
  const [isPanuozzoSectionVisible, setIsPanuozzoSectionVisible] =
    useState(true);
  const [isFrittiSectionVisible, setIsFrittiSectionVisible] = useState(true);
  const [isBibiteSectionVisible, setIsBibiteSectionVisible] = useState(true);
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const fetchData = async () => {
      try {
        const [pizzaData, panuozzoData, frittiData, bibiteData] =
          await Promise.all([
            fetch("http://localhost:8085/api/pizzas").then((res) => res.json()),
            fetch("http://localhost:8085/api/panuozzi").then((res) =>
              res.json()
            ),
            fetch("http://localhost:8085/api/fritti").then((res) => res.json()),
            fetch("http://localhost:8085/api/drinks").then((res) => res.json()),
          ]);
        setPizzas(pizzaData);
        setPanuozzi(panuozzoData);
        setFritti(frittiData);
        setBibite(bibiteData);
      } catch (error) {
        console.error("Errore nel recupero dei dati", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = [...prevCart, item];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    setToastMessage("Prodotto aggiunto all'ordine!");
    setShowToast(true);
  };

  const handleCartClick = () => {
    navigate("/Carrello", { state: { cart } });
    window.scrollTo(0, 0);
  };

  const toggleSection = (section) => {
    switch (section) {
      case "pizza":
        setIsPizzaSectionVisible((prev) => !prev);
        break;
      case "panuozzo":
        setIsPanuozzoSectionVisible((prev) => !prev);
        break;
      case "fritti":
        setIsFrittiSectionVisible((prev) => !prev);
        break;
      case "bibite":
        setIsBibiteSectionVisible((prev) => !prev);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <div>Caricamento in corso...</div>;
  }

  return (
    <div>
      <h4 className="text-warning menu-title">Il nostro Shop!</h4>

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
          className="bg-light"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h5
        onClick={() => toggleSection("pizza")}
        className="menu-toggle text-warning"
      >
        {isPizzaSectionVisible ? "Pizze" : "Pizze"}{" "}
        {isPizzaSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>
      {isPizzaSectionVisible && (
        <div className="pizza-menu">
          {pizzas.map((pizza) => (
            <Card key={pizza.id} className="pizza-card">
              <Card.Img
                variant="top"
                src={
                  pizza.imageUrl ||
                  "http://localhost:8085/images/1742217397019_Margherita.jpg"
                }
                alt={pizza.name}
              />
              <Card.Body>
                <Card.Title className="pizza-title">{pizza.name}</Card.Title>
                <Card.Text className="pizza-ingredients">
                  <strong>Ingredienti: </strong>
                  {pizza.toppings
                    ? pizza.toppings.join(", ")
                    : "Ingredienti non disponibili"}
                </Card.Text>
                <Row>
                  <Col
                    className="pizza-price1"
                    onClick={() =>
                      addToCart({ name: pizza.name, price: pizza.price })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>Singola:</strong> <br /> €{pizza.price}
                  </Col>
                  <Col
                    className="pizza-price1"
                    onClick={() =>
                      addToCart({
                        name: pizza.name,
                        price: pizza.mezzoChiloPrice,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>1/2 Kg:</strong> <br /> €{pizza.mezzoChiloPrice}
                  </Col>
                  <Col
                    className="pizza-price1"
                    onClick={() =>
                      addToCart({ name: pizza.name, price: pizza.chiloPrice })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>1 Kg:</strong> <br /> €{pizza.chiloPrice}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <h5
        onClick={() => toggleSection("panuozzo")}
        className="menu-toggle text-warning"
      >
        {isPanuozzoSectionVisible ? "Panuozzi" : "Panuozzi"}{" "}
        {isPanuozzoSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>
      {isPanuozzoSectionVisible && (
        <div className="panuozzo-menu">
          {panuozzi.map((panuozzo) => (
            <Card key={panuozzo.id} className="panuozzo-card">
              <Card.Img
                variant="top"
                src={panuozzo.imageUrl}
                alt={panuozzo.name}
              />
              <Card.Body>
                <Card.Title className="panuozzo-title">
                  {panuozzo.name}
                </Card.Title>
                <Card.Text className="panuozzo-ingredients">
                  <strong>Ingredienti: </strong>
                  {panuozzo.toppings
                    ? panuozzo.toppings.join(", ")
                    : "Ingredienti non disponibili"}
                </Card.Text>
                <Row>
                  <Col
                    className="panuozzo-price1"
                    onClick={() =>
                      addToCart({
                        name: panuozzo.name,
                        price: panuozzo.mezzoPrice,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>Singolo:</strong> <br /> €{panuozzo.mezzoPrice}
                  </Col>
                  <Col
                    className="panuozzo-price1"
                    onClick={() =>
                      addToCart({
                        name: panuozzo.name,
                        price: panuozzo.interoPrice,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>Intero:</strong> <br /> €{panuozzo.interoPrice}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <h5
        onClick={() => toggleSection("fritti")}
        className="menu-toggle text-warning"
      >
        {isFrittiSectionVisible ? "Rosticceria" : "Rosticceria"}{" "}
        {isFrittiSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>
      {isFrittiSectionVisible && (
        <div className="fritti-menu">
          {fritti.map((fritto) => (
            <Row
              key={fritto.id}
              className="fritto-row1"
              onClick={() =>
                addToCart({ name: fritto.name, price: fritto.price })
              }
              style={{ cursor: "pointer" }}
            >
              <Col>{fritto.name}</Col>
              <Col className="fritto-price">€{fritto.price}</Col>
            </Row>
          ))}
        </div>
      )}

      <h5
        onClick={() => toggleSection("bibite")}
        className="menu-toggle text-warning"
      >
        {isBibiteSectionVisible ? "Bibite" : "Bibite"}{" "}
        {isBibiteSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>
      {isBibiteSectionVisible && (
        <div className="bibite-menu">
          {bibite.map((bibita) => (
            <Row
              key={bibita.id}
              className="bibita-row1"
              onClick={() =>
                addToCart({ name: bibita.name, price: bibita.price })
              }
              style={{ cursor: "pointer" }}
            >
              <Col>{bibita.name}</Col>
              <Col>{bibita.formato}</Col>
              <Col className="bibita-price">€{bibita.price}</Col>
            </Row>
          ))}
        </div>
      )}

      <div className="cart-icon" onClick={handleCartClick}>
        <CartFill size={30} color="white" />
      </div>
    </div>
  );
}

export default Shop;
