import React, { useEffect, useState } from "react";
import "../assets/styles/Menu.css";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { CaretDownFill, CaretRightFill } from "react-bootstrap-icons";

function Menu() {
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

  useEffect(() => {
    fetch("http://localhost:8085/api/pizzas")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dati ricevuti dal backend:", data);
        setPizzas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel recupero delle pizze", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8085/api/panuozzi")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dati ricevuti dal backend per i panuozzi:", data);
        setPanuozzi(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei panuozzi", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8085/api/fritti")
      .then((response) => response.json())
      .then((data) => {
        setFritti(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei fritti", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8085/api/drinks")
      .then((response) => response.json())
      .then((data) => {
        setBibite(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero delle bibite", error);
      });
  }, []);

  const togglePizzaSection = () => {
    setIsPizzaSectionVisible((prevState) => !prevState);
  };

  const togglePanuozzoSection = () => {
    setIsPanuozzoSectionVisible((prevState) => !prevState);
  };

  const toggleFrittiSection = () => {
    setIsFrittiSectionVisible((prevState) => !prevState);
  };

  const toggleBibiteSection = () => {
    setIsBibiteSectionVisible((prevState) => !prevState);
  };

  if (loading) {
    return <Spinner animation="border" variant="warning" className="mt-3" />;
  }

  if (pizzas.length === 0 && panuozzi.length === 0) {
    return <div>Nessuna pizza o panuozzo trovato</div>;
  }

  return (
    <div>
      <h4 className="text-warning menu-title">Il nostro Menù!</h4>
      <h5 onClick={togglePizzaSection} className="menu-toggle text-warning">
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
              acc[item.name].formati[item.formato] = item.price;
              return acc;
            }, {})
          ).map(([key, value]) => (
            <Card key={key} className="pizza-card">
              <Card.Img variant="top" src={value.imageUrl} alt={value.name} />
              <Card.Body>
                <Card.Title className="pizza-title">{value.name}</Card.Title>
                <Card.Text className="pizza-ingredients">
                  <strong>Ingredienti: </strong>
                  {value.toppings.join(", ")}
                </Card.Text>
                <Row>
                  {Object.entries(value.formati)
                    .sort(([formatoA], [formatoB]) => {
                      const formatoOrder = { Singola: 0, "700g": 1, "1kg": 2 };
                      const orderA = formatoOrder[formatoA] ?? 99;
                      const orderB = formatoOrder[formatoB] ?? 99;
                      return orderA - orderB;
                    })
                    .map(([formato, prezzo]) => (
                      <Col key={formato} className="pizza-price">
                        <strong>{formato}:</strong>
                        <br />€{prezzo}
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <h5 onClick={togglePanuozzoSection} className="menu-toggle text-warning">
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

              acc[item.name].formati[item.formato] = item.price;
              return acc;
            }, {})
          ).map(([key, value]) => (
            <Card key={key} className="panuozzo-card">
              <Card.Img variant="top" src={value.imageUrl} alt={value.name} />
              <Card.Body>
                <Card.Title className="panuozzo-title">{value.name}</Card.Title>
                <Card.Text className="panuozzo-ingredients">
                  <strong>Ingredienti: </strong>
                  {value.toppings.join(", ")}
                </Card.Text>
                <Row>
                  {value.formati["Singolo"] && (
                    <Col className="panuozzo-price">
                      <strong>Singolo:</strong>
                      <br />€{value.formati["Singolo"]}
                    </Col>
                  )}
                  {value.formati["Intero"] && (
                    <Col className="panuozzo-price">
                      <strong>Intero:</strong>
                      <br />€{value.formati["Intero"]}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <h5 onClick={toggleFrittiSection} className="menu-toggle text-warning">
        {isFrittiSectionVisible ? "Rosticceria" : "Rosticceria"}{" "}
        {isFrittiSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>

      {isFrittiSectionVisible && (
        <div className="fritti-menu">
          {fritti.map((fritto) => (
            <Row key={fritto.id} className="fritto-row">
              <Col>{fritto.name}</Col>
              <Col className="fritto-price">€{fritto.price}</Col>
            </Row>
          ))}
        </div>
      )}

      <h5 onClick={toggleBibiteSection} className="menu-toggle text-warning">
        {isBibiteSectionVisible ? "Bibite" : "Bibite"}{" "}
        {isBibiteSectionVisible ? <CaretDownFill /> : <CaretRightFill />}
      </h5>
      {isBibiteSectionVisible && (
        <div className="bibite-menu">
          {bibite.map((bibita) => (
            <Row key={bibita.id} className="bibita-row">
              <Col>{bibita.name}</Col>
              <Col>{bibita.formato}</Col>
              <Col className="bibita-price">€{bibita.price}</Col>
            </Row>
          ))}
        </div>
      )}

      <div className="coperto-text">Coperto 1€</div>
    </div>
  );
}

export default Menu;
