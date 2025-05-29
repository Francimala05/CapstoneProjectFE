import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/styles/Ordini.css";

function Ordini() {
  const [ordiniAsporto, setOrdiniAsporto] = useState([]);
  const [ordiniDomicilio, setOrdiniDomicilio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrdini = async () => {
      try {
        const [asportoRes, domicilioRes] = await Promise.all([
          fetch("http://localhost:8085/api/ordini/asporto", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8085/api/ordini/domicilio", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!asportoRes.ok || !domicilioRes.ok) {
          throw new Error("Errore nel caricamento degli ordini.");
        }

        const asportoData = await asportoRes.json();
        const domicilioData = await domicilioRes.json();

        console.log(" Ordini Asporto:", asportoData);
        console.log(" Ordini Domicilio:", domicilioData);

        setOrdiniAsporto(asportoData || []);
        setOrdiniDomicilio(domicilioData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdini();
  }, [token]);

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isPast = (ordine) =>
    new Date(ordine.data + "T" + ordine.orario) < new Date();

  const sortByDate = (a, b) =>
    new Date(a.data + "T" + a.orario) - new Date(b.data + "T" + b.orario);

  const allOrdini = [...ordiniAsporto, ...ordiniDomicilio]
    .filter((ordine) => {
      const ordineDate = new Date(ordine.data);
      return isSameDay(ordineDate, selectedDate);
    })
    .sort(sortByDate);

  return (
    <div className="profilo-container">
      <h1 className="profilo-title">Gestione Ordini Ricevuti</h1>

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
            <p>Caricamento Ordini...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : allOrdini.length === 0 ? (
            <p>Nessun ordine per questa data.</p>
          ) : (
            allOrdini.map((ordine) => (
              <div
                key={ordine.idOrdine}
                className={isPast(ordine) ? "ordine-passato" : "ordine-futuro"}
              >
                <h4>{ordine.orario}</h4>
                <div className="ordine-type">
                  {ordine.indirizzo ? "Domicilio" : "Asporto"}
                </div>

                <p>
                  <strong>Cliente:</strong> {ordine.utente?.cognome || "N/A"}{" "}
                  {ordine.utente?.nome || "N/A"}
                </p>

                {ordine.pizze?.length > 0 && (
                  <>
                    <p className="section-title">Pizze</p>
                    {ordine.pizze.map((p, i) => (
                      <p key={i}>
                        {p.name} - {p.formato || "n.d."} - {p.price}€
                      </p>
                    ))}
                  </>
                )}

                {ordine.panuozzi?.length > 0 && (
                  <>
                    <p className="section-title">Panuozzi</p>
                    {ordine.panuozzi.map((p, i) => (
                      <p key={i}>
                        {p.name} - {p.formato || "n.d."} - {p.price}€
                      </p>
                    ))}
                  </>
                )}

                {ordine.fritti?.length > 0 && (
                  <>
                    <p className="section-title">Fritti</p>
                    {ordine.fritti.map((f, i) => (
                      <p key={i}>
                        {f.name} - {f.price}€
                      </p>
                    ))}
                  </>
                )}

                {ordine.bibite?.length > 0 && (
                  <>
                    <p className="section-title">Bibite</p>
                    {ordine.bibite.map((b, i) => (
                      <p key={i}>
                        {b.name} - {b.formato || "n.d."} - {b.price}€
                      </p>
                    ))}
                  </>
                )}

                {ordine.esigenzeParticolari && (
                  <>
                    <hr className="order-separator" />
                    <p>
                      <strong>Note:</strong> {ordine.esigenzeParticolari}
                    </p>
                  </>
                )}

                {ordine.indirizzo && (
                  <p>
                    <strong>Indirizzo:</strong> {ordine.indirizzo}
                  </p>
                )}
                {ordine.telefono && (
                  <p>
                    <strong>Telefono:</strong> {ordine.telefono}
                  </p>
                )}

                <hr className="order-separator" />
                <p>
                  <strong>Totale:</strong> {ordine.conto}€
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Ordini;
