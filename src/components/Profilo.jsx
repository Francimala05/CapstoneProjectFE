import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Profilo.css";
import { CaretDownFill, CaretRightFill } from "react-bootstrap-icons";

function Profilo() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isPrenotazioniVisible, setIsPrenotazioniVisible] = useState(true);
  const [isOrdiniVisible, setIsOrdiniVisible] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("authToken");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const username = localStorage.getItem("username");

      fetch(`http://localhost:8085/utente/get/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${isLoggedIn}`,
        },
      })
        .then((response) => {
          if (response.status === 404) {
            throw new Error("Utente non trovato.");
          }
          if (!response.ok) {
            throw new Error("Errore nel recupero dei dati.");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [isLoggedIn, navigate]);
  const toggleInfoSection = () => {
    setIsInfoVisible((prevState) => !prevState);
  };

  const togglePrenotazioniSection = () => {
    setIsPrenotazioniVisible((prevState) => !prevState);
  };

  const toggleOrdiniSection = () => {
    setIsOrdiniVisible((prevState) => !prevState);
  };

  if (!isLoggedIn) {
    return <p style={{ color: "yellow" }}>Informazioni non disponibili</p>;
  }

  if (error) {
    return <p style={{ color: "yellow" }}>{error}</p>;
  }

  return (
    <div>
      <h1 className="text-warning profilo-title">
        Bentornato sul tuo profilo, {userData.nome}!
      </h1>
      {userData ? (
        <div className="profilo-container">
          <h2
            onClick={toggleInfoSection}
            className="profilo-toggle text-warning"
          >
            {isInfoVisible
              ? "Le tue informazioni personali"
              : "Le tue informazioni personali"}{" "}
            {isInfoVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isInfoVisible && (
            <div className="personal-info">
              <h5>
                Nome: {userData.nome} <br />
                Cognome: {userData.cognome} <br />
                Username: {userData.username} <br />
                Email: {userData.email} <br />
                Password: ***** <br />
              </h5>
            </div>
          )}

          <h2
            onClick={togglePrenotazioniSection}
            className="profilo-toggle text-warning"
          >
            {isPrenotazioniVisible
              ? "Le tue prenotazioni"
              : "Le tue prenotazioni"}{" "}
            {isPrenotazioniVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isPrenotazioniVisible && (
            <div className="prenotazioni-info">
              <h5>Visualizza le tue prenotazioni qui.</h5>
            </div>
          )}

          <h2
            onClick={toggleOrdiniSection}
            className="profilo-toggle text-warning"
          >
            {isOrdiniVisible ? "I tuoi ordini" : "I tuoi ordini"}{" "}
            {isOrdiniVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isOrdiniVisible && (
            <div className="ordini-info">
              <h5>Visualizza i tuoi ordini qui.</h5>
            </div>
          )}
        </div>
      ) : (
        <p>Caricamento informazioni...</p>
      )}
    </div>
  );
}

export default Profilo;
