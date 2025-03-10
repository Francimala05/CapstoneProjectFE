import React from "react";
import { useState } from "react";
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

    fetch("http://localhost:8085/utente/login", {
      // URL del tuo back-end per il login
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Memorizza il token nel localStorage
          localStorage.setItem("authToken", data.token);
          alert("Login effettuato con successo!");
          navigate("/"); // Reindirizza alla home page dopo il login
        } else {
          alert("Credenziali non valide!");
        }
      })
      .catch((error) => {
        console.error("Errore:", error);
        alert("Errore durante il login");
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
