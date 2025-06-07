import React, { useState } from 'react';
import { Modal, Button } from '@carbon/react';
import { ShoppingCart, Add, Subtract } from '@carbon/icons-react';
import useCart from '../../hooks/useCart';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, product }) => {
    const { addMultipleItems, getItemQuantity } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const cartQuantity = getItemQuantity(product?._id);

    if (!product) return null;

    const handleAddToCart = () => {
        addMultipleItems(product, quantity);
        setQuantity(1);
        // Opcional: cerrar el modal después de agregar al carrito
        // onClose();
    };

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            setQuantity(value);
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
                                    disabled={product.stock && quantity >= product.stock}
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
            </div>
        </Modal>
    );
};

export default ProductModal;
