import { useState, useEffect } from "react";
import "../assets/styles/Profilo.css";

function Profilo() {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/utente");
        const userJson = await userResponse.json();
        setUserData(userJson);

        const bookingsResponse = await fetch("/api/user/bookings");
        const bookingsJson = await bookingsResponse.json();
        setBookings(bookingsJson);

        const ordersResponse = await fetch("/api/user/orders");
        const ordersJson = await ordersResponse.json();
        setOrders(ordersJson);
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profilo-container">
      <h1>
        Bentornato sul tuo profilo, {userData?.nome} {userData?.cognome}
      </h1>

      <h2 className="profilo-title">Le tue informazioni personali</h2>
      <div className="personal-info">
        {userData ? (
          <h5>
            Nome: {userData.nome} <br />
            Cognome: {userData.cognome} <br />
            Username: {userData.username} <br />
            Email: {userData.email} <br />
            Password: ***** <br />
            <button>Cambia password</button>
          </h5>
        ) : (
          <p>Caricamento informazioni...</p>
        )}
      </div>

      <h2 className="profilo-title">Le tue prenotazioni</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id}>
            <h5>{booking.data}</h5>
            <p>{booking.dettagli}</p>
          </div>
        ))
      ) : (
        <p>Non hai prenotazioni.</p>
      )}

      <h2 className="profilo-title">I tuoi ordini</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id}>
            <h5>Data Ordine: {order.data}</h5>
            <ul>
              {order.prodotti.map((product, index) => (
                <li key={index}>
                  {product.nome} - {product.quantità} x €{product.prezzo}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Non hai ordini.</p>
      )}
    </div>
  );
}

export default Profilo;
