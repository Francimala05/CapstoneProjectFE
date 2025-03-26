import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

function Register() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Per navigare dopo la registrazione

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !nome ||
      !cognome ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Tutti i campi sono obbligatori!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Le password non corrispondono!");
      return;
    }

    const newUser = { nome, cognome, username, email, password };

    fetch("http://localhost:8085/utente/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        console.log("Risposta dal server:", response);

        if (!response.ok) {
          return response.json().then((errorData) => {
            if (errorData.error === "Username già esistente") {
              setErrorMessage("Username già in uso.");
            } else if (errorData.error === "Email già in uso") {
              setErrorMessage("Email già in uso.");
            } else {
              setErrorMessage(
                `Errore durante la registrazione: ${errorData.message}`
              );
            }
          });
        }
        return response.text();
      })
      .then((data) => {
        try {
          const parsedData = JSON.parse(data);
          console.log("Dati ricevuti dal server:", parsedData);

          if (parsedData.message && parsedData.idUtente) {
            console.log(
              `L'utente ${parsedData.username} è stato registrato correttamente.`
            );
            console.log(`ID utente: ${parsedData.idUtente}`);
            console.log(`Messaggio: ${parsedData.message}`);

            localStorage.setItem("authToken", parsedData.token);
            localStorage.setItem("username", parsedData.username);
            localStorage.setItem("idUtente", parsedData.idUtente);
            localStorage.setItem("userData", JSON.stringify(parsedData));

            setSuccessMessage("Registrazione completata con successo!");

            setNome("");
            setCognome("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
              navigate("/");
            }, 500);
          } else {
            setErrorMessage("Errore nella registrazione: Dati mancanti.");
          }
        } catch (error) {
          console.error("Errore nel parsing della risposta:", error);
          setErrorMessage("Errore durante il parsing dei dati.");
        }
      })
      .catch((error) => {
        console.error("Errore durante la registrazione:", error);
        setErrorMessage(`Username o Email già utilizzata`);
      });
  };

  return (
    <Container className="register-container">
      <h1 className="my-4 text-center text-warning">Registrati</h1>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

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

        <Button variant="success" type="submit" className="mt-4 submit-button">
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
