import Carousel from "react-bootstrap/Carousel";
import Carosello1 from "../assets/Carosello1.jpg";
import Carosello2 from "../assets/Carosello2.jpg";
import Carosello3 from "../assets/Carosello3.jpg";
function Carosello() {
  return (
    <Carousel style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Carousel.Item interval={1000}>
        <img
          className="d-block w-75 mx-auto"
          src={Carosello1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          className="d-block w-75 mx-auto"
          src={Carosello2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-75 mx-auto"
          src={Carosello3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Carosello;
