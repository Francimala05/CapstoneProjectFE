import React from "react";

import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoPizzaPazzaGiallo.jpg";

function Register() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Per navigare dopo la registrazione

  const handleRegister = (e) => {
    e.preventDefault();

    // Controllo che la password e la conferma siano uguali
    if (password !== confirmPassword) {
      alert("Le password non corrispondono!");
      return;
    }

    // Creazione dell'oggetto utente da inviare al back-end
    const newUser = { nome, cognome, username, email, password };

    // Invio della richiesta al back-end per la registrazione
    fetch("http://localhost:8085/utente/insert", {
      // URL del tuo back-end per la registrazione
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "Utente registrato con successo") {
          alert("Registrazione completata con successo!");
          navigate("/login"); // Reindirizza alla pagina di login dopo la registrazione
        } else {
          alert(data); // Mostra l'errore ricevuto dal back-end
        }
      })
      .catch((error) => {
        console.error("Errore:", error);
        alert("Errore durante la registrazione");
      });
  };

  return (
    <Container>
      <img src={logo} alt="Logo" style={{ height: "250px" }} />
      <h1 className="my-4 text-center text-warning">Registrati</h1>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formNome">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Form.Group controlId="formCognome">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Control
            type="password"
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Conferma la tua password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-4"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-4">
          Continua
        </Button>
      </Form>
    </Container>
  );
}
export default Register;
