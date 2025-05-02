/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.scss";
import { useTranslation } from "react-i18next";
import { FaUtensils } from "react-icons/fa";

const Home = () => {
  const { t, i18n } = useTranslation();
  const i18nextLng = localStorage.getItem("i18nextLng");
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
    "Salam, masa rezerv etmək istəyirəm. Xahiş edirəm mümkünlüyü barədə məlumat verəsiniz. Təşəkkürlər!";

  return (
    <section className="homePage">
      <section className="heroSection">
        <div className="heroBackground">
          <div className="overlay"></div>
        </div>

        <motion.div
          className="heroContent"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span
            className="heroSubtitle"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Guba Garden
          </motion.span>
          <motion.h1
            className="heroTitle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t("home.header")}
          </motion.h1>
          <div className="separator">
            <span></span>
            <i>
              <FaUtensils />
            </i>

            <span></span>
          </div>
          <motion.p
            className="heroDescription"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t("home.title")}
          </motion.p>
          <motion.div
            className="buttonGroup"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a
              href={`https://wa.me/+994552805000?text=${encodeURIComponent(
                waMessages
              )}`}
              target="_blank"
            >
              <motion.button
                className="reserveButton"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {t("home.restaurantReserve")}
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        <div className="scrollIndicator">
          <motion.div
            className="mouseIcon"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <i className="fas fa-chevron-down"></i>
          </motion.div>
        </div>
      </section>

      <section className="aboutSection">
        <div className="container">
          <div className="sectionHeader">
            <motion.span
              className="sectionSubtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t("home.about")}
            </motion.span>
            <motion.h2
              className="sectionTitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("home.mainheader")}
            </motion.h2>
            <div className="separator">
              <span></span>
              <i className="fas fa-leaf"></i>
              <span></span>
            </div>
          </div>

          <div className="aboutContent">
            <motion.div
              className="aboutImage"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="imageFrame">
                <div className="decorativeCorner cornerTopLeft"></div>
                <div className="decorativeCorner cornerTopRight"></div>
                <div className="decorativeCorner cornerBottomLeft"></div>
                <div className="decorativeCorner cornerBottomRight"></div>
              </div>
            </motion.div>

            <motion.div
              className="aboutText"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3>{t("home.twoheader")}</h3>
              {i18nextLng === "az" ? (
                <p>
                  Quba Garden – ənənə və yeniliyin bir arada olduğu, milli
                  ləzzətləri və dünya mətbəxindən seçilmiş yeməkləri zövqlə
                  təqdim edən bir məkandır. Fəaliyyət göstərdiyimiz ilk gündən
                  etibarən məqsədimiz hər qonağa həm dad, həm də rahatlıq
                  baxımından yaddaqalan bir təcrübə yaşatmaq olub. Yeməklərimiz
                  yerli və mövsümi məhsullardan hazırlanır. Aşpazlarımız həm
                  Azərbaycan mətbəxinin klassiklərini – qutab, dolma, kabab və
                  s. – həm də müxtəlif ölkələrin dadlı yeməklərini özəl
                  üsullarla təqdim edirlər. Restoranımızın interyeri təbiətə
                  açılan geniş sahələri, sakit və rahat atmosferi ilə həm fərdi,
                  həm ailəvi, həm də işgüzar görüşlər üçün əlverişlidir.
                </p>
              ) : i18nextLng === "en" ? (
                <p>
                  Quba Garden is a destination where tradition meets innovation,
                  offering national flavors and selected dishes from world
                  cuisine with a refined touch. From our very first day, our
                  goal has been to provide every guest with a memorable
                  experience — both in taste and comfort. Our dishes are
                  prepared using fresh, local, and seasonal ingredients. Our
                  chefs skillfully present the classics of Azerbaijani cuisine —
                  such as qutab, dolma, kebab — alongside delicious
                  international recipes with a unique twist. The restaurant’s
                  interior, with its open spaces facing nature and its calm,
                  cozy atmosphere, is ideal for solo diners, family gatherings,
                  or business meetings.
                </p>
              ) : (
                <p>
                  Quba Garden — это место, где традиции встречаются с
                  современностью, а блюда национальной и мировой кухни подаются
                  со вкусом и заботой о деталях. С первого дня нашей
                  деятельности мы стремимся подарить каждому гостю незабываемые
                  впечатления — как вкусовые, так и в плане комфорта. Наши блюда
                  готовятся из местных и сезонных ингредиентов. Наши повара
                  предлагают как классические блюда азербайджанской кухни —
                  кутабы, долма, кебаб и др., так и изысканные блюда разных
                  стран в авторской интерпретации. Интерьер ресторана с
                  просторными зонами, открывающимися к природе, и уютной
                  атмосферой идеально подходит для индивидуального отдыха,
                  семейных ужинов и деловых встреч.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
