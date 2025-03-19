import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "../assets/styles/HomePage.css";
import PanuozzoSpeciale from "../assets/PanuozzoSpeciale.jpg";
import Carosello from "./CaroselloVerticale";
import "../assets/styles/Aside.css";
import { Link } from "react-router-dom";

function HomePage() {
  const [dynamicText, setDynamicText] = useState("la pizza 'Vulcano'");

  return (
    <>
      <div className="home-page">
        <Container className="content-container">
          <div className="text-section order-1 order-md-0">
            <h4 className="text-warning">
              Dal panuozzo alla pizza, il gusto è sempre una questione di
            </h4>
            <h1 className="text-warning">dettagli.</h1>
          </div>
          <div className="image-section order-0 order-md-1">
            <img
              src={PanuozzoSpeciale}
              alt="PanuozzoSpeciale"
              className="animated-image"
            />
          </div>
        </Container>
      </div>

      <div className="aside">
        <div className="aside-sx">
          <Carosello setDynamicText={setDynamicText} />
        </div>
        <div className="aside-dx text-warning">
          <h2>
            <Link to="/menù" style={{ textDecoration: "none" }}>
              Scopri <b>ora</b> il nostro menù!
            </Link>
          </h2>
          <p id="carousel-text">Assaggia {dynamicText}</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
