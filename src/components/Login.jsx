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
        if (!response.ok) {
          throw new Error(
            `Errore HTTP: ${response.status} ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((data) => {
        try {
          const parsedData = JSON.parse(data);
          console.log("Dati ricevuti dal server:", parsedData);
          if (parsedData && parsedData.token) {
            localStorage.setItem("authToken", parsedData.token);

            if (parsedData.username) {
              localStorage.setItem("username", parsedData.username);
            } else {
              console.error(
                "Errore: username non trovato nei dati del server."
              );
            }
            alert("Login effettuato con successo!");
            navigate("/");
          } else {
            alert("Credenziali non valide!");
          }
        } catch (error) {
          console.error("Errore nel parsing della risposta:", error);
          alert("Errore durante il parsing dei dati.");
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
