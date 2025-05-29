import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from "date-fns/locale/it";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

registerLocale("it", it);

function PrenotaTavolo({ show, handleClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    giorno: "",
    orario: "",
    numeroPersone: "",
    preferenze: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      giorno: date,
    }));
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

  const formatDateLocal = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handlePrenotazione = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setAlertMessage("Per prenotare è necessario il Login!");
      setAlertVariant("warning");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    const username = getUsernameFromToken();
    if (!username) {
      setAlertMessage("Errore: Username non trovato.");
      setAlertVariant("danger");
      return;
    }

    const { giorno, orario, numeroPersone, preferenze } = formData;

    const dataPrenotazione = new Date(giorno);
    if (isNaN(dataPrenotazione)) {
      setAlertMessage("La data selezionata non è valida.");
      setAlertVariant("danger");
      return;
    }

    if (dataPrenotazione.getDay() === 2) {
      setAlertMessage("Il martedì è la giornata di chiusura.");
      setAlertVariant("danger");
      return;
    }

    const [ore, minuti] = orario.split(":").map(Number);
    if (ore < 16 || (ore === 23 && minuti > 59)) {
      setAlertMessage("L'orario selezionato non è disponibile.");
      setAlertVariant("danger");
      return;
    }

    const dataPrenotazioneDTO = {
      username: username,
      data: formatDateLocal(dataPrenotazione),
      orario: orario,
      numeroPersone: parseInt(numeroPersone, 10),
      altrePreferenze: preferenze || "",
    };

    fetch("http://localhost:8085/api/prenotazioni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(dataPrenotazioneDTO),
    })
      .then((response) => response.text())
      .then((text) => {
        if (text === "Prenotazione non disponibile o dati errati.") {
          setAlertMessage("La capienza massima della sala è stata raggiunta");
          setAlertVariant("danger");
        } else if (text === "Prenotazione confermata!") {
          setAlertMessage("Prenotazione completata con successo!");
          setAlertVariant("success");

          setTimeout(() => {
            setAlertMessage("");
            setFormData({
              giorno: "",
              orario: "",
              numeroPersone: "",
              preferenze: "",
            });
            handleClose();
          }, 1000);
        } else if (text === "Disponibilità dei posti esaurita.") {
          setAlertMessage("Numero di posti disponibili esauriti.");
          setAlertVariant("danger");
        } else {
          try {
            const data = JSON.parse(text);
            if (data.success) {
              setAlertMessage("Prenotazione completata con successo!");
              setAlertVariant("success");
              setFormData({
                giorno: "",
                orario: "",
                numeroPersone: "",
                preferenze: "",
              });
              handleClose();
            } else {
              setAlertMessage(data.message || "Errore nella prenotazione");
              setAlertVariant("danger");
            }
          } catch (error) {
            console.error("Errore nel parsing JSON:", error);
            setAlertMessage(`Errore durante la prenotazione: ${text}`);
            setAlertVariant("danger");
          }
        }
      })
      .catch((error) => {
        setAlertMessage(`Errore durante la prenotazione: ${error.message}`);
        setAlertVariant("danger");
      });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Prenota ora un tavolo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePrenotazione}>
            <div className="text-center w-100">
              <Form.Group className="mb-3" controlId="formGiorno">
                <DatePicker
                  selected={formData.giorno}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control custom-datepicker"
                  calendarClassName="custom-calendar"
                  inline
                  locale={it}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formOrario">
                <Form.Label>Orario</Form.Label>
                <Form.Control
                  type="time"
                  name="orario"
                  value={formData.orario}
                  onChange={handleChange}
                  min="00:00"
                  max="23:59"
                  className="form-control text-center mx-auto w-auto"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNumeroPersone">
                <Form.Label>Numero di persone</Form.Label>
                <Form.Control
                  type="number"
                  name="numeroPersone"
                  value={formData.numeroPersone}
                  onChange={handleChange}
                  min="1"
                  className="form-control text-center mx-auto w-25"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPreferenze">
                <Form.Label>Hai altre preferenze?</Form.Label>
                <Form.Control
                  as="textarea"
                  name="preferenze"
                  value={formData.preferenze}
                  onChange={handleChange}
                  rows={1}
                />
              </Form.Group>
            </div>
            {alertMessage && (
              <Alert variant={alertVariant} className="mt-3 text-center">
                {alertMessage}
              </Alert>
            )}

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Chiudi
              </Button>
              <Button variant="primary" type="submit">
                Prenota
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrenotaTavolo;
