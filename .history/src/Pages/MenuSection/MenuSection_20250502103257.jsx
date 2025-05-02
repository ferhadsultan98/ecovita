import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MenuSection.scss";
import { IoIosArrowForward, IoIosArrowBack, IoIosSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/Loading/Loading";
import { database, ref, onValue } from "../../server/server";

const MenuSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const filterListRef = useRef(null);
  const [scrolled, setScrolled] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const navbarRef = useRef(null);
  const { i18n, t } = useTranslation();
  const sectionRef = useRef(null);

  const processMenuData = (data) => {
    const formattedData = Array.isArray(data) ? data : Object.values(data);
    return formattedData.reduce((acc, cat) => {
      if (!cat || !cat.category || !cat.category.en) return acc;
      const categoryKey = cat.category.en.toLowerCase().replace(/\s+/g, "-");
      acc[categoryKey] = {
        items: Array.isArray(cat.items)
          ? cat.items
          : Object.values(cat.items || {}),
        name: cat.category,
      };
      return acc;
    }, {});
  };

  useEffect(() => {
    let isMounted = true;
    try {
      const menuRef = ref(database, "menu");
      const unsubscribe = onValue(
        menuRef,
        (snapshot) => {
          if (!isMounted) return;
          const data = snapshot.val();
          if (data) {
            setMenuItems(processMenuData(data));
          } else {
            setMenuItems({});
          }
          setIsLoading(false);
          setFetchError(null);
        },
        (error) => {
          if (!isMounted) return;
          setFetchError(`Failed to fetch menu data: ${error.message}`);
          setMenuItems({});
          setIsLoading(false);
        }
      );
      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (error) {
      if (!isMounted) return;
      setFetchError(`Error connecting to database: ${error.message}`);
      setMenuItems({});
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let items = [];
    if (activeFilter === "all") {
      Object.keys(menuItems).forEach((category) => {
        if (menuItems[category] && Array.isArray(menuItems[category].items)) {
          items = [
            ...items,
            ...menuItems[category].items.map((item) => ({
              ...item,
              category: menuItems[category].name,
            })),
          ];
        }
      });
    } else if (
      menuItems[activeFilter] &&
      Array.isArray(menuItems[activeFilter].items)
    ) {
      items = menuItems[activeFilter].items.map((item) => ({
        ...item,
        category: menuItems[activeFilter].name,
      }));
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) => {
        const nameMatch = (item.name?.[i18n.language] || item.name?.en || "")
          .toLowerCase()
          .includes(term);
        const descMatch = (
          item.description?.[i18n.language] ||
          item.description?.en ||
          ""
        )
          .toLowerCase()
          .includes(term);
        return nameMatch || descMatch;
      });

      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    setVisibleItems(items);
    setItemsToShow(6);
    setHasMore(items.length > 6);
  }, [activeFilter, menuItems, searchTerm, i18n.language]);

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
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleScroll = (direction) => {
    if (!filterListRef.current) return;
    const element = filterListRef.current;
    const scrollAmount =
      direction === "prev"
        ? -element.clientWidth * 0.7
        : element.clientWidth * 0.7;
    element.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleFilterListScroll = () => {
    if (filterListRef.current) {
      const element = filterListRef.current;
      const newScrolled = element.scrollLeft;
      const newMaxScroll = element.scrollWidth - element.clientWidth;
      setScrolled(newScrolled);
      setMaxScroll(newMaxScroll > 0 ? newMaxScroll : 0);
    }
  };

  const scrollActiveFilterIntoView = () => {
    if (!filterListRef.current) return;
    const activeButton = filterListRef.current.querySelector(
      ".menuFilterButtonActive"
    );
    if (activeButton) {
      const list = filterListRef.current;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const listWidth = list.clientWidth;
      const scrollTo = buttonLeft - listWidth / 2 + buttonWidth / 2;
      list.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setActiveFilter("all"); // Reset category filter to "all" when searching
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
    <section className="menuSection" id="menu" ref={sectionRef}>
      <div
        className={`menuNavbarWrapper ${isNavbarSticky ? "sticky" : ""}`}
        ref={navbarRef}
      >
        <div className="container">
          {fetchError && (
            <div
              className="errorMessage"
              style={{
                color: "red",
                margin: "10px 0",
                padding: "10px",
                background: "#ffeeee",
                borderRadius: "5px",
              }}
            >
              {fetchError}
            </div>
          )}
          <div className="menuNavbarContent">
            <div className="menuSearch">
              <div className="searchInputWrapper">
                <IoIosSearch className="searchIcon" />
                <input
                  type="text"
                  placeholder={t("menu.search")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="searchInput"
                />
                {searchTerm && (
                  <button className="clearSearchButton" onClick={clearSearch}>
                    ×
                  </button>
                )}
              </div>
            </div>
            <nav className="menuFilter">
              <div className="menuFilterContainer">
                <button
                  className={`scrollButton scrollButtonPrev ${
                    scrolled <= 0 ? "scrollButtonDisabled" : ""
                  }`}
                  onClick={() => handleScroll("prev")}
                  disabled={scrolled <= 0}
                  aria-label="Scroll left"
                >
                  <IoIosArrowBack fontSize="24px" />
                </button>
                <div
                  className="menuFilterList"
                  ref={filterListRef}
                  onScroll={handleFilterListScroll}
                >
                  <div className="menuFilterItem">
                    <motion.button
                      className={`menuFilterButton ${
                        activeFilter === "all" ? "menuFilterButtonActive" : ""
                      }`}
                      onClick={() => handleFilterClick("all")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t("menu.all")}
                    </motion.button>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="menuFilterItem">
                      <motion.button
                        className={`menuFilterButton ${
                          activeFilter === category
                            ? "menuFilterButtonActive"
                            : ""
                        }`}
                        onClick={() => handleFilterClick(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {menuItems[category]?.name?.[i18n.language] ||
                          menuItems[category]?.name?.en ||
                          category}
                      </motion.button>
                    </div>
                  ))}
                </div>
                <button
                  className={`scrollButton scrollButtonNext ${
                    scrolled >= maxScroll - 1 ? "scrollButtonDisabled" : ""
                  }`}
                  onClick={() => handleScroll("next")}
                  disabled={scrolled >= maxScroll - 1}
                  aria-label="Scroll right"
                >
                  <IoIosArrowForward fontSize="24px" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="container menuContent">
        {isLoading ? (
          <p></p>
        ) : visibleItems.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + searchTerm}
              className="menuGrid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {visibleItems.slice(0, itemsToShow).map((item) => (
                <motion.div
                  key={`${item.id || Math.random().toString(36).substr(2, 9)}`}
                  className="menuItem"
                  variants={itemVariants}
                >
                  <div className="menuItemCard">
                    <div className="menuItemImage">
                      <img
                        src={`/assets/menu/${item.image_url}`} 
                        alt={
                          item.name?.[i18n.language] ||
                          item.name?.en ||
                          "Menu item"
                        } 
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />

                      <div className="menuItemCategoryBadge">
                        {item.category?.[i18n.language] ||
                          item.category?.en ||
                          ""}
                      </div>
                    </div>
                    <div className="menuItemContent">
                      <h4 className="menuItemTitle">
                        {item.name?.[i18n.language] ||
                          item.name?.en ||
                          "Unnamed item"}
                      </h4>
                      <p className="menuItemDescription">
                        {item.description?.[i18n.language] ||
                          item.description?.en ||
                          ""}
                      </p>
                      <div className="menuItemFooter">
                        <span className="menuItemPrice">
                          {item.price?.toFixed(2) || "0.00"}₼
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="noResultsFound">
            <h3>{t("menu.noResults")}</h3>
            <p>{t("menu.tryDifferentSearch")}</p>
            <button className="resetFilterButton" onClick={clearSearch}>
              {t("menu.clearSearch")}
            </button>
          </div>
        )}
        {hasMore && !isLoading && visibleItems.length > 0 && (
          <div className="menuLoadMore">
            <motion.button
              className="loadMoreButton"
              onClick={loadMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("menu.loadMore")}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
