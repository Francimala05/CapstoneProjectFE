import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Per navigare dopo il login

  const handleLogin = (e) => {
    e.preventDefault();

    const loginRequest = { username, password };

    // Iniziamo la richiesta di login
    fetch("http://localhost:8085/utente/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((response) => {
        // Controlliamo se la risposta è valida
        if (!response.ok) {
          throw new Error(
            `Errore HTTP: ${response.status} ${response.statusText}`
          );
        }
        return response.text(); // Converto la risposta in testo (JWT)
      })
      .then((data) => {
        // Visualizziamo la risposta per capire cosa contiene
        console.log("Dati ricevuti dal server:", data);

        if (data) {
          // Memorizza il token nel localStorage
          localStorage.setItem("authToken", data);
          alert("Login effettuato con successo!");
          navigate("/"); // Torna alla home page dopo il login
        } else {
          alert("Credenziali non valide!");
        }
      })
      .catch((error) => {
        console.error("Errore durante il login:", error);
        alert(`Errore durante il login: ${error.message}`);
      });
  };

  return (
    <Container className="register-container">
      <h1 className="my-4 text-warning">Accedi</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <Button variant="success" type="submit" className="submit-button mt-4">
          Continua
        </Button>
      </Form>
      <p className="mt-5 text-warning">
        <Link as={Link} to="/register" className="link-text">
          Sei nuovo? Registrati qui!
        </Link>
      </p>
    </Container>
  );
}

export default Login;
