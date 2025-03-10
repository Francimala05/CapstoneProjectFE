import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/LogoPizzaPazzaGiallo.jpg";

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-warning">
      <Container>
        <Navbar.Brand
          expand="lg"
          className="d-flex justify-content-center justify-content-lg-start custom-navbar-brand"
        >
          <img src={logo} alt="Logo" style={{ height: "90px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto custom-nav">
            <Nav.Link href="#" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link href="#" className="mx-2">
              Menù
            </Nav.Link>

            <NavDropdown
              title="Prenota"
              id="nav-dropdown"
              className="mx-2 bg-warning custom-dropdown"
            >
              <NavDropdown.Item href="#" className=" bg-warning text-center">
                Tavolo
              </NavDropdown.Item>
              <NavDropdown.Item href="#" className="bg-warning text-center">
                Asporto
              </NavDropdown.Item>
              <NavDropdown.Item href="#" className="bg-warning text-center">
                Domicilio
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" className="mx-2">
              Dicono di noi
            </Nav.Link>
            <Nav.Link href="#" className="mx-2">
              Contatti
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
