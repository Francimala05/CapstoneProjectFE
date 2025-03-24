import React from "react";

import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        console.log("Risposta dal server:", response);
        // Se la risposta non è ok, mostra un errore
        if (!response.ok) {
          throw new Error(
            `Errore HTTP: ${response.status} ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((data) => {
        console.log("Dati ricevuti dal server:", data);
        if (data.includes("è stato inserito correttamente nel sistema")) {
          localStorage.setItem("authToken", data);
          alert("Registrazione completata con successo!");
          setNome("");
          setCognome("");
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigate("/");
        } else {
          alert(data);
        }
      })
      .catch((error) => {
        console.error("Errore durante la registrazione:", error);
        alert(`Errore durante la registrazione: ${error.message}`);
      });
  };

  return (
    <Container className="register-container">
      <h1 className="my-4 text-center text-warning">Registrati</h1>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formNome">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Form.Group controlId="formCognome">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Control
            type="password"
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Conferma la tua password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-4 input-field"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-4  submit-button">
          Continua
        </Button>
      </Form>
      <p className="mt-5 text-warning">
        <Link as={Link} to="/login" className="link-text">
          Sei già registrato? Accedi qui!
        </Link>
      </p>
    </Container>
  );
}
export default Register;
