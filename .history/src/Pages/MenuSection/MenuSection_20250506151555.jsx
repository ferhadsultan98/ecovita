import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MenuSection.scss";
import { IoIosArrowForward, IoIosArrowBack, IoIosSearch } from "react-icons/io";
import productData from "./menuItems.json"; // Import the JSON file
import
const MenuSection = () => {
  const [activeFilters, setActiveFilters] = useState({
    oils: "all",
    disinfectants: "all",
  });
  const [visibleItems, setVisibleItems] = useState({
    oils: [],
    disinfectants: [],
  });
  const [menuItems, setMenuItems] = useState({
    oils: {},
    disinfectants: {},
  });
  const [fetchError, setFetchError] = useState(null);
  const [filterListRefs, setFilterListRefs] = useState({
    oils: useRef(null),
    disinfectants: useRef(null),
  });
  const [scrolled, setScrolled] = useState({ oils: 0, disinfectants: 0 });
  const [maxScroll, setMaxScroll] = useState({ oils: 0, disinfectants: 0 });
  const [itemsToShow, setItemsToShow] = useState({ oils: 6, disinfectants: 6 });
  const [hasMore, setHasMore] = useState({ oils: true, disinfectants: true });
  const [searchTerms, setSearchTerms] = useState({ oils: "", disinfectants: "" });
  const [isNavbarSticky, setIsNavbarSticky] = useState({
    oils: false,
    disinfectants: false,
  });
  const [expandedSection, setExpandedSection] = useState(null); // State to track expanded section
  const navbarRefs = {
    oils: useRef(null),
    disinfectants: useRef(null),
  };
  const sectionRefs = {
    oils: useRef(null),
    disinfectants: useRef(null),
  };

  const processMenuData = (data) => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, cat) => {
      if (!cat?.category?.az || !Array.isArray(cat.items)) return acc;
      const categoryKey = cat.category.az.toLowerCase().replace(/\s+/g, "-");
      acc[categoryKey] = {
        items: cat.items.filter(
          (item) =>
            item?.id && item?.name?.az && item?.description?.az && item?.price
        ),
        name: cat.category,
      };
      return acc;
    }, {});
  };

  useEffect(() => {
    try {
      const processedOils = processMenuData(productData.oils);
      const processedDisinfectants = processMenuData(productData.disinfectants);
      setMenuItems({
        oils: processedOils,
        disinfectants: processedDisinfectants,
      });
      setFetchError(null);
    } catch (error) {
      setFetchError(
        `Məhsul məlumatlarının yüklənməsində xəta: ${error.message}`
      );
      setMenuItems({ oils: {}, disinfectants: {} });
    }
  }, []);

  const updateVisibleItems = (section, activeFilter, menuItems, searchTerm) => {
    let items = [];
    if (activeFilter === "all") {
      Object.values(menuItems[section]).forEach((category) => {
        if (Array.isArray(category.items)) {
          items = [
            ...items,
            ...category.items.map((item) => ({
              ...item,
              category: category.name,
            })),
          ];
        }
      });
    } else if (menuItems[section][activeFilter]?.items) {
      items = menuItems[section][activeFilter].items.map((item) => ({
        ...item,
        category: menuItems[section][activeFilter].name,
      }));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          (item.name?.az || "").toLowerCase().includes(term) ||
          (item.description?.az || "").toLowerCase().includes(term)
      );
      setTimeout(() => {
        sectionRefs[section].current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    return items;
  };

  useEffect(() => {
    setVisibleItems({
      oils: updateVisibleItems(
        "oils",
        activeFilters.oils,
        menuItems,
        searchTerms.oils
      ),
      disinfectants: updateVisibleItems(
        "disinfectants",
        activeFilters.disinfectants,
        menuItems,
        searchTerms.disinfectants
      ),
    });
    setItemsToShow({ oils: 6, disinfectants: 6 });
    setHasMore({
      oils: visibleItems.oils?.length > 6,
      disinfectants: visibleItems.disinfectants?.length > 6,
    });
  }, [activeFilters, menuItems, searchTerms]);

  useEffect(() => {
    const updateMetrics = (section) => {
      const ref = filterListRefs[section].current;
      if (ref) {
        const newMaxScroll = ref.scrollWidth - ref.clientWidth;
        setMaxScroll((prev) => ({
          ...prev,
          [section]: newMaxScroll > 0 ? newMaxScroll : 0,
        }));
        setScrolled((prev) => ({ ...prev, [section]: ref.scrollLeft }));
      }
    };
    updateMetrics("oils");
    updateMetrics("disinfectants");
    scrollActiveFilterIntoView("oils");
    scrollActiveFilterIntoView("disinfectants");
    window.addEventListener("resize", () => {
      updateMetrics("oils");
      updateMetrics("disinfectants");
    });
    return () =>
      window.removeEventListener("resize", () => {
        updateMetrics("oils");
        updateMetrics("disinfectants");
      });
  }, [activeFilters, menuItems]);

  useEffect(() => {
    const handleScroll = () => {
      ["oils", "disinfectants"].forEach((section) => {
        if (sectionRefs[section].current && navbarRefs[section].current) {
          const sectionTop = sectionRefs[section].current.getBoundingClientRect().top;
          setIsNavbarSticky((prev) => ({
            ...prev,
            [section]: sectionTop <= 0,
          }));
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterClick = (section, filter) => {
    setActiveFilters((prev) => ({ ...prev, [section]: filter }));
    setTimeout(() => {
      sectionRefs[section].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleScrollFilters = (section, direction) => {
    const ref = filterListRefs[section].current;
    if (!ref) return;
    const scrollAmount =
      direction === "prev" ? -ref.clientWidth * 0.7 : ref.clientWidth * 0.7;
    ref.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleFilterListScroll = (section) => {
    const ref = filterListRefs[section].current;
    if (ref) {
      setScrolled((prev) => ({ ...prev, [section]: ref.scrollLeft }));
      setMaxScroll((prev) => ({
        ...prev,
        [section]: Math.max(0, ref.scrollWidth - ref.clientWidth),
      }));
    }
  };

  const scrollActiveFilterIntoView = (section) => {
    const ref = filterListRefs[section].current;
    if (!ref) return;
    const activeButton = ref.querySelector(".menu-filter-button-active");
    if (activeButton) {
      const list = ref;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const listWidth = list.clientWidth;
      list.scrollTo({
        left: buttonLeft - listWidth / 2 + buttonWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const handleSearchChange = (section, e) => {
    setSearchTerms((prev) => ({ ...prev, [section]: e.target.value }));
    setActiveFilters((prev) => ({ ...prev, [section]: "all" }));
  };

  const clearSearch = (section) => {
    setSearchTerms((prev) => ({ ...prev, [section]: "" }));
  };

  const loadMore = (section) => {
    const newItemsToShow = itemsToShow[section] + 6;
    setItemsToShow((prev) => ({ ...prev, [section]: newItemsToShow }));
    setHasMore((prev) => ({
      ...prev,
      [section]: visibleItems[section].length > newItemsToShow,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderMenuSection = (section, title, sectionId) => {
    const categories = Object.keys(menuItems[section]);
    return (
      <section className="menu-section" id={sectionId} ref={sectionRefs[section]}>
        <div
          className={`menu-navbar-wrapper ${
            isNavbarSticky[section] ? "sticky" : ""
          }`}
          ref={navbarRefs[section]}
        >
          <div className="container">
            {fetchError && <div className="error-message">{fetchError}</div>}
            <div className="menu-navbar-content">
              <h2 className="section-title">{title}</h2>
              <div className="menu-search">
                <div className="search-input-wrapper">
                  <IoIosSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Məhsul axtar..."
                    value={searchTerms[section]}
                    onChange={(e) => handleSearchChange(section, e)}
                    className="search-input"
                  />
                  {searchTerms[section] && (
                    <button
                      className="clear-search-button"
                      onClick={() => clearSearch(section)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <nav className="menu-filter">
                <div className="menu-filter-container">
                  <button
                    className={`scroll-button scroll-button-prev ${
                      scrolled[section] <= 0 ? "scroll-button-disabled" : ""
                    }`}
                    onClick={() => handleScrollFilters(section, "prev")}
                    disabled={scrolled[section] <= 0}
                    aria-label="Sola sürüşdür"
                  >
                    <IoIosArrowBack fontSize="24px" />
                  </button>
                  <div
                    className="menu-filter-list"
                    ref={filterListRefs[section]}
                    onScroll={() => handleFilterListScroll(section)}
                  >
                    <div className="menu-filter-item">
                      <motion.button
                        className={`menu-filter-button ${
                          activeFilters[section] === "all"
                            ? "menu-filter-button-active"
                            : ""
                        }`}
                        onClick={() => handleFilterClick(section, "all")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Bütün Məhsullar
                      </motion.button>
                    </div>
                    {categories.map((category) => (
                      <div key={category} className="menu-filter-item">
                        <motion.button
                          className={`menu-filter-button ${
                            activeFilters[section] === category
                              ? "menu-filter-button-active"
                              : ""
                          }`}
                          onClick={() => handleFilterClick(section, category)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {menuItems[section][category].name.az}
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`scroll-button scroll-button-next ${
                      scrolled[section] >= maxScroll[section] - 1
                        ? "scroll-button-disabled"
                        : ""
                    }`}
                    onClick={() => handleScrollFilters(section, "next")}
                    disabled={scrolled[section] >= maxScroll[section] - 1}
                    aria-label="Sağa sürüşdür"
                  >
                    <IoIosArrowForward fontSize="24px" />
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className="container menu-content">
          {section === "oils" && (
            <>
              <div className="product-info-section">
                <div className="product-info-preview">
                  <h3>ALAQANQAL TOXUMUNUN YAĞI</h3>
                  <p>
                    Alaqanqal yağı – zəngin karotinoidlər, flavolignanlar,
                    vitaminlər, makro və mikro elementlər, doymamış və
                    polidoymamış yağ turşularına malik olduğundan orqanizmin
                    müdafiəsi üçün unikal vasitədir.
                  </p>
                  <motion.button
                    className="read-more-button"
                    onClick={() => toggleSection("alaqanqal")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedSection === "alaqanqal" ? "Bağla" : "Ətraflı Oxu"}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {expandedSection === "alaqanqal" && (
                    <motion.div
                      className="product-info-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        Təbiətdə çox az rast gəlinən alaqanqal yağının
                        tərkibində ahəmiyyətli dərəcədə mövcud olan silimarin
                        qaraciyər üçün ən effektli müalicəvi maddə kimi
                        əczacılıqda ənənəvi tib elminə və xalq təbabətinə əsasən
                        istifadə olunur. Silimarin qaraciyərdə hepatositlərin
                        membranını möhkəmləndirir, alkoqol və toksik maddələrin
                        təsirindən zədələnmiş hepatositlərin regenerasiyasını
                        stimullaşdırır, lipid mübadilə pozğunluğunda qaraciyər
                        distrofiyasından istifadə edilir.
                      </p>
                      <ul>
                        <li>
                          A, E vitaminləri orqanizmdə iltihab proseslərinin
                          qarşısını alır, dərinin vəziyyətinə və görməyə müsbət
                          təsir göstərir.
                        </li>
                        <li>
                          B qrupu vitaminləri sinir və ürək-damar sistemlərinin
                          funksiyasını normallaşdırır, hemoqlobinin sintezinə
                          kömək edir, saç və dırnaqları möhkəmləndirir.
                        </li>
                        <li>
                          D vitamini immuniteti gücləndirir, sümükləri
                          möhkəmləndirir.
                        </li>
                        <li>
                          Omega-3, Omega-6 və Omega-9 turşuları pozulmuş lipid
                          mübadiləsini və hormonal balansı korrektə edir,
                          orqanizmi antioksidant təsirdən müdafiə edir.
                        </li>
                        <li>
                          Zn, Mn və Se sayəsində mədəaltı vəzində insulin
                          sintezini stimullaşdırır.
                        </li>
                        <li>
                          Antibakterial xüsusiyyə malik xlorofilin toksinlərin
                          maddələr mübadiləsi təsirini azaldır, dərin
                          regenerasiya proseslərini sürətləndirir və erkən
                          yaşlanmanın qarşısını almağa dəirin təravətlidir.
                        </li>
                        <li>
                          Onkoloji xəstəliklər zamanı kimya və şüa terapiyasının
                          əks-təsirlərini azaldır.
                        </li>
                      </ul>
                      <p>
                        <strong>Əks göstərişlər:</strong> BFMQ3-in tərkibində
                        olan hər hansı bir komponentə qarşı fərdi həssaslıq.
                      </p>
                      <p>
                        <strong>Qəbul qaydası və dozası:</strong> Böyüklər:
                        gündə 3 dəfə 1 çay qaşığı yeməkdən 30 dəqiqə əvvəl
                        acqarına qəbul edilir. Yağın minimum qəbul müddəti 1,5 -
                        2 aydır.
                      </p>
                      <h4>Əlavə məlumat:</h4>
                      <p>
                        <strong>
                          Uşaqlar, hamilə və süd verən qadınlar istifadə edə
                          bilərmi?
                        </strong>
                        <br />
                        Xəstəliklərin müalicəsi məqsədilə istifadə edilmə
                        bilməz!
                      </p>
                      <p>
                        Yalnız həkim tövsiyəsi ilə istifadə edin. BFMQ3 normal
                        qidalanmanı əvəz etmir!
                      </p>
                      <p>
                        Uşaqların əli çatmayan yerdə, xəstəlik və dərman
                        preparatlarının istifadəsinə uyğun olmayan mühitdə
                        saxlayın!
                      </p>
                      <p>Həmişə orijinal qablaşdırmada saxlayın!</p>
                      <p>
                        <strong>Yararlılıq müddəti:</strong> 18 ay
                      </p>
                      <p>
                        <strong>İstehsalçı:</strong> “Ecovita” MMC, AZ1052,
                        Abşeron rayonu Məmmədli kəndi.
                        <br />
                        <a href="http://www.ecovita.az">www.ecovita.az</a>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="product-info-section">
                <div className="product-info-preview">
                  <h3>KƏTAN TOXUMUNUN YAĞI</h3>
                  <p>
                    Kətan yağı sağlamlıq üçün ən vacib sayılan yağlardandır.
                    Tərkibindəki omega yağları və vitaminlər sayəsində
                    orqanizmdə maddələr mübadiləsini yaxşılaşdırır, qanda
                    xolesterinin miqdarını azaldır.
                  </p>
                  <motion.button
                    className="read-more-button"
                    onClick={() => toggleSection("ketan")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedSection === "ketan" ? "Bağla" : "Ətraflı Oxu"}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {expandedSection === "ketan" && (
                    <motion.div
                      className="product-info-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        Bioloji fəallığa malik qida əlavəsinin istifadəsinə dair
                        təlimat. Yağın rəngi və ətri: açıq sarı rəngli, xoş
                        ətirli.
                      </p>
                      <p>
                        <strong>Tərkibi:</strong> Doymamış və polidoymamış yağ
                        turşuları: omega 3 (linolen) 55%, omega 6 (linol) 16%,
                        olein 21%, palmitin 5%, araxin 0,5%, miristin 0,1% və
                        sair, A, B, E, F, K vitaminləri, Fe, Zn, Mg, Ca və P
                        mineralları, amin turşuları.
                      </p>
                      <p>
                        <strong>Farmakoloji xüsusiyyətləri:</strong> Kətan yağı
                        sağlamlıq üçün ən vacib sayılan yağlardandır. Kətan
                        yağından istifadə etmək orqanların işini normallaşdırır.
                        Yağın tərkibində olan A, B, E, F, K vitaminləri,
                        doymamış və polidoymamış yağ turşuları ilə, həmçinin
                        fitosterol, xolin, fosfor, kalsium, sink və kaliumla
                        zəngindir. Tərkibində olan omega yağları sayəsində kətan
                        yağı orqanizmdə maddələr mübadiləsini yaxşılaşdırır,
                        qanda xolesterinin miqdarının azalmasına səbəb olur,
                        damar divarlarının elastikliyini artırır. Kətan yağı həzm
                        sisteminin və qaraciyər funksiyasının yaxşılaşmasına,
                        qəbizliyin, qıcqırmanın aradan qalxmasına səbəb olur,
                        parazit əleyhinə təsir göstərir.
                      </p>
                      <p>
                        <strong>Kosmetik effekt:</strong> Dərinin vitamin və
                        minerallara olan ehtiyacını ödəyir, dərini cavanlaşdırır,
                        ona bakterisid təsir göstərir.
                      </p>
                      <ul>
                        <li>
                          <strong>Omega 3:</strong> Orqanizm bu yağı istehsal
                          etmədiyi üçün qidalanma yolu ilə qəbul edilməsi
                          lazımdır. Omega 3 yağ turşuları yaxşı xolesterolu
                          artırır. Triqliseridlər qan təzyiqini və arterial
                          lövhələrin əmələ gəlməsini azaldır.
                        </li>
                        <li>
                          <strong>Omega 6:</strong> Qlükozanın udulmasını
                          artırır, immunitet sisteminin gücləndirilməsində
                          iştirak edir. Qanda xolesterinin səviyyəsini aşağı
                          salır və qan damarlarının divarlarında xolesterin
                          lövhələrinin çökməsinin qarşısını alır, toxuma
                          mübadiləsini yaxşılaşdıraraq orqanizmdə xroniki
                          iltihabın inkişafını azaldır.
                        </li>
                        <li>
                          <strong>A vitamini:</strong> Görmə qabiliyyətini
                          qorumağa kömək edir, bədənin qoruyucu funksiyasını
                          artırır, maddələr mübadiləsini yaxşılaşdırır.
                        </li>
                        <li>
                          <strong>B qrupu vitaminləri:</strong> Mərkəzi sinir
                          sisteminin işinə müsbət təsir göstərir.
                        </li>
                        <li>
                          <strong>E vitamini:</strong> Sinir sisteminin,
                          əzələlərin, hipofiz və adrenal vəzlər kimi endokrin
                          vəzlərin və reproduktiv orqanların funksiyası üçün
                          vacibdir.
                        </li>
                        <li>
                          <strong>K vitamini:</strong> Immuniteti gücləndirir,
                          sinir sisteminin sağlamlığını və beyin fəaliyyətini
                          dəstəkləməyə kömək edir.
                        </li>
                      </ul>
                      <p>
                        <strong>Əks göstərişlər:</strong> BFMQƏ-nin hər hansı
                        komponentinə qarşı fərdi həssaslıq.
                      </p>
                      <p>
                        <strong>İstifadə qaydası və dozası:</strong> Böyüklər: 1
                        çay qaşığı gündə 2–3 dəfə yeməkdən 20 dəqiqə sonra
                        daxilə qəbul edilir.
                      </p>
                      <p>
                        <strong>Qəbul müddəti:</strong> Yağın minimum qəbul
                        müddəti 1, maksimal isə 3 aydır. İl ərzində kurs 2–3
                        dəfə təkrarlana bilər.
                      </p>
                      <p>
                        Dərman vasitəsi deyildir. Bioloji fəallığa malik qida
                        əlavəsidir.
                      </p>
                      <p>
                        Xəstəliklərin müalicəsi məqsədi ilə istifadə edilə
                        bilməz.
                      </p>
                      <p>Tövsiyə olunan sutkalıq dozanı keçməyin.</p>
                      <p>BFMQƏ normal qidalanmanı əvəz etmir.</p>
                      <p>Uşaqların əli çatmayan yerdə saxlayın.</p>
                      <p>
                        Hamiləlik və laktasiya dövründə, xəstəlik və dərman
                        preparatlarının istifadəsi zamanı həkimlə məsləhətləşin.
                      </p>
                      <p>
                        <strong>Buraxılış forması:</strong> 100 ml şüşə qabda,
                        təlimat vərəqi ilə birgə karton qutuda yerləşdirilmişdir.
                      </p>
                      <p>
                        <strong>Saxlama şəraiti:</strong> Qapalı ambalaj
                        qutusunda 25°C-dən aşağı temperaturda, quru, günəş şüası
                        düşməyən yerdə saxlanılmalıdır. Qapağı açıldıqdan sonra
                        məhsulun qida dəyərini 1,5 ay saxlamaq tövsiyə olunur.
                      </p>
                      <p>Təlimata uyğun şəkildə istifadə edin.</p>
                      <p>
                        <strong>Yararlılıq müddəti:</strong> 18 ay.
                      </p>
                      <p>
                        <strong>İstifadə tarixi:</strong> Şüşə qabın üzərində
                        qeyd olunub.
                      </p>
                      <p>
                        <strong>İstehsalçı:</strong> “Ecovita” MMC, AZ 0125,
                        Abşeron rayonu, Məmmədli kəndi.
                        <br />
                        <a href="http://www.ecovita.az">www.ecovita.az</a>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          {section === "disinfectants" && (
            <div className="product-info-section">
              <div className="product-info-preview">
                <h3>DEZİNFEKSİYA VASİTƏLƏRİ</h3>
                <p>
                  Ecovita dezinfeksiya vasitələri – səthlər, hava və şəxsi
                  gigiyena üçün ekoloji təmiz və effektiv həllər təklif edir.
                  Bütün məhsullar 99.9% mikrobları öldürür və uzunmüddətli
                  qoruma təmin edir.
                </p>
                <motion.button
                  className="read-more-button"
                  onClick={() => toggleSection("disinfectants")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {expandedSection === "disinfectants" ? "Bağla" : "Ətraflı Oxu"}
                </motion.button>
              </div>
              <AnimatePresence>
                {expandedSection === "disinfectants" && (
                  <motion.div
                    className="product-info-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      Məhsullarımız kənd təsərrüfatı, heyvandarlıq və ev
                      təmizliyi kimi müxtəlif sahələrdə istifadə üçün uyğundur.
                      Tərkibində zərərli kimyəvi maddələr yoxdur və dəriyə zərər
                      vermədən təhlükəsiz istifadəni təmin edir.
                    </p>
                    <ul>
                      <li>
                        Səth dezinfektanları mətbəx, vanna otağı və digər
                        səthlərdə effektiv təmizlik təmin edir.
                      </li>
                      <li>
                        Sprey dezinfektanlar hava və səthlərdə portativ istifadə
                        üçün idealdır.
                      </li>
                      <li>
                        Əl və gel sanitayzerlər dərini qoruyaraq uzunmüddətli
                        təmizlik təklif edir.
                      </li>
                      <li>
                        Çoxməqsədli təmizləyicilər ekoloji təmiz formulası ilə
                        hər cür səth üçün uyğundur.
                      </li>
                      <li>
                        Şüşə təmizləyicilər ləkəsiz parıltı və təmizlik təmin
                        edir.
                      </li>
                    </ul>
                    <p>
                      <strong>Əks göstərişlər:</strong> Məhsulların tərkibində
                      olan hər hansı bir komponentə qarşı fərdi həssaslıq.
                    </p>
                    <p>
                      <strong>İstifadə qaydası:</strong> Məhsulun
                      qablaşdırmasındakı təlimatlara uyğun istifadə edin.
                    </p>
                    <h4>Əlavə məlumat:</h4>
                    <p>Uşaqların əli çatmayan yerdə saxlayın.</p>
                    <p>Həmişə orijinal qablaşdırmada saxlayın!</p>
                    <p>
                      <strong>Yararlılıq müddəti:</strong> 24 ay
                    </p>
                    <p>
                      <strong>İstehsalçı:</strong> “Ecovita” MMC, AZ1052,
                      Abşeron rayonu Məmmədli kəndi.
                      <br />
                      <a href="http://www.ecovita.az">www.ecovita.az</a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {visibleItems[section].length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilters[section] + searchTerms[section]}
                className="menu-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {visibleItems[section]
                  .slice(0, itemsToShow[section])
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      className="menu-item"
                      variants={itemVariants}
                    >
                      <div className="menu-item-card">
                        <div className="menu-item-image">
                          <img
                            src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(
                              item.name.az
                            )}`}
                            alt={item.name.az}
                          />
                          <div className="menu-item-category-badge">
                            {item.category.az}
                          </div>
                        </div>
                        <div className="menu-item-content">
                          <h4 className="menu-item-title">{item.name.az}</h4>
                          <p className="menu-item-description">
                            {item.description.az}
                          </p>
                          <div className="menu-item-footer">
                            <span className="menu-item-price">
                              {item.price.toFixed(2)} ₼
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="no-results-found">
              <h3>Heç bir məhsul tapılmadı</h3>
              <p>Fərqli axtarış cəhd edin və ya filtrləri sıfırlayın.</p>
              <button
                className="reset-filter-button"
                onClick={() => clearSearch(section)}
              >
                Axtarışı Sıfırla
              </button>
            </div>
          )}
          {hasMore[section] && visibleItems[section].length > 0 && (
            <div className="menu-load-more">
              <motion.button
                className="load-more-button"
                onClick={() => loadMore(section)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Daha Çox Göstər
              </motion.button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {renderMenuSection("oils", "Soyuq Press Yağlar", "cold-pressed-oils")}
      {renderMenuSection(
        "disinfectants",
        "Dezinfeksiya Vasitələri",
        "disinfectants"
      )}
    </>
  );
};

export default MenuSection;