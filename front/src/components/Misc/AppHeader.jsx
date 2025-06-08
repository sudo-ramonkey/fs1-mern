import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@carbon/react';
import {
  Search as SearchIcon,
  ShoppingCart,
  User,
  Menu,
  UserAvatar,
  Logout,
  Edit,
} from '@carbon/react/icons';
import { setSearchText } from '../../redux/slices/shopSlice';
import { toggleCart, selectCartTotalItems } from '../../redux/slices/cartSlice';
import { selectAuth, logoutUser } from '../../redux/slices/authSlice';
import HeaderTooltip from './HeaderTooltip';
import CartDrawer from '../CartDrawer/CartDrawer';
import './AppHeaderstyles.css';

const AppHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, filters } = useSelector(state => state.shop);
  const cartTotalItems = useSelector(selectCartTotalItems);
  const { isAuthenticated, user } = useSelector(selectAuth);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearchChange = useCallback((event) => {
    dispatch(setSearchText(event.target.value));
  }, [dispatch]);  const handleSearchSubmit = useCallback(() => {
    // Close search bar and navigate to AllProducts page
    setSearchOpen(false);
    navigate('/productos');
  }, [navigate]);

  const handleSearchKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUserLogin = () => {
    navigate('/auth');
  };

  const handleUserLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
  };  const handleUserProfile = () => {
    navigate('/profile');
    setUserMenuOpen(false);
  };

  const handleAdminPanel = () => {
    // Navigate to admin panel - for now just close menu
    // You can implement the actual admin panel route later
    setUserMenuOpen(false);
    // navigate('/admin/productos'); // Uncomment when admin panel is ready
  };

  return (
    <Header aria-label="Tienda de Instrumentos Musicales" className="modern-header">
      <HeaderMenuButton
        aria-label="Abrir menú"
        onClick={() => setMenuOpen(!menuOpen)}
        isActive={menuOpen}
        className="header-menu-button"
      />
        <HeaderName onClick={() => handleNavigation('/')} prefix="" className="header-logo">
        🎵 MusicStore
      </HeaderName><HeaderNavigation aria-label="Navegación principal" className="header-navigation">
        <HeaderMenuItem onClick={() => handleNavigation('/')}>Inicio</HeaderMenuItem>
        <HeaderMenuItem onClick={() => handleNavigation('/productos')}>Productos</HeaderMenuItem>
        
        {/* Menús de categorías dinámicos */}
        {categories && categories.slice(0, 4).map(category => (
          <HeaderMenu
            key={category.id}
            aria-label={category.name}
            menuLinkName={category.name}
            className="header-category-menu"
          >
            <HeaderMenuItem onClick={() => handleNavigation(`/category/${category.id}`)}>
              Ver todos
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => handleNavigation(`/category/${category.id}/featured`)}>
              Destacados
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => handleNavigation(`/category/${category.id}/offers`)}>
              Ofertas
            </HeaderMenuItem>
          </HeaderMenu>
        ))}
        
        <HeaderMenuItem onClick={() => handleNavigation('/ofertas')}>Ofertas</HeaderMenuItem>
        <HeaderMenuItem onClick={() => handleNavigation('/contacto')}>Contacto</HeaderMenuItem>
      </HeaderNavigation>

      <HeaderGlobalBar className="header-global-bar">
        {/* Búsqueda */}
        <HeaderGlobalAction
          aria-label="Búsqueda"
          isActive={searchOpen}
          onClick={() => setSearchOpen(!searchOpen)}
          className="header-search-toggle"
        >
          <SearchIcon size={20} />
        </HeaderGlobalAction>

        {/* Carrito */}
        <HeaderGlobalAction
          aria-label="Carrito de compras"
          className="header-cart"
          onClick={handleCartClick}
        >
          <ShoppingCart size={20} />
          {cartTotalItems > 0 && (
            <span className="cart-badge">{cartTotalItems}</span>
          )}
        </HeaderGlobalAction>

        {/* Usuario */}
        {isAuthenticated ? (
          <div className="header-user-menu" ref={userMenuRef}>
            <HeaderGlobalAction
              aria-label="Menú de usuario"
              className="header-user authenticated"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
            
            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar">
                    <UserAvatar size={24} />
                  </div>
                  <div className="user-details">
                    <span className="user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>                <div className="user-actions">
                  <button 
                    className="user-action-btn"
                    onClick={handleUserProfile}
                  >
                    <User size={16} />
                    Mi Perfil
                  </button>
                    {/* Admin-only button */}
                  {user?.role === 'Admin' && (
                    <button 
                      className="user-action-btn admin"
                      onClick={handleAdminPanel}
                    >
                      <Edit size={16} />
                      Modificar Producto
                    </button>
                  )}
                  
                  <button 
                    className="user-action-btn logout"
                    onClick={handleUserLogout}
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
          >
            <User size={20} />
          </HeaderGlobalAction>
        )}
      </HeaderGlobalBar>

      {/* Barra de búsqueda expandible */}      {searchOpen && (
        <div className="header-search-bar">
          <Search
            size="lg"
            placeholder="Buscar instrumentos, accesorios..."
            labelText=""
            value={filters?.searchText || ''}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            onClear={() => dispatch(setSearchText(''))}
            className="header-search-input"
          />
          <Button
            kind="primary"
            size="md"
            onClick={handleSearchSubmit}
            className="search-close-btn"
          >
            Buscar
          </Button>
        </div>
      )}

      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">            <nav className="mobile-navigation">
              <button onClick={() => { handleNavigation('/'); setMenuOpen(false); }} className="mobile-nav-item">Inicio</button>
              <button onClick={() => { handleNavigation('/productos'); setMenuOpen(false); }} className="mobile-nav-item">Productos</button>
              {categories && categories.map(category => (
                <HeaderTooltip 
                  key={category.id} 
                  name={category.name} 
                  categoryData={category}
                  mobile={true}
                />
              ))}
              <button onClick={() => { handleNavigation('/ofertas'); setMenuOpen(false); }} className="mobile-nav-item">Ofertas</button>
              <button onClick={() => { handleNavigation('/contacto'); setMenuOpen(false); }} className="mobile-nav-item">Contacto</button>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </Header>
  );
};

export default AppHeader;