import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const loginRequest = { username, password };

    // RICHIESTA LOGIN
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
            if (parsedData.idUtente) {
              console.log("Dati ricevuti dal server:", parsedData);
              localStorage.setItem("idUtente", parsedData.idUtente);
            } else {
              console.error(
                "Errore: idUtente non trovato nei dati del server."
              );
            }
            setSuccessMessage("Login effettuato con successo!");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            setErrorMessage("Credenziali non valide!");
          }
        } catch (error) {
          console.error("Errore nel parsing della risposta:", error);
          setErrorMessage("Errore durante il parsing dei dati.");
        }
      })

      .catch(() => {
        setErrorMessage(`Credenziali non valide!`);
      });
  };

  return (
    <Container className="register-container">
      <h1 className="my-4 text-warning">Accedi</h1>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

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
