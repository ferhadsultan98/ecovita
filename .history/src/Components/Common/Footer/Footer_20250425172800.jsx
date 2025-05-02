import React, { useState, useEffect } from "react";
import "./Footer.scss";
import logo from "../../../../public/assets/logowhite.png";
import visaIcon from "../../../../public/assets/visa.png";
import mastercardIcon from "../../../../public/assets/mastercard.png";
import { IoIosArrowUp } from "react-icons/io";
import { GrFacebookOption } from "react-icons/gr";
import {
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();
  const i18nextLng = localStorage.getItem("i18nextLng");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            <div className="footer-info">
              <img
                src={logo}
                alt="Guba Garden Restaurant Logo"
                className="footer-logo"
              />
              {i18nextLng === "az" ? (
                <p className="footer-description">
                  Quba Garden, 2010-cu ildən bəri yerli və beynəlxalq mətbəxin
                  seçilmiş dadlarını bir araya gətirərək qonaqlarına yüksək
                  səviyyəli xidmət təqdim edir. Burada siz həm Azərbaycan
                  mətbəxinin sevilən yeməklərini, həm də fərqli ölkələrin dadlı
                  nümunələrini təbiət mənzərəsi fonunda dada bilərsiniz.
                </p>
              ) : i18nextLng === "en" ? (
                <p className="footer-description">
                  Since 2010, Quba Garden has brought together selected tastes
                  from local and international cuisine, delivering top-level
                  service to its guests. Here, you can enjoy both beloved
                  Azerbaijani dishes and international delicacies while
                  surrounded by beautiful natural scenery.
                </p>
              ) : (
                <p className="footer-description">
                  С 2010 года Quba Garden объединяет лучшие вкусы местной и
                  мировой кухни, предлагая гостям обслуживание на высоком
                  уровне. Здесь вы можете насладиться любимыми блюдами
                  азербайджанской кухни и кулинарными изюминками разных стран на
                  фоне живописной природы.
                </p>
              )}

              <div className="footer-contact-items">
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>{t("footer.location")}</span>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt />
                  <span>+994 55 280 50 00</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>qubagarden@macaraclub.az</span>
                </div>
                <div className="contact-item">
                  <FaClock />
                  <span>12:00-22:00</span>
                </div>
              </div>
            </div>

            <div className="footer-connect">
              <h4> {t("footer.connectWithUs")}</h4>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/profile.php?id=61568928467790"
                  aria-label="Facebook"
                  className="social-icon"
                  target="_blank"
                >
                  <GrFacebookOption />
                </a>
                <a
                  href="https://www.instagram.com/qubagardenrestaurant"
                  aria-label="Instagram"
                  target="_blank"
                  className="social-icon"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@macara.garden.res"
                  aria-label="Instagram"
                  target="_blank"
                  className="social-icon"
                >
                  <FaTiktok />
                </a>
              </div>

              <div className="footer-actions">
                <a
                  href="https://www.google.com/maps?geocode=FdFEdgIdlBjlAg%3D%3D;FQdGdgIdURflAinndJgEAJk3QDF1YYNJ_Mh4FQ%3D%3D&daddr=8H49+35C+Quba+Garden+Restaurant,+Quba&saddr=41.3052971,48.5684684&dirflg=w&ftid=0x40379900049874e7:0x1578c8fc49836175&lucs=,94224825,94227247,94227248,94231188,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISEjI1LjE1LjAuNzQ0OTgzNDA2MBgAILq3CypjLDk0MjI0ODI1LDk0MjI3MjQ3LDk0MjI3MjQ4LDk0MjMxMTg4LDQ3MDcxNzA0LDQ3MDY5NTA4LDk0MjE4NjQxLDk0MjAzMDE5LDQ3MDg0MzA0LDk0MjA4NDU4LDk0MjA4NDQ3QgJBWg%3D%3D&skid=a72ffac3-b3a5-4fdf-8a42-10e79c35405d&g_st=iw"
                  className="footer-btn map-btn"
                  target="_blank"
                >
                  {t("footer.viewMap")}
                </a>
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p className="copyright">
              © {currentYear}
              <a href="https://pmsystems.az/" target="_blank">
                <span>Created by PM Systems</span>.
              </a>
              {t("footer.allRightReserved")}
            </p>

            <p className="credits"></p>
          </div>
        </div>
      </div>

      <div
        className={`scroll-top ${showScrollTop ? "visible pulse" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <IoIosArrowUp />
      </div>
    </footer>
  );
};

export default Footer;
