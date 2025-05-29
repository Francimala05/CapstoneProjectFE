import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/images/LogoPizzaPazzaGiallo.jpg";
import { Link } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import "../assets/styles/NavBar.css";
import PrenotaTavolo from "./ModaleTavolo";

function NavBar() {
  const isLoggedIn = localStorage.getItem("authToken");
  const ruolo = localStorage.getItem("ruolo");
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("idUtente");
    localStorage.removeItem("ruolo");
    window.location.reload();
  };
  return (
    <>
      <Navbar
        expand="lg"
        className={`bg-warning ${showModal ? "hidden" : ""}`}
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand className="d-flex justify-content-center justify-content-lg-start custom-navbar-brand">
            <Link to="/" onClick={() => setExpanded(false)}>
              <img src={logo} alt="Logo" style={{ height: "90px" }} />
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto custom-nav">
              {ruolo === "PROPRIETARIO" ? (
                <>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/"
                    onClick={() => setExpanded(false)}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/ordini"
                    onClick={() => setExpanded(false)}
                  >
                    Ordini
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/prenotazioni"
                    onClick={() => setExpanded(false)}
                  >
                    Prenotazioni
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/gestione-menu"
                    onClick={() => setExpanded(false)}
                  >
                    Gestione Menù
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/"
                    onClick={() => setExpanded(false)}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/shop"
                    onClick={() => setExpanded(false)}
                  >
                    Ordina ora!
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/menù"
                    onClick={() => setExpanded(false)}
                  >
                    Menù
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    onClick={() => {
                      handleShow();
                      setExpanded(false);
                    }}
                  >
                    Prenota un tavolo
                  </Nav.Link>
                  <Nav.Link
                    className="me-3"
                    as={Link}
                    to="/sudinoi"
                    onClick={() => setExpanded(false)}
                  >
                    Su di noi
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="ms-auto mt-auto mx-2 me-lg-5">
              {isLoggedIn ? (
                <NavDropdown
                  title={<PersonCircle size={25} />}
                  id="nav-dropdown-profile"
                  className="text-center nav-dropdown-custom"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/profilo"
                    className="text-center bg-success custom-profile-button mb-1"
                    onClick={() => setExpanded(false)}
                  >
                    Il mio profilo
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Button}
                    className="text-center bg-danger custom-logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
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
