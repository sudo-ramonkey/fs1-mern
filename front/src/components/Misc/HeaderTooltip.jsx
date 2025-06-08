import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconButton, Popover, PopoverContent, Button } from '@carbon/react';
import { ChevronDownOutline, ArrowRight, Star, Tag } from '@carbon/icons-react';
import "./HeaderTooltip.css";

function HeaderTooltip({ name, categoryData, mobile = false }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { productos = [] } = useSelector(state => state.shop);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Filtrar productos por categoría
    const categoryProducts = productos.filter(product => 
        product.categoriaProducto === categoryData?.name || 
        product.categoriaProducto === name
    ).slice(0, 5); // Mostrar solo los primeros 5

    // Obtener marcas únicas de la categoría
    const categoryBrands = [...new Set(
        categoryProducts.map(product => product.marca).filter(Boolean)
    )].slice(0, 4);

    const handleNavigation = (path) => {
        setOpen(false);
        navigate(path);
    };

    if (mobile) {
        return (
            <div className="mobile-category-item">
                <button 
                    className="mobile-category-button"
                    onClick={() => setOpen(!open)}
                >
                    <span>{name}</span>
                    <ChevronDownOutline 
                        className={`mobile-chevron ${open ? 'open' : ''}`} 
                    />
                </button>
                {open && (
                    <div className="mobile-category-submenu">
                        <button 
                            className="mobile-submenu-item"
                            onClick={() => handleNavigation(`/category/${name}`)}
                        >
                            Ver todos
                        </button>
                        <button 
                            className="mobile-submenu-item"
                            onClick={() => handleNavigation(`/category/${name}/featured`)}
                        >
                            Destacados
                        </button>
                        <button 
                            className="mobile-submenu-item"
                            onClick={() => handleNavigation(`/category/${name}/offers`)}
                        >
                            Ofertas
                        </button>
                        {categoryBrands.map(brand => (
                            <button 
                                key={brand}
                                className="mobile-submenu-item brand-item"
                                onClick={() => handleNavigation(`/brand/${brand}`)}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="header-tooltip-container"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
        >
            <Popover
                align="bottom-left"
                isTabTip
                open={open}
                onRequestClose={handleClose}
                className="category-popover"
            >
                <div className="category-trigger">
                    <span className="category-name">{name}</span>
                    <IconButton
                        size="sm"
                        className="category-chevron"
                        tabIndex={-1}
                    >
                        <ChevronDownOutline />
                    </IconButton>
                </div>
                
                <PopoverContent className="category-dropdown">
                    <div className="dropdown-content">
                        {/* Header de la categoría */}
                        <div className="dropdown-header">
                            <h3 className="category-title">{name}</h3>
                            <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={ArrowRight}
                                onClick={() => handleNavigation(`/category/${name}`)}
                                className="view-all-btn"
                            >
                                Ver todos
                            </Button>
                        </div>

                        <div className="dropdown-grid">
                            {/* Enlaces rápidos */}
                            <div className="quick-links">
                                <h4 className="section-title">Enlaces rápidos</h4>
                                <ul className="link-list">
                                    <li>
                                        <button 
                                            className="dropdown-link featured"
                                            onClick={() => handleNavigation(`/category/${name}/featured`)}
                                        >
                                            <Star size={16} />
                                            Destacados
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-link offers"
                                            onClick={() => handleNavigation(`/category/${name}/offers`)}
                                        >
                                            <Tag size={16} />
                                            Ofertas especiales
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-link"
                                            onClick={() => handleNavigation(`/category/${name}/new`)}
                                        >
                                            <ArrowRight size={16} />
                                            Nuevos productos
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Marcas populares */}
                            {categoryBrands.length > 0 && (
                                <div className="popular-brands">
                                    <h4 className="section-title">Marcas populares</h4>
                                    <ul className="brand-list">
                                        {categoryBrands.map(brand => (
                                            <li key={brand}>
                                                <button 
                                                    className="brand-link"
                                                    onClick={() => handleNavigation(`/brand/${brand}`)}
                                                >
                                                    {brand}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Productos destacados */}
                            {categoryProducts.length > 0 && (
                                <div className="featured-products">
                                    <h4 className="section-title">Productos destacados</h4>
                                    <div className="product-preview-list">
                                        {categoryProducts.slice(0, 3).map(product => (
                                            <div 
                                                key={product._id || product.nombre}
                                                className="product-preview"
                                                onClick={() => handleNavigation(`/product/${product._id}`)}
                                            >
                                                <div className="product-info">
                                                    <span className="product-name">{product.nombre}</span>
                                                    <span className="product-brand">{product.marca}</span>
                                                    <span className="product-price">
                                                        ${product.precio?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default HeaderTooltip;