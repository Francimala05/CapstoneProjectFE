import React, { useEffect, useState } from "react";
import "../assets/styles/Menu.css";
import {
  Card,
  Row,
  Col,
  Spinner,
  Button,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { CaretDownFill, CaretRightFill } from "react-bootstrap-icons";

function GestioneMenu() {
  const [pizzas, setPizzas] = useState([]);
  const [panuozzi, setPanuozzi] = useState([]);
  const [fritti, setFritti] = useState([]);
  const [bibite, setBibite] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sectionsVisible, setSectionsVisible] = useState({
    pizza: true,
    panuozzo: true,
    fritti: true,
    bibite: true,
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success"); // default "success"
  const [showToast, setShowToast] = useState(false);

  const [editingFrittoId, setEditingFrittoId] = useState(null);
  const [editingFrittoData, setEditingFrittoData] = useState({
    name: "",
    price: "",
  });

  const [editingBibitaId, setEditingBibitaId] = useState(null);
  const [editingBibitaData, setEditingBibitaData] = useState({
    name: "",
    formato: "",
    price: "",
  });

  const [editingPizzaKey, setEditingPizzaKey] = useState(null);
  const [editingPizzaData, setEditingPizzaData] = useState({
    name: "",
    formati: {},
    toppings: "",
  });

  const [editingPanuozzoKey, setEditingPanuozzoKey] = useState(null);
  const [editingPanuozzoData, setEditingPanuozzoData] = useState({
    name: "",
    formati: {},
    toppings: "",
  });

  const showAlert = (message, variant = "success") => {
    setToastMessage(message);
    setToastType(variant);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8085/api/pizzas").then((res) => res.json()),
      fetch("http://localhost:8085/api/panuozzi").then((res) => res.json()),
      fetch("http://localhost:8085/api/fritti").then((res) => res.json()),
      fetch("http://localhost:8085/api/drinks").then((res) => res.json()),
    ])
      .then(([pizzasData, panuozziData, frittiData, bibiteData]) => {
        setPizzas(pizzasData);
        setPanuozzi(panuozziData);
        setFritti(frittiData);
        setBibite(bibiteData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel recupero dati", error);
        setLoading(false);
      });
  }, []);

  const toggleSection = (section) => {
    setSectionsVisible((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const startEditPizza = (key, pizza) => {
    setEditingPizzaKey(key);
    setEditingPizzaData({
      name: pizza.name,
      formati: { ...pizza.formati },
      toppings: pizza.toppings.join(", "),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("formato-")) {
      const formato = name.replace("formato-", "");
      setEditingPizzaData((prev) => ({
        ...prev,
        formati: {
          ...prev.formati,
          [formato]: value,
        },
      }));
    } else {
      setEditingPizzaData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const savePizza = async () => {
    const { name, formati, toppings } = editingPizzaData;

    if (!name.trim() || !toppings.trim()) {
      showAlert("Inserisci nome e ingredienti", "danger");
      return;
    }

    try {
      for (const [formato, prezzo] of Object.entries(formati)) {
        if (!prezzo) continue;

        const pizzaDTO = {
          name,
          formato,
          price: parseFloat(prezzo),
          toppings: toppings.split(",").map((t) => t.trim()),
        };

        const formData = new FormData();
        formData.append("pizza", JSON.stringify(pizzaDTO));

        const response = await fetch(
          `http://localhost:8085/api/pizzas?name=${encodeURIComponent(
            name
          )}&formato=${encodeURIComponent(formato)}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Errore durante aggiornamento pizza");
        }
      }

      showAlert("Pizza aggiornata con successo!");
      setEditingPizzaKey(null);

      const res = await fetch("http://localhost:8085/api/pizzas");
      const data = await res.json();
      setPizzas(data);
    } catch (error) {
      showAlert("Errore: " + error.message, "danger");
    }
  };
  const startEditFritto = (fritto) => {
    setEditingFrittoId(fritto.id);
    setEditingFrittoData({ name: fritto.name, price: fritto.price });
  };

  const handleEditFrittoChange = (e) => {
    const { name, value } = e.target;
    setEditingFrittoData((prev) => ({ ...prev, [name]: value }));
  };

  const saveFritto = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/fritti/${editingFrittoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingFrittoData),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const updated = await fetch("http://localhost:8085/api/fritti").then(
        (r) => r.json()
      );
      setFritti(updated);
      setEditingFrittoId(null);
      showAlert("Fritto aggiornato!");
    } catch (err) {
      showAlert("Errore aggiornamento fritto: " + err.message, "danger");
    }
  };

  const startEditBibita = (bibita) => {
    setEditingBibitaId(bibita.id);
    setEditingBibitaData({
      name: bibita.name,
      formato: bibita.formato,
      price: bibita.price,
    });
  };

  const handleEditBibitaChange = (e) => {
    const { name, value } = e.target;
    setEditingBibitaData((prev) => ({ ...prev, [name]: value }));
  };

  const saveBibita = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/drinks/${editingBibitaId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingBibitaData),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const updated = await fetch("http://localhost:8085/api/drinks").then(
        (r) => r.json()
      );
      setBibite(updated);
      setEditingBibitaId(null);
      showAlert("Bibita aggiornata!");
    } catch (err) {
      showAlert("Errore aggiornamento bibita: " + err.message, "danger");
    }
  };

  const startEditPanuozzo = (key, panuozzo) => {
    setEditingPanuozzoKey(key);
    setEditingPanuozzoData({
      name: panuozzo.name,
      toppings: panuozzo.toppings.join(", "),
      formati: { ...panuozzo.formati },
    });
  };

  const handleEditPanuozzoChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("formato-")) {
      const formato = name.replace("formato-", "");
      setEditingPanuozzoData((prev) => ({
        ...prev,
        formati: { ...prev.formati, [formato]: value },
      }));
    } else {
      setEditingPanuozzoData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const savePanuozzo = async () => {
    try {
      for (const [formato, prezzo] of Object.entries(
        editingPanuozzoData.formati
      )) {
        if (!prezzo) continue;

        const dto = {
          name: editingPanuozzoData.name,
          formato,
          price: parseFloat(prezzo),
          toppings: editingPanuozzoData.toppings
            .split(",")
            .map((t) => t.trim()),
        };

        const formData = new FormData();
        formData.append("panuozzo", JSON.stringify(dto));

        const res = await fetch(
          `http://localhost:8085/api/panuozzi?name=${dto.name}&formato=${formato}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!res.ok) throw new Error(await res.text());
      }

      const data = await fetch("http://localhost:8085/api/panuozzi").then((r) =>
        r.json()
      );
      setPanuozzi(data);
      setEditingPanuozzoKey(null);
      showAlert("Panuozzo aggiornato!");
    } catch (err) {
      showAlert("Errore aggiornamento panuozzo: " + err.message, "danger");
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="warning" className="mt-3" />;
  }

  if (pizzas.length === 0 && panuozzi.length === 0) {
    return <div>Nessuna pizza o panuozzo trovato</div>;
  }

  const pizzasGrouped = Object.entries(
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
  );

  return (
    <div>
      <h4 className="text-warning menu-title">Gestionale Menù</h4>

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
          className={`bg-light ${toastType === "danger" ? "text-danger" : ""}`}
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
        style={{ cursor: "pointer" }}
      >
        Pizze {sectionsVisible.pizza ? <CaretDownFill /> : <CaretRightFill />}
      </h5>

      {sectionsVisible.pizza && (
        <div className="pizza-menu">
          {pizzasGrouped.map(([key, pizza]) => (
            <Card key={key} className="pizza-card mb-3">
              <Card.Img variant="top" src={pizza.imageUrl} alt={pizza.name} />
              <Card.Body>
                <Card.Title className="d-flex align-items-center justify-content-between pizza-title">
                  <span>{pizza.name}</span>
                  {editingPizzaKey === key ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={savePizza}
                        className="me-2"
                      >
                        Salva
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingPizzaKey(null)}
                      >
                        Annulla
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => startEditPizza(key, pizza)}
                    >
                      Modifica
                    </Button>
                  )}
                </Card.Title>

                {editingPizzaKey === key ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Ingredienti</Form.Label>
                      <Form.Control
                        type="text"
                        name="toppings"
                        value={editingPizzaData.toppings}
                        onChange={handleEditChange}
                      />
                    </Form.Group>

                    <Form.Label>Formati e Prezzi</Form.Label>
                    {Object.entries(editingPizzaData.formati).map(
                      ([formato, prezzo]) => (
                        <Form.Group
                          key={formato}
                          className="mb-2 d-flex align-items-center"
                        >
                          <Form.Label style={{ minWidth: 70 }}>
                            {formato}:
                          </Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name={"formato-" + formato}
                            value={prezzo}
                            onChange={handleEditChange}
                            style={{ maxWidth: 120 }}
                          />
                        </Form.Group>
                      )
                    )}
                  </>
                ) : (
                  <>
                    <Card.Text className="pizza-ingredients">
                      <strong>Ingredienti: </strong>
                      {pizza.toppings.join(", ")}
                    </Card.Text>
                    <Row>
                      {Object.entries(pizza.formati)
                        .sort(([a], [b]) => {
                          const order = { Singola: 0, "700g": 1, "1kg": 2 };
                          return (order[a] ?? 99) - (order[b] ?? 99);
                        })
                        .map(([formato, prezzo]) => (
                          <Col
                            key={formato}
                            className="pizza-price"
                            style={{ marginBottom: 10 }}
                          >
                            <strong>{formato}:</strong> <br /> €{prezzo}
                          </Col>
                        ))}
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <h5
        onClick={() => toggleSection("panuozzo")}
        className="menu-toggle text-warning"
        style={{ cursor: "pointer" }}
      >
        Panuozzi{" "}
        {sectionsVisible.panuozzo ? <CaretDownFill /> : <CaretRightFill />}
      </h5>

      {sectionsVisible.panuozzo && (
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
                <Card.Title className="d-flex align-items-center justify-content-between">
                  <span>{value.name}</span>
                  {editingPanuozzoKey === key ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={savePanuozzo}
                        className="me-2"
                      >
                        Salva
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingPanuozzoKey(null)}
                      >
                        Annulla
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => startEditPanuozzo(key, value)}
                    >
                      Modifica
                    </Button>
                  )}
                </Card.Title>

                {editingPanuozzoKey === key ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Ingredienti</Form.Label>
                      <Form.Control
                        type="text"
                        name="toppings"
                        value={editingPanuozzoData.toppings}
                        onChange={handleEditPanuozzoChange}
                      />
                    </Form.Group>

                    <Form.Label>Formati e Prezzi</Form.Label>
                    {Object.entries(editingPanuozzoData.formati).map(
                      ([formato, prezzo]) => (
                        <Form.Group
                          key={formato}
                          className="mb-2 d-flex align-items-center"
                        >
                          <Form.Label style={{ minWidth: 80 }}>
                            {formato}:
                          </Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name={"formato-" + formato}
                            value={prezzo}
                            onChange={handleEditPanuozzoChange}
                            style={{ maxWidth: 120 }}
                          />
                        </Form.Group>
                      )
                    )}
                  </>
                ) : (
                  <>
                    <Card.Text className="panuozzo-ingredients">
                      <strong>Ingredienti: </strong>
                      {value.toppings.join(", ")}
                    </Card.Text>
                    <Row>
                      {value.formati["Singolo"] && (
                        <Col
                          className="panuozzo-price"
                          style={{ marginBottom: 10 }}
                        >
                          <strong>Singolo:</strong> <br />€
                          {value.formati["Singolo"]}
                        </Col>
                      )}
                      {value.formati["Intero"] && (
                        <Col
                          className="panuozzo-price"
                          style={{ marginBottom: 10 }}
                        >
                          <strong>Intero:</strong> <br />€
                          {value.formati["Intero"]}
                        </Col>
                      )}
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <h5
        onClick={() => toggleSection("fritti")}
        className="menu-toggle text-warning"
        style={{ cursor: "pointer" }}
      >
        Rosticceria{" "}
        {sectionsVisible.fritti ? <CaretDownFill /> : <CaretRightFill />}
      </h5>

      {sectionsVisible.fritti && (
        <div className="fritti-menu">
          {fritti.map((fritto) => (
            <Row key={fritto.id} className="fritto-row align-items-center mb-2">
              {editingFrittoId === fritto.id ? (
                <>
                  <Col xs={6} md={8}>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editingFrittoData.name}
                      onChange={handleEditFrittoChange}
                    />
                  </Col>
                  <Col xs={3} md={2}>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={editingFrittoData.price}
                      onChange={handleEditFrittoChange}
                    />
                  </Col>
                  <Col xs={3} md={2}>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={saveFritto}
                      className="me-1"
                    >
                      Salva
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingFrittoId(null)}
                    >
                      Annulla
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={6} md={8}>
                    {fritto.name}
                  </Col>
                  <Col xs={3} md={2} className="fritto-price">
                    €{fritto.price}
                  </Col>
                  <Col xs={3} md={2}>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => startEditFritto(fritto)}
                    >
                      Modifica
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          ))}
        </div>
      )}

      <h5
        onClick={() => toggleSection("bibite")}
        className="menu-toggle text-warning"
        style={{ cursor: "pointer" }}
      >
        Bibite {sectionsVisible.bibite ? <CaretDownFill /> : <CaretRightFill />}
      </h5>

      {sectionsVisible.bibite && (
        <div className="bibite-menu">
          {bibite.map((bibita) => (
            <Row key={bibita.id} className="bibita-row align-items-center mb-2">
              {editingBibitaId === bibita.id ? (
                <>
                  <Col xs={4} md={5}>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editingBibitaData.name}
                      onChange={handleEditBibitaChange}
                    />
                  </Col>
                  <Col xs={3} md={3}>
                    <Form.Control
                      type="text"
                      name="formato"
                      value={editingBibitaData.formato}
                      onChange={handleEditBibitaChange}
                    />
                  </Col>
                  <Col xs={2} md={2}>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={editingBibitaData.price}
                      onChange={handleEditBibitaChange}
                    />
                  </Col>
                  <Col xs={3} md={2}>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={saveBibita}
                      className="me-1"
                    >
                      Salva
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingBibitaId(null)}
                    >
                      Annulla
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={4} md={5}>
                    {bibita.name}
                  </Col>
                  <Col xs={3} md={3}>
                    {bibita.formato}
                  </Col>
                  <Col xs={2} md={2} className="bibita-price">
                    €{bibita.price}
                  </Col>
                  <Col xs={3} md={2}>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => startEditBibita(bibita)}
                    >
                      Modifica
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          ))}
        </div>
      )}

      <div className="coperto-text">Coperto 1€</div>
    </div>
  );
}

export default GestioneMenu;
