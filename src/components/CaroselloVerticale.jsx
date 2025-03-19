import Carousel from "react-bootstrap/Carousel";
import Carosello1 from "../assets/Carosello1.jpg";
import Carosello2 from "../assets/Carosello2.jpg";
import Carosello3 from "../assets/Carosello3.jpg";
import { useState } from "react";
import "../assets/styles/Aside.css";

const messages = [
  "la pizza 'Vulcano'",
  "la pizza 'Napoletana'",
  "la pizza 'Al pistacchio'",
];

function Carosello({ setDynamicText }) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);

    setDynamicText(messages[selectedIndex]);
  };
  return (
    <>
      <Carousel
        style={{ width: "100%", margin: "0 auto" }}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item>
          <img
            style={{
              height: "500px",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
            className="d-block w-100"
            src={Carosello1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{
              height: "500px",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
            className="d-block w-100"
            src={Carosello2}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{
              height: "500px",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
            className="d-block w-100 img-3"
            src={Carosello3}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default Carosello;
