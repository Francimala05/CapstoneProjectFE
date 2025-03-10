import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    fetch("http://localhost:8080/utente/insert", {
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
      <h2 className="my-4 text-center">Registrazione</h2>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Conferma Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Conferma la tua password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Registrati
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
