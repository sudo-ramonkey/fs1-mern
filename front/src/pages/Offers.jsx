import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  Tile,
  Button,
  Loading,
  Section,
  Heading,
} from '@carbon/react';
import {
  Tag as TagIcon,
  Time,
  Star,
  ShoppingCart,
} from '@carbon/react/icons';
import { fetchProductosThunk, selectFilteredProducts } from '../redux/slices/shopSlice';
import { addToCart } from '../redux/slices/cartSlice';
import InstrumentCard from '../components/Cards/InstrumentCard';
import './Offers.css';

const Offers = () => {
  const dispatch = useDispatch();
  const productos = useSelector(selectFilteredProducts);
  const loading = useSelector(state => state.shop.loading);
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [regularOffers, setRegularOffers] = useState([]);

  useEffect(() => {
    dispatch(fetchProductosThunk());
  }, [dispatch]);

  useEffect(() => {
    if (productos && productos.length > 0) {
      // Simulate offers by filtering products with discounts or creating mock offers
      const allOffers = productos.filter(product => 
        product.precio < 1000 || product.nombre.toLowerCase().includes('guitarra')
      );
      
      // Split into featured and regular offers
      setFeaturedOffers(allOffers.slice(0, 3));
      setRegularOffers(allOffers.slice(3));
    }
  }, [productos]);
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.nombre,
      price: product.precio,
      image: product.imagen || '/api/placeholder/300/300',
      quantity: 1
    }));
  };

  if (loading) {
    return (
      <div className="offers-loading">
        <Loading description="Cargando ofertas..." />
      </div>
    );
  }

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <Section className="offers-hero">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="hero-content">
              <div className="hero-icon">
                <TagIcon size={48} />
              </div>
              <Heading className="hero-title">
                🔥 Ofertas Especiales
              </Heading>
              <p className="hero-description">
                Descubre los mejores descuentos en instrumentos musicales. 
                ¡Ofertas limitadas por tiempo!
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{featuredOffers.length + regularOffers.length}</span>
                  <span className="stat-label">Ofertas activas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50%</span>
                  <span className="stat-label">Descuento máximo</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">⏰</span>
                  <span className="stat-label">Tiempo limitado</span>
                </div>
              </div>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* Breadcrumb */}
      <Section className="offers-breadcrumb">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Breadcrumb>
              <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>Ofertas</BreadcrumbItem>
            </Breadcrumb>
          </Column>
        </Grid>
      </Section>

      {/* Featured Offers */}
      {featuredOffers.length > 0 && (
        <Section className="featured-offers">
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className="section-header">
                <Heading className="section-title">
                  ⭐ Ofertas Destacadas
                </Heading>
                <p className="section-subtitle">
                  Las mejores ofertas seleccionadas especialmente para ti
                </p>
              </div>
            </Column>
          </Grid>
          <Grid className="featured-offers-grid">
            {featuredOffers.map((product, index) => (
              <Column key={product._id} lg={5} md={4} sm={4} className="featured-offer-col">
                <Tile className="featured-offer-card">
                  <div className="offer-badge">
                    <Tag type="red" size="sm">
                      <Star size={16} />
                      Destacada
                    </Tag>
                  </div>                  <div className="offer-image">
                    <img 
                      src={product.imagen || '/api/placeholder/300/300'} 
                      alt={product.nombre}
                      loading="lazy"
                    />
                  </div>
                  <div className="offer-content">
                    <h3 className="offer-title">{product.nombre}</h3>
                    <p className="offer-description">
                      {product.descripcion?.substring(0, 100)}...
                    </p>
                    <div className="offer-pricing">
                      <span className="original-price">${(product.precio * 1.3).toFixed(2)}</span>
                      <span className="offer-price">${product.precio}</span>
                      <span className="discount-badge">-23%</span>
                    </div>
                    <div className="offer-timer">
                      <Time size={16} />
                      <span>Oferta válida por tiempo limitado</span>
                    </div>
                    <Button
                      kind="primary"
                      size="md"
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      renderIcon={ShoppingCart}
                    >
                      Agregar al Carrito
                    </Button>
                  </div>
                </Tile>
              </Column>
            ))}
          </Grid>
        </Section>
      )}

      {/* Regular Offers */}
      {regularOffers.length > 0 && (
        <Section className="regular-offers">
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className="section-header">
                <Heading className="section-title">
                  🎯 Más Ofertas
                </Heading>
                <p className="section-subtitle">
                  Encuentra más productos con descuentos especiales
                </p>
              </div>
            </Column>
          </Grid>
          <Grid className="offers-grid">            {regularOffers.map((product) => (
              <Column key={product._id} lg={4} md={4} sm={4} className="offer-col">
                <InstrumentCard 
                  article={product}
                />
              </Column>
            ))}
          </Grid>
        </Section>
      )}

      {/* Newsletter Signup */}
      <Section className="offers-newsletter">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Tile className="newsletter-tile">
              <div className="newsletter-content">
                <Heading className="newsletter-title">
                  📧 ¡No te pierdas nuestras ofertas!
                </Heading>
                <p className="newsletter-description">
                  Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu email.
                </p>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Tu email aquí..."
                    className="newsletter-input"
                  />
                  <Button kind="primary" size="md">
                    Suscribirse
                  </Button>
                </div>
              </div>
            </Tile>
          </Column>
        </Grid>
      </Section>
    </div>
  );
};

export default Offers;
