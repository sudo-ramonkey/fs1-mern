import React, { useRef, useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenu,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  Search,
  Button,
  Loading,
} from "@carbon/react";
import {
  Search as SearchIcon,
  ShoppingCart,
  User,
  Menu,
  UserAvatar,
  Logout,
  Edit,
  Close,
  NotificationNew,
} from "@carbon/react/icons";
import { setSearchText } from "../../redux/slices/shopSlice";
import { toggleCart, selectCartTotalItems } from "../../redux/slices/cartSlice";
import { selectAuth, logoutUser } from "../../redux/slices/authSlice";
import CartDrawer from "../CartDrawer/CartDrawer";
import "./AppHeaderstyles.css";

const AppHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filters, loading } = useSelector((state) => state.shop);
  const cartTotalItems = useSelector(selectCartTotalItems);
  const { isAuthenticated, user } = useSelector(selectAuth);

  // Define category structures based on product schemas
  const categoryStructure = {
    "Guitarras Electricas": {
      name: "Guitarras Eléctricas",
      icon: "🎸",
      subcategories: [
        { id: "Stratocaster", name: "Stratocaster", icon: "🎸" },
        { id: "Telecaster", name: "Telecaster", icon: "🎸" },
        { id: "Les Paul", name: "Les Paul", icon: "🎸" },
        { id: "SG", name: "SG", icon: "🎸" },
        { id: "Flying V", name: "Flying V", icon: "🎸" },
        { id: "Explorer", name: "Explorer", icon: "🎸" },
      ],
    },
    "Guitarras Acusticas": {
      name: "Guitarras Acústicas",
      icon: "🎼",
      subcategories: [
        { id: "Dreadnought", name: "Dreadnought", icon: "🎼" },
        { id: "Folk", name: "Folk", icon: "🎼" },
        { id: "Jazz", name: "Jazz", icon: "🎼" },
        { id: "Clásica", name: "Clásica", icon: "🎼" },
      ],
    },
    Bajos: {
      name: "Bajos",
      icon: "🎵",
      subcategories: [
        { id: "Jazz Bass", name: "Jazz Bass", icon: "🎵" },
        { id: "Precision Bass", name: "Precision Bass", icon: "🎵" },
        { id: "Active Bass", name: "Bajo Activo", icon: "🎵" },
        { id: "Acoustic Bass", name: "Bajo Acústico", icon: "🎵" },
      ],
    },
    Amplificadores: {
      name: "Amplificadores",
      icon: "🔊",
      subcategories: [
        { id: "Cabezal", name: "Cabezales", icon: "🔊" },
        { id: "Combo", name: "Combos", icon: "🔊" },
        { id: "Gabinete", name: "Gabinetes", icon: "🔊" },
        { id: "Tubos", name: "A Tubos", icon: "🔥" },
        { id: "Estado Sólido", name: "Estado Sólido", icon: "⚡" },
        { id: "Híbrido", name: "Híbridos", icon: "🔀" },
      ],
    },
    Efectos: {
      name: "Efectos",
      icon: "🎛️",
      subcategories: [
        { id: "Distorsión", name: "Distorsión", icon: "🔥" },
        { id: "Overdrive", name: "Overdrive", icon: "🌋" },
        { id: "Delay", name: "Delay", icon: "🔄" },
        { id: "Reverb", name: "Reverb", icon: "🌊" },
        { id: "Chorus", name: "Chorus", icon: "🌀" },
        { id: "Multiefectos", name: "Multiefectos", icon: "🎛️" },
      ],
    },
    Accesorios: {
      name: "Accesorios",
      icon: "🛠️",
      subcategories: [
        {
          id: "Cuerdas Guitarra Electrica",
          name: "Cuerdas Eléctricas",
          icon: "🎸",
        },
        {
          id: "Cuerdas Guitarra Acustica",
          name: "Cuerdas Acústicas",
          icon: "🎼",
        },
        { id: "Fundas & Estuches", name: "Fundas & Estuches", icon: "💼" },
        { id: "Pastillas", name: "Pastillas", icon: "🎤" },
        { id: "Puas", name: "Púas", icon: "🎯" },
        { id: "Cables", name: "Cables", icon: "🔌" },
        {
          id: "Afinadores & Metronomos",
          name: "Afinadores & Metrónomos",
          icon: "⏱️",
        },
        { id: "Capos", name: "Capos", icon: "🔒" },
      ],
    },
  };

  // Handle scroll effect and close menus on outside click
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Sync search value with Redux store
  useEffect(() => {
    setSearchValue(filters?.searchText || "");
  }, [filters?.searchText]);
  const handleSearchChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);
      dispatch(setSearchText(value));
    },
    [dispatch],
  );
  const handleSearchSubmit = useCallback(() => {
    if (searchValue.trim()) {
      setSearchOpen(false);
      navigate("/productos");
    }
  }, [navigate, searchValue]);

  const handleSearchToggle = useCallback(() => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      // Clear search when opening
      setSearchValue("");
      dispatch(setSearchText(""));
    }
  }, [searchOpen, dispatch]);

  const handleSearchKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit],
  );

  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUserLogin = () => {
    navigate("/auth");
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleUserLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
  };
  const handleUserProfile = () => {
    navigate("/profile");
    setUserMenuOpen(false);
  };

  const handleAdminPanel = () => {
    navigate("/admin");
    setUserMenuOpen(false);
  };

  // Handle category navigation with filters
  const handleCategoryNavigation = (categoryId, subcategoryId = null) => {
    // Build URL with query parameters
    const params = new URLSearchParams();
    params.set("category", categoryId);

    if (subcategoryId) {
      params.set("subcategory", subcategoryId);
    }

    // Navigate to products page with URL parameters using replace to prevent back-and-forth
    navigate(`/productos?${params.toString()}`, { replace: true });
  };

  return (
    <Header
      aria-label="Tienda de Instrumentos Musicales"
      className={`modern-header ${isScrolled ? "scrolled" : ""} ${searchOpen ? "search-active" : ""}`}
    >
      <HeaderMenuButton
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMenuOpen(!menuOpen)}
        isActive={menuOpen}
        className="header-menu-button"
      >
        {menuOpen ? <Close size={20} /> : <Menu size={20} />}
      </HeaderMenuButton>
      <HeaderName
        onClick={() => handleNavigation("/")}
        prefix=""
        className="header-logo"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}
      >
        <span className="logo-icon">🎸</span>
        <span className="logo-text">El Mundo de Las Guitarras</span>
      </HeaderName>
      <HeaderNavigation
        aria-label="Navegación principal"
        className="header-navigation"
      >
        <HeaderMenuItem
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
          Inicio
        </HeaderMenuItem>
        <HeaderMenuItem
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/productos");
          }}
        >
          Productos
        </HeaderMenuItem>
        {/* Menús de categorías dinámicos basados en schemas */}
        {loading ? (
          <div className="categories-loading">
            <Loading small={true} withOverlay={false} />
          </div>
        ) : (
          Object.entries(categoryStructure)
            .slice(0, 4)
            .map(([categoryId, categoryData]) => (
              <HeaderMenu
                key={categoryId}
                aria-label={`Categoría ${categoryData.name}`}
                menuLinkName={`${categoryData.icon} ${categoryData.name}`}
                className="header-category-menu"
              >
                {/* Main category actions */}
                <HeaderMenuItem
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryNavigation(categoryId);
                  }}
                  className="category-main-item"
                >
                  📋 Ver todos los {categoryData.name.toLowerCase()}
                </HeaderMenuItem>

                {/* Subcategories */}

                {categoryData.subcategories &&
                  categoryData.subcategories.length > 0 && (
                    <>
                      <div className="submenu-header" role="presentation">
                        🏷️ Por tipo:
                      </div>
                      {categoryData.subcategories
                        .slice(0, 8)
                        .map((subcategory) => (
                          <HeaderMenuItem
                            key={subcategory.id}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryNavigation(
                                categoryId,
                                subcategory.id,
                              );
                            }}
                            className="category-subcategory-item"
                          >
                            {subcategory.icon} {subcategory.name}
                          </HeaderMenuItem>
                        ))}
                      {categoryData.subcategories.length > 8 && (
                        <HeaderMenuItem
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryNavigation(categoryId);
                          }}
                          className="category-see-more"
                        >
                          ➡️ Ver todos los tipos
                        </HeaderMenuItem>
                      )}
                    </>
                  )}
              </HeaderMenu>
            ))
        )}

        <HeaderMenuItem
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/ofertas");
          }}
        >
          Ofertas
        </HeaderMenuItem>
        <HeaderMenuItem
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/contacto");
          }}
        >
          Contacto
        </HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar className="header-global-bar">
        {/* Búsqueda */}
        <HeaderGlobalAction
          aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
          isActive={searchOpen}
          onClick={handleSearchToggle}
          className={`header-search-toggle ${searchOpen ? "active" : ""}`}
          tooltipAlignment="end"
        >
          {searchOpen ? <Close size={20} /> : <SearchIcon size={20} />}
        </HeaderGlobalAction>

        {/* Carrito */}
        <HeaderGlobalAction
          aria-label={`Carrito de compras${cartTotalItems > 0 ? ` (${cartTotalItems} artículos)` : ""}`}
          className={`header-cart ${cartTotalItems > 0 ? "has-items" : ""}`}
          onClick={handleCartClick}
          tooltipAlignment="end"
        >
          <ShoppingCart size={20} />
          {cartTotalItems > 0 && (
            <span
              className="cart-badge"
              aria-label={`${cartTotalItems} artículos en el carrito`}
            >
              {cartTotalItems > 99 ? "99+" : cartTotalItems}
            </span>
          )}
        </HeaderGlobalAction>

        {/* Usuario */}
        {isAuthenticated ? (
          <div className="header-user-menu" ref={userMenuRef}>
            <HeaderGlobalAction
              aria-label={
                userMenuOpen
                  ? "Cerrar menú de usuario"
                  : "Abrir menú de usuario"
              }
              className={`header-user authenticated ${userMenuOpen ? "active" : ""}`}
              onClick={handleUserMenuToggle}
              tooltipAlignment="end"
              isActive={userMenuOpen}
            >
              <div className="user-avatar-container">
                <UserAvatar size={20} />
                {user?.role === "Admin" && (
                  <NotificationNew size={12} className="admin-indicator" />
                )}
              </div>
            </HeaderGlobalAction>

            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                <div className="user-info">
                  <div className="user-avatar">
                    <UserAvatar size={32} />
                    {user?.role === "Admin" && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="user-email">{user?.email}</span>
                    <span className="user-role">{user?.role}</span>
                  </div>
                </div>
                <div className="user-actions">
                  <button
                    className="user-action-btn"
                    onClick={handleUserProfile}
                    role="menuitem"
                  >
                    <User size={16} />
                    Mi Perfil
                  </button>
                  {/* Admin-only button */}
                  {user?.role === "Admin" && (
                    <button
                      className="user-action-btn admin"
                      onClick={handleAdminPanel}
                      role="menuitem"
                    >
                      <Edit size={16} />
                      Panel de Admin
                    </button>
                  )}

                  <button
                    className="user-action-btn logout"
                    onClick={handleUserLogout}
                    role="menuitem"
                  >
                    <Logout size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <HeaderGlobalAction
            aria-label="Iniciar sesión"
            className="header-user"
            onClick={handleUserLogin}
            tooltipAlignment="end"
          >
            <User size={20} />
          </HeaderGlobalAction>
        )}
      </HeaderGlobalBar>
      {/* Barra de búsqueda expandible */}
      {searchOpen && (
        <div className="header-search-bar" role="search">
          <Search
            ref={searchInputRef}
            size="lg"
            placeholder="Buscar instrumentos, accesorios, marcas..."
            labelText="Búsqueda"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            onClear={() => {
              setSearchValue("");
              dispatch(setSearchText(""));
            }}
            className="header-search-input"
            autoComplete="off"
            aria-describedby="search-help-text"
          />
          <div className="search-actions">
            <Button
              kind="primary"
              size="md"
              onClick={handleSearchSubmit}
              className="search-submit-btn"
              disabled={!searchValue.trim()}
            >
              <SearchIcon size={16} />
              Buscar
            </Button>
            <Button
              kind="ghost"
              size="md"
              onClick={handleSearchToggle}
              className="search-cancel-btn"
              aria-label="Cancelar búsqueda"
            >
              <Close size={16} />
            </Button>
          </div>
          <div id="search-help-text" className="search-help">
            Presiona Enter para buscar o Escape para cerrar
          </div>
        </div>
      )}
      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu" role="navigation" aria-label="Menú móvil">
          <div className="mobile-menu-content">
            <nav className="mobile-navigation">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Ir a inicio"
              >
                🏠 Inicio
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/productos");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Ver todos los productos"
              >
                🛍️ Productos
              </button>
              {loading ? (
                <div className="mobile-categories-loading">
                  <Loading small={true} withOverlay={false} />
                  <span>Cargando categorías...</span>
                </div>
              ) : (
                Object.entries(categoryStructure).map(
                  ([categoryId, categoryData]) => (
                    <div key={categoryId} className="mobile-category-section">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryNavigation(categoryId);
                          setMenuOpen(false);
                        }}
                        className="mobile-nav-item category-header"
                        aria-label={`Ver ${categoryData.name}`}
                      >
                        {categoryData.icon} {categoryData.name}
                      </button>

                      {/* Mobile subcategories */}
                      {categoryData.subcategories &&
                        categoryData.subcategories.length > 0 && (
                          <div className="mobile-subcategories">
                            {categoryData.subcategories
                              .slice(0, 4)
                              .map((subcategory) => (
                                <button
                                  key={subcategory.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCategoryNavigation(
                                      categoryId,
                                      subcategory.id,
                                    );
                                    setMenuOpen(false);
                                  }}
                                  className="mobile-nav-item subcategory"
                                  aria-label={`Ver ${subcategory.name}`}
                                >
                                  {subcategory.icon} {subcategory.name}
                                </button>
                              ))}
                            {categoryData.subcategories.length > 4 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryNavigation(categoryId);
                                  setMenuOpen(false);
                                }}
                                className="mobile-nav-item see-more"
                                aria-label={`Ver todos los ${categoryData.name.toLowerCase()}`}
                              >
                                ➡️ Ver más tipos
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  ),
                )
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/ofertas");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Ver ofertas especiales"
              >
                🔥 Ofertas
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/contacto");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Información de contacto"
              >
                📞 Contacto
              </button>
            </nav>
          </div>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
      {/* Cart Drawer */}
      <CartDrawer />
    </Header>
  );
};

export default AppHeader;
