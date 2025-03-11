import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LogoPizzaPazzaGiallo.jpg";

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
          // Memorizziamo il token nel localStorage
          localStorage.setItem("authToken", data);
          alert("Login effettuato con successo!");
          navigate("/"); // Reindirizza alla home page dopo il login
        } else {
          alert("Credenziali non valide!");
        }
      })
      .catch((error) => {
        // Gestiamo gli errori
        console.error("Errore durante il login:", error);
        alert(`Errore durante il login: ${error.message}`);
      });
  };

  return (
    <Container>
      <img src={logo} alt="Logo" style={{ height: "250px" }} />
      <h1 className="my-4 text-warning">Accedi</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <Button variant="success" type="submit" className="mt-4">
          Continua
        </Button>
      </Form>
      <p className="mt-5 text-warning">
        Sei nuovo?{" "}
        <Link as={Link} to="/register" href="">
          Registrati qui!
        </Link>
      </p>
    </Container>
  );
}

export default Login;
