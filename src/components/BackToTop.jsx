import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../assets/styles/BackToTop.css";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isShopPage = location.pathname === "/shop";

  return (
    visible && (
      <button
        className={`back-to-top ${
          isShopPage ? "shop-position" : "default-position"
        }`}
        onClick={scrollToTop}
        aria-label="Torna su"
      >
        <FaArrowUp size={20} color="white" />
      </button>
    )
  );
}

export default BackToTop;
