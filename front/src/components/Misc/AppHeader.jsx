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
  OverflowMenu,
  OverflowMenuItem,
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
import HeaderTooltip from "./HeaderTooltip";
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
  const { categories, filters, loading } = useSelector((state) => state.shop);
  const cartTotalItems = useSelector(selectCartTotalItems);
  const { isAuthenticated, user } = useSelector(selectAuth);

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
        <HeaderMenuItem onClick={() => handleNavigation("/")}>
          Inicio
        </HeaderMenuItem>
        <HeaderMenuItem onClick={() => handleNavigation("/productos")}>
          Productos
        </HeaderMenuItem>

        {/* Menús de categorías dinámicos */}
        {loading ? (
          <div className="categories-loading">
            <Loading small={true} withOverlay={false} />
          </div>
        ) : (
          categories &&
          categories.slice(0, 4).map((category) => (
            <HeaderMenu
              key={category.id}
              aria-label={`Categoría ${category.name}`}
              menuLinkName={category.name}
              className="header-category-menu"
            >
              <HeaderMenuItem
                onClick={() => handleNavigation(`/category/${category.id}`)}
              >
                📋 Ver todos
              </HeaderMenuItem>
              <HeaderMenuItem
                onClick={() =>
                  handleNavigation(`/category/${category.id}/featured`)
                }
              >
                ⭐ Destacados
              </HeaderMenuItem>
              <HeaderMenuItem
                onClick={() =>
                  handleNavigation(`/category/${category.id}/offers`)
                }
              >
                🔥 Ofertas
              </HeaderMenuItem>
            </HeaderMenu>
          ))
        )}

        <HeaderMenuItem onClick={() => handleNavigation("/ofertas")}>
          Ofertas
        </HeaderMenuItem>
        <HeaderMenuItem onClick={() => handleNavigation("/contacto")}>
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
                onClick={() => {
                  handleNavigation("/");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Ir a inicio"
              >
                🏠 Inicio
              </button>
              <button
                onClick={() => {
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
                categories &&
                categories.map((category) => (
                  <HeaderTooltip
                    key={category.id}
                    name={category.name}
                    categoryData={category}
                    mobile={true}
                  />
                ))
              )}
              <button
                onClick={() => {
                  handleNavigation("/ofertas");
                  setMenuOpen(false);
                }}
                className="mobile-nav-item"
                aria-label="Ver ofertas especiales"
              >
                🔥 Ofertas
              </button>
              <button
                onClick={() => {
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
