import React, { useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@carbon/react';
import {
  Search as SearchIcon,
  ShoppingCart,
  User,
  Menu,
  Notification,
} from '@carbon/react/icons';
import { setSearchText } from '../../redux/slices/shopSlice';
import { toggleCart, selectCartTotalItems } from '../../redux/slices/cartSlice';
import HeaderTooltip from './HeaderTooltip';
import CartDrawer from '../CartDrawer/CartDrawer';
import './AppHeaderstyles.css';

const AppHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { categories, filters } = useSelector(state => state.shop);
  const cartTotalItems = useSelector(selectCartTotalItems);

  const handleSearchChange = useCallback((event) => {
    dispatch(setSearchText(event.target.value));
  }, [dispatch]);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handleNavigation = (href) => {
    // Aquí puedes implementar navegación con React Router en el futuro
    window.location.href = href;
  };

  return (
    <Header aria-label="Tienda de Instrumentos Musicales" className="modern-header">
      <HeaderMenuButton
        aria-label="Abrir menú"
        onClick={() => setMenuOpen(!menuOpen)}
        isActive={menuOpen}
        className="header-menu-button"
      />
      
      <HeaderName href="/" prefix="" className="header-logo">
        🎵 MusicStore
      </HeaderName>

      <HeaderNavigation aria-label="Navegación principal" className="header-navigation">
        <HeaderMenuItem href="/">Inicio</HeaderMenuItem>
        
        {/* Menús de categorías dinámicos */}
        {categories && categories.slice(0, 4).map(category => (
          <HeaderMenu
            key={category.id}
            aria-label={category.name}
            menuLinkName={category.name}
            className="header-category-menu"
          >
            <HeaderMenuItem href={`/category/${category.id}`}>
              Ver todos
            </HeaderMenuItem>
            <HeaderMenuItem href={`/category/${category.id}/featured`}>
              Destacados
            </HeaderMenuItem>
            <HeaderMenuItem href={`/category/${category.id}/offers`}>
              Ofertas
            </HeaderMenuItem>
          </HeaderMenu>
        ))}
        
        <HeaderMenuItem href="/ofertas">Ofertas</HeaderMenuItem>
        <HeaderMenuItem href="/contacto">Contacto</HeaderMenuItem>
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

        {/* Notificaciones */}
        <HeaderGlobalAction
          aria-label="Notificaciones"
          className="header-notifications"
        >
          <Notification size={20} />
          <span className="notification-badge">3</span>
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
        <HeaderGlobalAction
          aria-label="Cuenta de usuario"
          className="header-user"
        >
          <User size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      {/* Barra de búsqueda expandible */}
      {searchOpen && (
        <div className="header-search-bar">
          <Search
            size="lg"
            placeholder="Buscar instrumentos, accesorios..."
            labelText=""
            value={filters?.searchText || ''}
            onChange={handleSearchChange}
            onClear={() => dispatch(setSearchText(''))}
            className="header-search-input"
          />
          <Button
            kind="primary"
            size="md"
            onClick={() => setSearchOpen(false)}
            className="search-close-btn"
          >
            Buscar
          </Button>
        </div>
      )}

      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <nav className="mobile-navigation">
              <a href="/" className="mobile-nav-item">Inicio</a>
              {categories && categories.map(category => (
                <HeaderTooltip 
                  key={category.id} 
                  name={category.name} 
                  categoryData={category}
                  mobile={true}
                />
              ))}
              <a href="/ofertas" className="mobile-nav-item">Ofertas</a>
              <a href="/contacto" className="mobile-nav-item">Contacto</a>
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