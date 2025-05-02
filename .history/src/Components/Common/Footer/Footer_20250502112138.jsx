import React, { useState, useEffect } from "react";
import "./Footer.scss";
import { IoIosArrowUp } from "react-icons/io";
import { GrFacebookOption } from "react-icons/gr";
import { FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            <div className="footer-info">
              <div className="footer-logo">Ecovita</div>
              <p className="footer-description">
                Ecovita 2010-cu ildən bəri ekoloji təmiz və effektiv dezinfeksiya
                məhsulları ilə sağlam və təhlükəsiz mühit yaradır. Bizim məhsullar
                evlərdə, ofislərdə və ictimai yerlərdə təmizlik və sağlamlığı
                təmin etmək üçün innovativ həllər təklif edir.
              </p>
              <div className="footer-contact-items">
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Bakı, Azərbaycan</span>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt />
                  <span>+994 55 280 50 00</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>info@ecovita.az</span>
                </div>
                <div className="contact-item">
                  <FaClock />
                  <span>09:00-18:00</span>
                </div>
              </div>
            </div>

            <div className="footer-connect">
              <h4>Bizimlə Əlaqə</h4>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/ecovita"
                  aria-label="Facebook"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GrFacebookOption />
                </a>
                <a
                  href="https://www.instagram.com/ecovita"
                  aria-label="Instagram"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@ecovita"
                  aria-label="TikTok"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok />
                </a>
              </div>
              <div className="footer-actions">
                <a
                  href="https://www.google.com/maps"
                  className="footer-btn map-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xəritədə Bax
                </a>
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p className="copyright">
              © {currentYear} Ecovita. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`scroll-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Yuxarı qalx"
      >
        <IoIosArrowUp />
      </div>
    </footer>
  );
};

export default Footer;