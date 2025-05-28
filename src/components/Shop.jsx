import React, { useEffect, useState } from "react";
import "../assets/styles/Shop.css";
import {
  Card,
  Row,
  Col,
  ToastContainer,
  Toast,
  Spinner,
} from "react-bootstrap";
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
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  const getProductDetails = (id, type, formato) => {
    let product = null;

    switch (type) {
      case "pizza":
        product = pizzas.find((item) => item.id === id);
        break;
      case "panuozzo":
        product = panuozzi.find((item) => item.id === id);
        break;
      case "fritto":
        product = fritti.find((item) => item.id === id);
        break;
      case "bibita":
        product = bibite.find((item) => item.id === id);
        break;
      default:
        return null;
    }

    if (product) {
      return { name: product.name, formato: formato || "N/D" };
    } else {
      return null;
    }
  };

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

        console.log("Struttura dati pizza:", pizzaData);
        console.log("Struttura dati panuozzo:", panuozzoData);

        console.log("Dati delle pizze:", pizzaData);
        console.log("Dati dei panuozzi:", panuozzoData);
        console.log("Dati dei fritti:", frittiData);
        console.log("Dati delle bibite:", bibiteData);
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

  const addToCart = (item, type) => {
    const itemId = item.id;

    const productDetails = getProductDetails(itemId, type, item.formato);

    if (!productDetails) {
      console.error("Prodotto non trovato");
      return;
    }

    const { name, formato } = productDetails;

    const itemWithDetails = {
      ...item,
      name: name,
      formato: formato,
      type,
      key: `${itemId}-${formato}`,
      shopId: "SHOP",
    };

    setCart((prevCart) => {
      const newCart = [...prevCart, itemWithDetails];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    setToastMessage("Prodotto aggiunto all'ordine!");
    setToastType("success");
    setShowToast(true);
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setToastMessage("Per questa operazione è necessario il Login");
      setToastType("error");
      setShowToast(true);

      setTimeout(() => {
        window.scrollTo(0, 0);
        navigate("/login");
      }, 1000);
    } else {
      window.scrollTo(0, 0);
      navigate("/carrello", { state: { cart } });
    }
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
    return <Spinner animation="border" variant="warning" className="mt-3" />;
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
          className={`bg-light ${toastType === "error" ? "text-danger" : ""}`}
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
          {Object.entries(
            pizzas.reduce((acc, item) => {
              if (!acc[item.name]) {
                acc[item.name] = {
                  name: item.name,
                  imageUrl: item.imageUrl,
                  toppings: item.toppings,
                  formati: {},
                };
              }
              acc[item.name].formati[item.formato] = {
                id: item.id,
                price: item.price,
              };
              return acc;
            }, {})
          ).map(([key, value]) => (
            <Card key={key} className="pizza-card">
              <Card.Img variant="top" src={value.imageUrl} alt={value.name} />
              <Card.Body>
                <Card.Title className="pizza-title">{value.name}</Card.Title>
                <Card.Text className="pizza-ingredients">
                  <strong>Ingredienti: </strong>
                  {value.toppings ? value.toppings.join(", ") : "N/A"}
                </Card.Text>
                <Row>
                  {Object.entries(value.formati)
                    .sort(([formatoA], [formatoB]) => {
                      const formatoOrder = { Singola: 0, "700g": 1, "1kg": 2 };
                      const orderA = formatoOrder[formatoA] ?? 99;
                      const orderB = formatoOrder[formatoB] ?? 99;
                      return orderA - orderB;
                    })
                    .map(([formato, { id, price }]) => (
                      <Col
                        key={`${id}-${formato}`}
                        className="pizza-price1"
                        onClick={() =>
                          addToCart(
                            {
                              id,
                              name: value.name,
                              price,
                              formato,
                            },
                            "pizza"
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <strong>{formato}:</strong> <br />€{price}
                      </Col>
                    ))}
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
          {Object.entries(
            panuozzi.reduce((acc, item) => {
              if (!acc[item.name]) {
                acc[item.name] = {
                  name: item.name,
                  imageUrl: item.imageUrl,
                  toppings: item.toppings,
                  formati: {},
                };
              }
              acc[item.name].formati[item.formato] = {
                id: item.id,
                price: item.price,
              };
              return acc;
            }, {})
          ).map(([key, value]) => (
            <Card key={key} className="panuozzo-card">
              <Card.Img variant="top" src={value.imageUrl} alt={value.name} />
              <Card.Body>
                <Card.Title className="panuozzo-title">{value.name}</Card.Title>
                <Card.Text className="panuozzo-ingredients">
                  <strong>Ingredienti: </strong>
                  {value.toppings
                    ? value.toppings.join(", ")
                    : "Ingredienti non disponibili"}
                </Card.Text>
                <Row>
                  {value.formati["Singolo"] && (
                    <Col
                      className="panuozzo-price1"
                      onClick={() =>
                        addToCart(
                          {
                            id: value.formati["Singolo"].id,
                            name: value.name,
                            price: value.formati["Singolo"].price,
                            formato: "Singolo",
                          },
                          "panuozzo"
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <strong>Singolo:</strong> <br />€
                      {value.formati["Singolo"].price}
                    </Col>
                  )}
                  {value.formati["Intero"] && (
                    <Col
                      className="panuozzo-price1"
                      onClick={() =>
                        addToCart(
                          {
                            id: value.formati["Intero"].id,
                            name: value.name,
                            price: value.formati["Intero"].price,
                            formato: "Intero",
                          },
                          "panuozzo"
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <strong>Intero:</strong> <br />€
                      {value.formati["Intero"].price}
                    </Col>
                  )}
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
              key={`${fritto.id}-${fritto.name}`}
              className="fritto-row1"
              onClick={() =>
                addToCart(
                  { id: fritto.id, name: fritto.name, price: fritto.price },
                  "fritto"
                )
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
              key={`${bibita.id}-${bibita.formato}`}
              className="bibita-row1"
              onClick={() =>
                addToCart(
                  { id: bibita.id, name: bibita.name, price: bibita.price },
                  "bibita"
                )
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
