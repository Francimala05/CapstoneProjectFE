import React from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Registrazione";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Sudinoi from "./components/Sudinoi";
import Shop from "./components/Shop";
import Carrello from "./components/CarrelloPage";
import SuccessOrder from "./components/SuccessOrder";
import Profilo from "./components/Profilo";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import Ordini from "./components/Ordini";
import Prenotazioni from "./components/Prenotazioni";
import GestioneMenu from "./components/GestioneMenu";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  const showNavBar =
    location.pathname !== "/login" && location.pathname !== "/register";

  const showFooter =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showNavBar && <NavBar />}

      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        {/*UTENTE*/}
        <Route path="/shop" element={<Shop />} />
        <Route path="/menù" element={<Menu />} />
        <Route path="/sudinoi" element={<Sudinoi />} />
        <Route path="/carrello" element={<Carrello />} />
        <Route path="/successorder" element={<SuccessOrder />} />
        <Route path="/profilo" element={<Profilo />} />
        {/*PROPRIETARIO*/}
        <Route
          path="/ordini"
          element={
            <ProtectedRoute requiredRole="PROPRIETARIO">
              <Ordini />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prenotazioni"
          element={
            <ProtectedRoute requiredRole="PROPRIETARIO">
              <Prenotazioni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestione-menu"
          element={
            <ProtectedRoute requiredRole="PROPRIETARIO">
              <GestioneMenu />
            </ProtectedRoute>
          }
        />
      </Routes>
      <BackToTop />
      {showFooter && <Footer />}
    </>
  );
}

export default App;
