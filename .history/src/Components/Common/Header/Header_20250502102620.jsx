import { useState, useEffect, useRef } from "react";
import "./Header.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaSyringe } from "react-icons/fa";
import ecovitalogo from '../../../../'
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);




  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  2



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <a onClick={scrollToTop} className="logo">
          <img src="" alt="" />
        </a>
        <button className="products-button" onClick={scrollToProducts}>
          Məhsullar
          <span className="products-icon">
            <FaSyringe />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
