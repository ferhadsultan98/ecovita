/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.scss";
import { FaSyringe } from "react-icons/fa";
import DescLogo from '../../../public/assets/Fotolar/desclogo.png'
import MiniLogo from '../../../public/assets/Fotolar/minilogo.png'
const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const waMessages =
    "Salam, Ecovita məhsulları haqqında məlumat almaq istəyirəm. Xahiş edirəm ətraflı məlumat verəsiniz. Təşəkkürlər!";

  return (
    <section className="home-page">
      <section className="hero-section">
        <div className="hero-background">
          <div className="overlay"></div>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* <motion.span
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Ecovita
          </motion.span> */}
          <img src={DescLogo} alt="DescLogo" />
          <div className="separator">
            <span></span>
            <img src={MiniLogo} alt="" />
            <span></span>
          </div>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Ecovita ilə ekoloji təmiz və effektiv məhsullar istifadə edərək,
            sağlam və təhlükəsiz bir mühit yaratmaqla həm insan sağlamlığını,
            həm də təbiəti qorumağa kömək edirsiniz.
          </motion.p>
          <motion.div
            className="button-group"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a
              href={`https://wa.me/+99455555555?text=${encodeURIComponent(
                waMessages
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                className="contact-button"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Əlaqə Saxla
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        <div className="scroll-indicator">
          <motion.div
            className="mouse-icon"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <i className="fas fa-chevron-down"></i>
          </motion.div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <motion.span
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Haqqımızda
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ecovita: Sağlam Gələcək üçün Təmiz Həllər
            </motion.h2>
            <div className="separator">
              <span></span>
              <i className="fas fa-leaf"></i>
              <span></span>
            </div>
          </div>

          <div className="about-content">
            <motion.div
              className="about-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="image-frame">
                <div className="decorative-corner corner-top-left"></div>
                <div className="decorative-corner corner-top-right"></div>
                <div className="decorative-corner corner-bottom-left"></div>
                <div className="decorative-corner corner-bottom-right"></div>
              </div>
            </motion.div>

            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3>Bizim Missiyamız</h3>
              <p>
                Ecovita olaraq, sağlamlıq və təmizlik sahəsində ekoloji təmiz və
                yüksək keyfiyyətli dezinfeksiya məhsulları təqdim edirik. İlk
                gündən məqsədimiz, müştərilərimizə təhlükəsiz, effektiv və ətraf
                mühitə zərər verməyən həllər təklif etməkdir. Məhsullarımız ən
                son texnologiyalar əsasında hazırlanır və evlərdə, ofislərdə,
                səhiyyə müəssisələrində və digər ictimai yerlərdə təmiz və
                sağlam mühit təmin edir. Komandamız hər bir məhsulun
                keyfiyyətinə və müştəri məmnuniyyətinə xüsusi diqqət yetirir,
                çünki sizin sağlamlığınız bizim prioritetimizdir.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
