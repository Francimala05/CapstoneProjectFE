import Carousel from "react-bootstrap/Carousel";
import Carosello1 from "../assets/Carosello1.jpg";
import Carosello2 from "../assets/Carosello2.jpg";
import Carosello3 from "../assets/Carosello3.jpg";
function Carosello() {
  return (
    <Carousel style={{ width: "80%", margin: "0 auto" }}>
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
          className="d-block w-100"
          src={Carosello3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Carosello;
