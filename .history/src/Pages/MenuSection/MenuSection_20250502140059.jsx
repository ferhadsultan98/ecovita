import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MenuSection.scss";
import { IoIosArrowForward, IoIosArrowBack, IoIosSearch } from "react-icons/io";

const MenuSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const filterListRef = useRef(null);
  const [scrolled, setScrolled] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const navbarRef = useRef(null);
  const sectionRef = useRef(null);

  // Static product data for Ecovita
  const productData = [
    {
      category: { az: "Kənd təsərrüfatı" },
      items: [
        {
          id: "1",
          name: { az: "Ecovita Səth Dezinfektanı" },
          description: { az: "Bütün səthlər üçün güclü təmizləyici, 99.9% mikrob öldürür." },
          price: 12.50,
          image_url: "/public/assets/",
        },
        {
          id: "2",
          name: { az: "Ecovita Sprey Dezinfektan" },
          description: { az: "Havada və səthlərdə istifadə üçün portativ sprey." },
          price: 8.00,
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
          description: { az: "Alkoqol əsaslı, dərini qoruyan əl təmizləyicisi." },
          price: 5.00,
          image_url: "hand-sanitizer.jpg",
        },
        {
          id: "4",
          name: { az: "Ecovita Gel Sanitayzer" },
          description: { az: "Uzunmüddətli qoruma təmin edən gel formulası." },
          price: 6.50,
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
          description: { az: "Mətbəx və vanna otağı üçün ekoloji təmiz təmizləyici." },
          price: 10.00,
          image_url: "multi-purpose-cleaner.jpg",
        },
        {
          id: "6",
          name: { az: "Ecovita Şüşə Təmizləyici" },
          description: { az: "Ləkəsiz parıltı üçün şüşə və güzgü təmizləyicisi." },
          price: 7.00,
          image_url: "glass-cleaner.jpg",
        },
      ],
    },
  ];

  const processMenuData = (data) => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, cat) => {
      if (!cat?.category?.az || !Array.isArray(cat.items)) return acc;
      const categoryKey = cat.category.az.toLowerCase().replace(/\s+/g, "-");
      acc[categoryKey] = {
        items: cat.items.filter(item => item?.id && item?.name?.az && item?.description?.az && item?.price),
        name: cat.category,
      };
      return acc;
    }, {});
  };

  useEffect(() => {
    try {
      const processedData = processMenuData(productData);
      setMenuItems(processedData);
      setFetchError(null);
    } catch (error) {
      setFetchError(`Məhsul məlumatlarının yüklənməsində xəta: ${error.message}`);
      setMenuItems({});
    }
  }, []);

  useEffect(() => {
    let items = [];
    if (activeFilter === "all") {
      Object.values(menuItems).forEach((category) => {
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
    } else if (menuItems[activeFilter]?.items) {
      items = menuItems[activeFilter].items.map((item) => ({
        ...item,
        category: menuItems[activeFilter].name,
      }));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) =>
        (item.name?.az || "").toLowerCase().includes(term) ||
        (item.description?.az || "").toLowerCase().includes(term)
      );
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    setVisibleItems(items);
    setItemsToShow(6);
    setHasMore(items.length > 6);
  }, [activeFilter, menuItems, searchTerm]);

  useEffect(() => {
    const updateMetrics = () => {
      if (filterListRef.current) {
        const element = filterListRef.current;
        const newMaxScroll = element.scrollWidth - element.clientWidth;
        setMaxScroll(newMaxScroll > 0 ? newMaxScroll : 0);
        setScrolled(element.scrollLeft);
      }
    };
    updateMetrics();
    scrollActiveFilterIntoView();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [activeFilter, menuItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current && navbarRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        setIsNavbarSticky(sectionTop <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleScroll = (direction) => {
    if (!filterListRef.current) return;
    const element = filterListRef.current;
    const scrollAmount = direction === "prev" ? -element.clientWidth * 0.7 : element.clientWidth * 0.7;
    element.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleFilterListScroll = () => {
    if (filterListRef.current) {
      const element = filterListRef.current;
      setScrolled(element.scrollLeft);
      setMaxScroll(Math.max(0, element.scrollWidth - element.clientWidth));
    }
  };

  const scrollActiveFilterIntoView = () => {
    if (!filterListRef.current) return;
    const activeButton = filterListRef.current.querySelector(".menu-filter-button-active");
    if (activeButton) {
      const list = filterListRef.current;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const listWidth = list.clientWidth;
      list.scrollTo({ left: buttonLeft - listWidth / 2 + buttonWidth / 2, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setActiveFilter("all");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const loadMore = () => {
    const newItemsToShow = itemsToShow + 6;
    setItemsToShow(newItemsToShow);
    setHasMore(visibleItems.length > newItemsToShow);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const categories = Object.keys(menuItems);

  return (
    <section className="menu-section" id="products" ref={sectionRef}>
      <div className={`menu-navbar-wrapper ${isNavbarSticky ? "sticky" : ""}`} ref={navbarRef}>
        <div className="container">
          {fetchError && (
            <div className="error-message">
              {fetchError}
            </div>
          )}
          <div className="menu-navbar-content">
            <div className="menu-search">
              <div className="search-input-wrapper">
                <IoIosSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Məhsul axtar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button className="clear-search-button" onClick={clearSearch}>
                    ×
                  </button>
                )}
              </div>
            </div>
            <nav className="menu-filter">
              <div className="menu-filter-container">
                <button
                  className={`scroll-button scroll-button-prev ${scrolled <= 0 ? "scroll-button-disabled" : ""}`}
                  onClick={() => handleScroll("prev")}
                  disabled={scrolled <= 0}
                  aria-label="Sola sürüşdür"
                >
                  <IoIosArrowBack fontSize="24px" />
                </button>
                <div
                  className="menu-filter-list"
                  ref={filterListRef}
                  onScroll={handleFilterListScroll}
                >
                  <div className="menu-filter-item">
                    <motion.button
                      className={`menu-filter-button ${activeFilter === "all" ? "menu-filter-button-active" : ""}`}
                      onClick={() => handleFilterClick("all")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Bütün Məhsullar
                    </motion.button>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="menu-filter-item">
                      <motion.button
                        className={`menu-filter-button ${activeFilter === category ? "menu-filter-button-active" : ""}`}
                        onClick={() => handleFilterClick(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {menuItems[category].name.az}
                      </motion.button>
                    </div>
                  ))}
                </div>
                <button
                  className={`scroll-button scroll-button-next ${scrolled >= maxScroll - 1 ? "scroll-button-disabled" : ""}`}
                  onClick={() => handleScroll("next")}
                  disabled={scrolled >= maxScroll - 1}
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
        {visibleItems.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + searchTerm}
              className="menu-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {visibleItems.slice(0, itemsToShow).map((item) => (
                <motion.div
                  key={item.id}
                  className="menu-item"
                  variants={itemVariants}
                >
                  <div className="menu-item-card">
                    <div className="menu-item-image">
                      <img
                        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name.az)}`}
                        alt={item.name.az}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Məhsul";
                        }}
                      />
                      <div className="menu-item-category-badge">
                        {item.category.az}
                      </div>
                    </div>
                    <div className="menu-item-content">
                      <h4 className="menu-item-title">{item.name.az}</h4>
                      <p className="menu-item-description">{item.description.az}</p>
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
            <button className="reset-filter-button" onClick={clearSearch}>
              Axtarışı Sıfırla
            </button>
          </div>
        )}
        {hasMore && visibleItems.length > 0 && (
          <div className="menu-load-more">
            <motion.button
              className="load-more-button"
              onClick={loadMore}
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

export default MenuSection;