import React from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Registrazione";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  const showNavBar =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/menù" element={<Menu />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
