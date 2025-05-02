import { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Logo from "../../../../public/assets/logo.png";
import whiteLogo from "../../../../public/assets/logowhite.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { IoRestaurantOutline } from "react-icons/io5";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "az", name: "Azərbaycan" },
    { code: "ru", name: "Русский" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="headerContainer">
        <a onClick={scrollToTop}>
          <div className="logo">
            <img
              src={scrolled ? Logo : whiteLogo}
              alt={scrolled ? "Logo" : "White Logo"}
              className="logo-img"
            />
          </div>
        </a>
        <button className="menu-button" onClick={scrollToMenu}>
        {t("header.menu")}
          <span className="menu-icon">
            <IoRestaurantOutline />
          </span>
        </button>
        <div className="header-actions">
          <div className="lang-dropdown" ref={dropdownRef}>
            <button
              className="lang-current"
              onClick={toggleMenu}
              aria-expanded={isOpen}
            >
              <span>{i18n.language.toUpperCase()}</span>
              <i className={`fas fa-chevron-down ${isOpen ? "open" : ""}`}></i>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  className="lang-options"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((lang) => (
                    <motion.li
                      key={lang.code}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      onClick={() => toggleLanguage(lang.code)}
                      className={i18n.language === lang.code ? "active" : ""}
                    >
                      <span className="lang-code">
                        {lang.code.toUpperCase()}
                      </span>
                      <span className="lang-name">{lang.name}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;