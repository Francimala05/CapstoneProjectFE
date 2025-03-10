import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Per navigare dopo il login

  const handleLogin = (e) => {
    e.preventDefault();

    const loginRequest = { username, password };

    fetch("http://localhost:8080/utente/login", {
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
      <h2 className="my-4 text-center">Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Accedi
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
