import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from "date-fns/locale/it";
registerLocale("it", it);

function PrenotaTavolo({ show, handleClose }) {
  const [formData, setFormData] = useState({
    email: "",
    giorno: "",
    orario: "",
    numeroPersone: "",
    preferenze: "",
  });

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

  return (
    <>
      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Prenota ora un tavolo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGiorno">
              <DatePicker
                selected={formData.giorno}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
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
                placeholder="Inserisci il numero di persone"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPreferenze">
              <Form.Label>Hai altre preferenze?</Form.Label>
              <Form.Control
                as="textarea"
                name="preferenze"
                value={formData.preferenze}
                onChange={handleChange}
                rows={3}
                placeholder="Inserisci eventuali preferenze"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Prenota
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PrenotaTavolo;
