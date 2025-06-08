import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button } from '@carbon/react';
import { ShoppingCart, Add, Subtract } from '@carbon/icons-react';
import { useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, product, onProductChange }) => {
    const { addMultipleItems, getItemQuantity } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    // Solo obtener productos para relacionados cuando el modal está abierto
    const productos = useSelector(state => isOpen ? state.shop.productos : []);
    
    // Solo calcular cartQuantity cuando el modal está abierto
    const cartQuantity = isOpen ? getItemQuantity(product?._id) : 0;
    
    // Calcular productos relacionados solo cuando es necesario
    const relatedProducts = useMemo(() => {
        if (!isOpen || !product || !productos.length) return [];
        
        return productos
            .filter(p => 
                p._id !== product._id && 
                (p.categoriaProducto === product.categoriaProducto || p.marca === product.marca)
            )
            .slice(0, 4);
    }, [isOpen, product, productos]);

    // Resetear estado cuando cambie el producto
    useEffect(() => {
        if (product) {
            setSelectedImage(0);
            setQuantity(1);
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addMultipleItems(product, quantity);
        setQuantity(1);
    };

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const handleRelatedProductClick = (relatedProduct) => {
        if (onProductChange) {
            onProductChange(relatedProduct);
        }
    };

    const images = product.imagenes || ['/placeholder-image.jpg'];

    return (
        <Modal
            open={isOpen}
            onRequestClose={onClose}
            modalHeading="Detalles del Producto"
            passiveModal={true}
            size="lg"
            className="product-modal"
        >
            <div className="product-modal__content">
                <div className="product-modal__images">
                    <div className="product-modal__main-image">
                        <img 
                            src={images[selectedImage]} 
                            alt={product.nombre}
                            className="product-modal__image"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="product-modal__thumbnails">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.nombre} - ${index + 1}`}
                                    className={`product-modal__thumbnail ${
                                        selectedImage === index ? 'active' : ''
                                    }`}
                                    onClick={() => setSelectedImage(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-modal__details">
                    <div className="product-modal__header">
                        <h2 className="product-modal__title">{product.nombre}</h2>
                        <div className="product-modal__price">
                            ${product.precio?.toLocaleString() || 'N/A'}
                        </div>
                    </div>

                    <div className="product-modal__info">
                        {product.marca && (
                            <div className="product-modal__brand">
                                <strong>Marca:</strong> {product.marca}
                            </div>
                        )}
                        
                        {product.categoriaProducto && (
                            <div className="product-modal__category">
                                <strong>Categoría:</strong> {product.categoriaProducto}
                            </div>
                        )}

                        {product.descripcion && (
                            <div className="product-modal__description">
                                <strong>Descripción:</strong>
                                <p>{product.descripcion}</p>
                            </div>
                        )}

                        {product.especificaciones && (
                            <div className="product-modal__specifications">
                                <strong>Especificaciones:</strong>
                                <ul>
                                    {Object.entries(product.especificaciones).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.stock !== undefined && (
                            <div className="product-modal__stock">
                                <strong>Stock disponible:</strong> {product.stock} unidades
                            </div>
                        )}
                    </div>

                    <div className="product-modal__actions">
                        <div className="product-modal__quantity">
                            <label htmlFor="quantity">Cantidad:</label>
                            <div className="quantity-control">
                                <Button
                                    kind="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    hasIconOnly
                                    iconDescription="Disminuir cantidad"
                                >
                                    <Subtract />
                                </Button>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max={product.stock || 999}
                                    className="quantity-input"
                                />
                                <Button
                                    kind="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={product.stock === 0 || (product.stock && quantity >= product.stock)}
                                    hasIconOnly
                                    iconDescription="Aumentar cantidad"
                                >
                                    <Add />
                                </Button>
                            </div>
                        </div>

                        {cartQuantity > 0 && (
                            <div className="product-modal__cart-status">
                                Ya tienes {cartQuantity} unidad(es) en el carrito
                            </div>
                        )}

                        <Button
                            kind="primary"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="add-to-cart-btn"
                        >
                            <ShoppingCart />
                            Agregar al Carrito ({quantity})
                        </Button>
                    </div>
                </div>
                
                {/* Productos relacionados - solo se renderiza si hay productos */}
                {relatedProducts.length > 0 && (
                    <div className="product-modal__related">
                        <div className="product-modal__related-header">
                            <h3>Productos relacionados</h3>
                            <p>También te puede interesar</p>
                        </div>
                        <div className="product-modal__related-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <div 
                                    key={relatedProduct._id} 
                                    className="product-modal__related-item"
                                    onClick={() => handleRelatedProductClick(relatedProduct)}
                                >
                                    {/* Badge de nuevo producto si es reciente */}
                                    {new Date(relatedProduct.createdAt || Date.now()) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                        <div className="product-badge">Nuevo</div>
                                    )}
                                    
                                    <img 
                                        src={relatedProduct.imagenes?.[0] || '/placeholder-image.jpg'} 
                                        alt={relatedProduct.nombre}
                                        className="related-product-image"
                                    />
                                    <div className="related-product-info">
                                        <h4 className="related-product-name">{relatedProduct.nombre}</h4>
                                        <p className="related-product-price">
                                            ${relatedProduct.precio?.toLocaleString()}
                                        </p>
                                        <p className="related-product-brand">{relatedProduct.marca}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ProductModal;