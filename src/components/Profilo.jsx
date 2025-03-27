import { useEffect, useState } from "react";
import "../assets/styles/Profilo.css";
import { CaretDownFill, CaretRightFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function Profilo() {
  const [userData, setUserData] = useState(null);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [ordiniAsporto, setOrdiniAsporto] = useState([]);
  const [ordiniDomicilio, setOrdiniDomicilio] = useState([]);
  const [error, setError] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isPrenotazioniVisible, setIsPrenotazioniVisible] = useState(true);
  const [isOrdiniVisible, setIsOrdiniVisible] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("authToken");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("authToken");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const userId = localStorage.getItem("idUtente");
    console.log("ID utente letto da localStorage:", userId);
    const username = localStorage.getItem("username");

    if (!username) {
      navigate("/login");
      return;
    }

    fetchUserData(username);
    fetchPrenotazioni(username);
    fetchOrdini(username);
  }, [navigate]);

  const fetchUserData = (username) => {
    fetch(`http://localhost:8085/utente/get/${username}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isLoggedIn}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nel recupero dei dati.");
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => setError(err.message));
  };

  const fetchPrenotazioni = (username) => {
    fetch(`http://localhost:8085/api/prenotazioni/utente/${username}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isLoggedIn}` },
    })
      .then((response) => {
        if (response.status === 404) {
          console.log("Nessuna prenotazione trovata per questo utente.");
          return [];
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPrenotazioni(data || []))
      .catch((err) => {
        console.error("Errore nel recupero prenotazioni:", err.message);
        setPrenotazioni([]);
      });
  };

  const fetchOrdini = () => {
    const userId = localStorage.getItem("idUtente");
    console.log("ID utente recuperato:", userId);
    if (!userId) {
      console.error("ID utente non disponibile");
      return;
    }

    console.log("Chiamata API per ordini con ID utente:", userId);

    // Fetch ordini asporto
    fetch(`http://localhost:8085/api/ordini/asporto/utente/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isLoggedIn}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Nessun ordine a asporto trovato per questo utente.");
            return []; // Restituisci un array vuoto se 404
          }
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setOrdiniAsporto(data))
      .catch((err) => {
        console.error("Errore nel recupero ordini asporto:", err.message);
        setOrdiniAsporto([]);
      });

    fetch(`http://localhost:8085/api/ordini/domicilio/utente/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isLoggedIn}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Nessun ordine a domicilio trovato per questo utente.");
            return [];
          }
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setOrdiniDomicilio(data))
      .catch((err) => {
        console.error("Errore nel recupero ordini domicilio:", err.message);
        setOrdiniDomicilio([]);
      });
  };
  const isPast = (item) => new Date(item.data + "T" + item.orario) < new Date();

  const sortByDate = (a, b) =>
    new Date(a.data + "T" + a.orario) - new Date(b.data + "T" + b.orario);

  const sortedPrenotazioni = prenotazioni.sort(sortByDate);
  const sortedOrdiniAsporto = ordiniAsporto.sort(sortByDate);
  const sortedOrdiniDomicilio = ordiniDomicilio.sort(sortByDate);

  const sortedOrdini = [...sortedOrdiniAsporto, ...sortedOrdiniDomicilio].sort(
    sortByDate
  );

  const futurePrenotazioni = sortedPrenotazioni.filter((p) => !isPast(p));
  const pastPrenotazioni = sortedPrenotazioni.filter((p) => isPast(p));

  const futureOrdini = sortedOrdini.filter((o) => !isPast(o));
  const pastOrdini = sortedOrdini.filter((o) => isPast(o));

  const toggleInfoSection = () => setIsInfoVisible((prev) => !prev);
  const togglePrenotazioniSection = () =>
    setIsPrenotazioniVisible((prev) => !prev);
  const toggleOrdiniSection = () => setIsOrdiniVisible((prev) => !prev);

  if (!isLoggedIn) {
    return <p style={{ color: "yellow" }}>Informazioni non disponibili</p>;
  }

  if (error) {
    return <p style={{ color: "yellow" }}>{error}</p>;
  }

  return (
    <div>
      <h1 className="text-warning profilo-title">
        {userData ? (
          `Bentornato/a sul tuo profilo, ${userData.nome}!`
        ) : (
          <Spinner variant="warning" />
        )}
      </h1>
      {userData ? (
        <div className="profilo-container">
          <h2
            onClick={toggleInfoSection}
            className="profilo-toggle title-section text-warning"
          >
            {isInfoVisible
              ? "Le tue informazioni personali"
              : "Le tue informazioni personali"}{" "}
            {isInfoVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isInfoVisible && (
            <div className="personal-info">
              <h5>
                <span> Nome:</span> {userData.nome} <br />
                <span> Cognome: </span>
                {userData.cognome} <br />
                <span> Username: </span>
                {userData.username} <br />
                <span> Email:</span> {userData.email} <br />
                <span> Password:</span> *******
              </h5>
            </div>
          )}

          <h2
            onClick={togglePrenotazioniSection}
            className="profilo-toggle title-section text-warning"
          >
            {isPrenotazioniVisible
              ? "Le tue prenotazioni"
              : "Le tue prenotazioni"}{" "}
            {isPrenotazioniVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isPrenotazioniVisible && (
            <div className="prenotazioni-info">
              <h3>Prenotazioni future:</h3>
              {futurePrenotazioni.length > 0 ? (
                <div>
                  {futurePrenotazioni.map((prenotazione) => (
                    <div
                      key={prenotazione.idPrenotazione}
                      className="prenotazione-futura"
                    >
                      <p>Data: {prenotazione.data}</p>
                      <p>Orario: {prenotazione.orario}</p>
                      <p>Numero Persone: {prenotazione.numeroPersone}</p>
                      <p>
                        Preferenze:{" "}
                        {prenotazione.altrePreferenze || "Nessuna preferenza"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Non hai prenotazioni future.</p>
              )}

              <h3>Prenotazioni passate:</h3>
              {pastPrenotazioni.length > 0 ? (
                <div>
                  {pastPrenotazioni.map((prenotazione) => (
                    <div
                      key={prenotazione.idPrenotazione}
                      className="prenotazione-passata"
                    >
                      <p>Data: {prenotazione.data}</p>
                      <p>Orario: {prenotazione.orario}</p>
                      <p>Numero Persone: {prenotazione.numeroPersone}</p>
                      <p>
                        Preferenze:{" "}
                        {prenotazione.altrePreferenze || "Nessuna preferenza"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Non hai prenotazioni passate.</p>
              )}
            </div>
          )}

          <h2
            onClick={toggleOrdiniSection}
            className="profilo-toggle title-section text-warning"
          >
            {isOrdiniVisible ? "I tuoi ordini" : "I tuoi ordini"}{" "}
            {isOrdiniVisible ? <CaretDownFill /> : <CaretRightFill />}
          </h2>

          {isOrdiniVisible && (
            <div className="ordini-info">
              <h3>Ordini futuri:</h3>
              {futureOrdini.length > 0 ? (
                <div>
                  {futureOrdini.map((ordine) => (
                    <div key={ordine.idOrdine} className="ordine-futuro">
                      <p>Data: {ordine.data}</p>
                      <p>Orario: {ordine.orario}</p>
                      <p>Esigenze Particolari: {ordine.esigenzeParticolari}</p>
                      <p>Conto: {ordine.conto}€</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Non hai ordini futuri.</p>
              )}

              <h3>Ordini passati:</h3>
              {pastOrdini.length > 0 ? (
                <div>
                  {pastOrdini.map((ordine) => (
                    <div key={ordine.idOrdine} className="ordine-passato">
                      <p>Data: {ordine.data}</p>
                      <p>Orario: {ordine.orario}</p>
                      <p>Esigenze Particolari: {ordine.esigenzeParticolari}</p>
                      <p>Conto: {ordine.conto}€</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Non hai ordini passati.</p>
              )}
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
