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
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Navbar
        expand="lg"
        className={`bg-warning ${showModal ? "hidden" : ""}`} // Aggiungi la classe "hidden" quando il modale è visibile
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand
            expand="lg"
            className="d-flex justify-content-center justify-content-lg-start custom-navbar-brand"
          >
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
              <Nav.Link
                as={Link}
                to="/"
                className="mx-2"
                onClick={() => setExpanded(false)}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/shop"
                className="mx-2"
                onClick={() => setExpanded(false)}
              >
                Ordina ora!
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/menù"
                className="mx-2"
                onClick={() => setExpanded(false)}
              >
                Menù
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleShow();
                  setExpanded(false);
                }}
                className="mx-2"
              >
                Prenota un tavolo
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/sudinoi"
                className="mx-2"
                onClick={() => setExpanded(false)}
              >
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
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="mx-2"
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
