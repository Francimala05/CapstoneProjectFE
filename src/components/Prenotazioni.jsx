import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/styles/Ordini.css";

function Prenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPrenotazioni = async () => {
      try {
        const res = await fetch("http://localhost:8085/api/prenotazioni", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Errore nel caricamento delle prenotazioni.");
        }

        const data = await res.json();
        console.log("Prenotazioni:", data);
        setPrenotazioni(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrenotazioni();
  }, [token]);

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isPast = (prenotazione) =>
    new Date(prenotazione.data + "T" + prenotazione.orario) < new Date();

  const prenotazioniFiltrate = prenotazioni
    .filter((p) => isSameDay(new Date(p.data), selectedDate))
    .sort(
      (a, b) =>
        new Date(a.data + "T" + a.orario) - new Date(b.data + "T" + b.orario)
    );

  return (
    <div className="profilo-container">
      <h1 className="profilo-title">Gestione Prenotazioni Ricevute</h1>

      <div className="calendar-orders-container">
        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale="it-IT"
          />
        </div>

        <div className="ordini-info">
          {loading ? (
            <p>Caricamento prenotazioni...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : prenotazioniFiltrate.length === 0 ? (
            <p>Nessuna prenotazione per questa data.</p>
          ) : (
            prenotazioniFiltrate.map((p) => (
              <div
                key={p.idPrenotazione}
                className={isPast(p) ? "ordine-passato" : "ordine-futuro"}
              >
                <h4>{p.orario}</h4>

                <p>
                  <strong>Cliente:</strong> {p.utente?.cognome || "N/A"}{" "}
                  {p.utente?.nome || ""}
                </p>

                <p>
                  <strong>Numero persone:</strong> {p.numeroPersone}
                </p>

                {p.altrePreferenze && (
                  <p>
                    <strong>Note:</strong> {p.altrePreferenze}
                  </p>
                )}

                <hr className="order-separator" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Prenotazioni;
