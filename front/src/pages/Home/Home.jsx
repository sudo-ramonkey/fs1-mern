import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Column, Tile } from '@carbon/react';
import { ArrowRight, ShoppingCatalog, Music, Trophy } from '@carbon/react/icons';
import { fetchProductosThunk, selectFilteredProducts } from '../../redux/slices/shopSlice';
import InstrumentCard from '../../components/Cards/InstrumentCard';
import "./Home.css"

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productos = useSelector(selectFilteredProducts);
    
    // Obtener productos destacados (los primeros 6)
    const featuredProducts = useMemo(() => {
        return productos.slice(0, 6);
    }, [productos]);

    useEffect(() => {
        dispatch(fetchProductosThunk());
    }, [dispatch]);

    const handleViewAllProducts = () => {
        navigate('/productos');
    };

    return (
        <div className="home-landing-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>El Mundo de las Guitarras</h1>
                    <p>Descubre nuestra colección de instrumentos musicales de la más alta calidad. 
                       Desde guitarras clásicas hasta equipos profesionales de audio.</p>
                    <div className="hero-actions">                        <Button 
                            kind="primary" 
                            size="lg" 
                            renderIcon={ShoppingCatalog}
                            onClick={handleViewAllProducts}
                        >
                            Ver Todos los Productos
                        </Button>
                        <Button 
                            kind="tertiary" 
                            size="lg"
                        >
                            Conoce Más
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <Grid>
                    <Column lg={16}>
                        <h2 className="section-title">¿Por qué elegir El Mundo Guitarras?</h2>
                    </Column>
                    <Column lg={5} md={4} sm={4}>
                        <Tile className="feature-tile">
                            <Music className="feature-icon" />
                            <h3>Calidad Premium</h3>
                            <p>Instrumentos seleccionados de las mejores marcas del mundo.</p>
                        </Tile>
                    </Column>
                    <Column lg={5} md={4} sm={4}>
                        <Tile className="feature-tile">
                            <Trophy className="feature-icon" />
                            <h3>Experiencia</h3>
                            <p>Más de 20 años ofreciendo instrumentos musicales de excelencia.</p>
                        </Tile>
                    </Column>
                    <Column lg={6} md={8} sm={4}>                        <Tile className="feature-tile">
                            <ShoppingCatalog className="feature-icon" />
                            <h3>Variedad</h3>
                            <p>Amplio catálogo con guitarras, accesorios y equipos de audio.</p>
                        </Tile>
                    </Column>
                </Grid>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2 className="section-title">Productos Destacados</h2>
                    <Button 
                        kind="ghost" 
                        renderIcon={ArrowRight}
                        onClick={handleViewAllProducts}
                    >
                        Ver todos
                    </Button>
                </div>
                  <div className="featured-products-grid">
                    {featuredProducts.map((producto) => (
                        <InstrumentCard key={producto.id || producto._id} article={producto} />
                    ))}
                </div>
                
                {featuredProducts.length === 0 && (
                    <div className="no-products">
                        <h3>Cargando productos destacados...</h3>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <Grid>
                    <Column lg={10} md={6} sm={4}>
                        <div className="cta-content">
                            <h2>¿Listo para encontrar tu instrumento perfecto?</h2>
                            <p>Explora nuestra colección completa y encuentra el instrumento que llevará tu música al siguiente nivel.</p>
                            <Button 
                                kind="primary" 
                                size="lg"
                                renderIcon={ArrowRight}
                                onClick={handleViewAllProducts}
                            >
                                Explorar Catálogo
                            </Button>
                        </div>
                    </Column>
                    <Column lg={6} md={2} sm={4}>
                        <div className="cta-image">
                            {/* Aquí podrías agregar una imagen */}
                        </div>
                    </Column>
                </Grid>
            </section>
        </div>
    );
};

export default Home;