import React from "react";
import { Container } from "react-bootstrap";
import "../assets/styles/HomePage.css";
import PanuozzoSpeciale from "../assets/PanuozzoSpeciale.jpg";

function HomePage() {
  return (
    <>
      <div className="home-page">
        <Container className="content-container">
          <div className="text-section order-1 order-md-0">
            <h1 className="text-warning  title">Lasciati ispirare.</h1>
            <h1 className="text-warning  title">Scopri ora il nostro Menù.</h1>
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
      <div className="aside"></div>
    </>
  );
}

export default HomePage;
