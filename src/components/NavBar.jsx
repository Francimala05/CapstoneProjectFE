import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/LogoPizzaPazzaGiallo.jpg";
import { Link } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import "../assets/styles/NavBar.css";
import PrenotaTavolo from "./ModaleTavolo";

function NavBar() {
  const isLoggedIn = localStorage.getItem("authToken");
  // const userName = localStorage.getItem("userName");
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Navbar expand="lg" className="bg-warning">
        <Container>
          <Navbar.Brand
            expand="lg"
            className="d-flex justify-content-center justify-content-lg-start custom-navbar-brand"
          >
            <Link to="/">
              <img src={logo} alt="Logo" style={{ height: "90px" }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto custom-nav">
              <Nav.Link as={Link} to="/" className="mx-2">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/menù" className="mx-2">
                Ordina ora!
              </Nav.Link>
              <Nav.Link as={Link} to="/menù" className="mx-2">
                Menù
              </Nav.Link>
              <Nav.Link onClick={handleShow} className="mx-2">
                Prenota un tavolo
              </Nav.Link>
              <Nav.Link href="#" className="mx-2">
                Su di noi
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto mt-auto mx-2 me-lg-5">
              {isLoggedIn ? (
                <NavDropdown
                  title={<PersonCircle size={25} />}
                  id="nav-dropdown-profile"
                  className="text-center nav-dropdown-custom"
                >
                  {/*   <NavDropdown.Item className="text-center">
                  <strong>{userName}</strong>
                </NavDropdown.Item> */}
                  <NavDropdown.Item
                    as={Button}
                    className="text-center bg-danger custom-logout-button"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("userName");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="mx-2">
                  Accedi
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <PrenotaTavolo show={showModal} handleClose={handleClose} />
    </>
  );
}

export default NavBar;
