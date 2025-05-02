import { useState, useEffect, useRef } from "react";
import "./Header.scss";
import { motion, AnimatePresence } from "framer-motion";
import { FaSyringe, FaChevronDown } from "react-icons/fa";
import EcovitaLogo from '../../../../public/assets/Fotolar/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Scroll to the section's top to ensure the title is visible
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsDropdownOpen(false);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <a onClick={scrollToTop} className="logo">
          <img src={EcovitaLogo} alt="Ecovita_logo" />
        </a>
        <div className="products-dropdown" ref={dropdownRef}>
          <button
            className="products-button"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Məhsullar
            <span className="products-icon">
              <FaSyringe />
            </span>
            <FaChevronDown className={`chevron-icon ${isDropdownOpen ? "open" : ""}`} />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                className="dropdown-menu"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <li onClick={() => scrollToSection("cold-pressed-oils")}>
                  Soyuq press yağlar
                </li>
                <li onClick={() => scrollToSection("disinfectants")}>
                  Dezinfeksiya vasitələri
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;