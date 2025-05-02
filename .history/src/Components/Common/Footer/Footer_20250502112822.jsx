import React, { useState, useEffect } from "react";
import "./Footer.scss";
import { IoIosArrowUp } from "react-icons/io";
import { GrFacebookOption } from "react-icons/gr";
import {
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import footerLogo from '../../../../public/assets/Fotolar/logo.png'

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
              <img className="footerLogo" src={}>
              <p className="footerDescription">
                Since 2015, PureSafe Solutions has provided high-quality health and disinfection products. 
                We offer safe, eco-friendly, and effective solutions for our customers.
              </p>
              <div className="footerContactItems">
                <div className="contactItem">
                  <FaMapMarkerAlt />
                  <span>123 Clean Street, Baku, Azerbaijan</span>
                </div>
                <div className="contactItem">
                  <FaPhoneAlt />
                  <span>+994 50 123 45 67</span>
                </div>
                <div className="contactItem">
                  <FaEnvelope />
                  <span>info@puresafe.az</span>
                </div>
                <div className="contactItem">
                  <FaClock />
                  <span>09:00-18:00</span>
                </div>
              </div>
            </div>

            <div className="footerConnect">
              <h4>Connect With Us</h4>
              <div className="socialIcons">
                <a
                  href="https://www.facebook.com/puresafesolutions"
                  aria-label="Facebook"
                  className="socialIcon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GrFacebookOption />
                </a>
                <a
                  href="https://www.instagram.com/puresafesolutions"
                  aria-label="Instagram"
                  className="socialIcon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.twitter.com/puresafesolutions"
                  aria-label="Twitter"
                  className="socialIcon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              </div>
              <div className="footerActions">
                <a
                  href="https://www.google.com/maps"
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
              <a href="https://pmsystems.az/" target="_blank" rel="noopener noreferrer">
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