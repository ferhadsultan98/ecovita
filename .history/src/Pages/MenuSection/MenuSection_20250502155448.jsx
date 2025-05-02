import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MenuSection.scss";
import { IoIosArrowForward, IoIosArrowBack, IoIosSearch } from "react-icons/io";

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
  const navbarRefs = {
    oils: useRef(null),
    disinfectants: useRef(null),
  };
  const sectionRefs = {
    oils: useRef(null),
    disinfectants: useRef(null),
  };

  // Static product data for Ecovita, split into oils and disinfectants
  const productData = {
    oils: [
      {
        category: { az: "Soyuq press yağlar" },
        items: [
          {
            id: "7",
            name: { az: "Ecovita Küncüt Yağı" },
            description: { az: "Təbii üsulla istehsal olunan küncüt yağı." },
            price: 15.0,
            image_url: "sesame-oil.jpg",
          },
          {
            id: "8",
            name: { az: "Ecovita Zəytun Yağı" },
            description: { az: "Extra virgin zəytun yağı, soyuq press." },
            price: 20.0,
            image_url: "olive-oil.jpg",
          },
        ],
      },
    ],
    disinfectants: [
      {
        category: { az: "Kənd təsərrüfatı" },
        items: [
          {
            id: "1",
            name: { az: "Ecovita Səth Dezinfektanı" },
            description: {
              az: "Bütün səthlər üçün güclü təmizləyici, 99.9% mikrob öldürür.",
            },
            price: 12.5,
            image_url: "surface-disinfectant.jpg",
          },
          {
            id: "2",
            name: { az: "Ecovita Sprey Dezinfektan" },
            description: {
              az: "Havada və səthlərdə istifadə üçün portativ sprey.",
            },
            price: 8.0,
            image_url: "spray-disinfectant.jpg",
          },
        ],
      },
      {
        category: { az: "Heyvandarlıq" },
        items: [
          {
            id: "3",
            name: { az: "Ecovita Əl Sanitayzeri" },
            description: {
              az: "Alkoqol əsaslı, dərini qoruyan əl təmizləyicisi.",
            },
            price: 5.0,
            image_url: "hand-sanitizer.jpg",
          },
          {
            id: "4",
            name: { az: "Ecovita Gel Sanitayzer" },
            description: { az: "Uzunmüddətli qoruma təmin edən gel formulası." },
            price: 6.5,
            image_url: "gel-sanitizer.jpg",
          },
        ],
      },
      {
        category: { az: "Səth və döşəmələr" },
        items: [
          {
            id: "5",
            name: { az: "Ecovita Çoxməqsədli Təmizləyici" },
            description: {
              az: "Mətbəx və vanna otağı üçün ekoloji təmiz təmizləyici.",
            },
            price: 10.0,
            image_url: "multi-purpose-cleaner.jpg",
          },
          {
            id: "6",
            name: { az: "Ecovita Şüşə Təmizləyici" },
            description: {
              az: "Ləkəsiz parıltı üçün şüşə və güzgü təmizləyicisi.",
            },
            price: 7.0,
            image_url: "glass-cleaner.jpg",
          },
        ],
      },
    ],
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

  const renderMenuSection = (section, title, sectionId) => {
    const categories = Object.keys(menuItems[section]);
    return (
      <section className="menu-section" id={sectionId} ref={sectionRefs[section]}>
       
        <div
          className={`menu-navbar-wrapper ${isNavbarSticky[section] ? "sticky" : ""}`}
          ref={navbarRefs[section]}
        >
          <div className="container">
            {fetchError && <div className="error-message">{fetchError}</div>}
            <div className="menu-navbar-content">
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
                {visibleItems[section].slice(0, itemsToShow[section]).map((item) => (
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
      {renderMenuSection("disinfectants", "Dezinfeksiya Vasitələri", "disinfectants")}
    </>
  );
};

export default MenuSection;