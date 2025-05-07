import React, { useState, useEffect } from "react";
import "./Footer.scss";
import { IoIosArrowUp } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaInstagram, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import footerLogo from "../../../../public/assets/Fotolar/logo.png";

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
      <div className="footerContent">
        <div className="container">
          <div className="footerMain">
            <div className="footerInfo">
              <img src={footerLogo} alt="footerLogo" className="footerLogo" />
              <p className="footerDescription">
                “Ecovita” Məhdud Məsuliyyətli Cəmiyyəti 2022-ci ildə təsis
                edilmişdir. Şirkətin istehsal etdiyi məhsullar müasir
                avadanlıqlardan istifadə olunmaqla yalnız Azərbaycan
                Respublikasının ərazisində yabanı halda yetişən müalicəvi
                xüsusiyyətlərə malik bitkilərdən əldə olunur.
              </p>
              <div className="footerContactItems">
                <div className="contactItem">
                  <i>
                    <FaLocationDot />
                  </i>
                  <a href="https://maps.app.goo.gl/mqyyw6jxVyPGAPP46">
                    Azərbaycan Respublikası, AZ1052, Bakı şəhəri, N.Nərimanov
                    rayonu, Əliyar Əliyev 52A
                  </a>
                </div>
                <div className="contactItem">
                  <i>
                    <FaPhoneAlt />
                  </i>
                  <a href="tel:+994993451234">+994(99) 345 12 34</a>
                </div>
                <div className="contactItem">
                  <i>
                    <FaEnvelope />
                  </i>
                  <a href="mailto:info@ecoway.az" target="_blank">info@ecoway.az</a>
                </div>
                <div className="contactItem">
                  <i>
                    <FaClock />
                  </i>
                  <span>09:00-18:00</span>
                </div>
              </div>
            </div>

            <div className="footerConnect">
              <h4>Connect With Us</h4>
              <div className="socialIcons">
                <a
                  href="https://www.instagram.com/ecovita.az"
                  aria-label="Instagram"
                  className="socialIcon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              </div>
              <div className="footerActions">
                <a
                  href="https://maps.app.goo.gl/mqyyw6jxVyPGAPP46"
                  className="footerBtn mapBtn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Map
                </a>
              </div>
            </div>
          </div>

          <div className="footerDivider"></div>

          <div className="footerBottom">
            <p className="copyright">
              © {currentYear}{" "}
              <a
                href="https://pmsystems.az"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Created by PM Systems</span>.
              </a>{" "}
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      <div
        className={`scrollTop ${showScrollTop ? "visible pulse" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <IoIosArrowUp />
      </div>
    </footer>
  );
};

export default Footer;
