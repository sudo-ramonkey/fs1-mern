import React, { useState } from 'react';
import { Button } from '@carbon/react';
import { ShoppingCart, View } from '@carbon/icons-react';
import useCart from '../../hooks/useCart';
import ProductModal from '../ProductModal/ProductModal';
import "./styles.css";

function ProductCard(props) {
    const { producto } = props;
    const { addItem, getItemQuantity } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const cartQuantity = getItemQuantity(producto?._id);
    
    if (!producto) {
        return null;
    }

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Evitar que se abra el modal
        addItem(producto);
    };

    return (
        <>
            <div className='instrument-card' onClick={handleCardClick}>
                <div className="instrument-card__image-container">
                    <img 
                        src={producto.imagenes?.[0] || '/placeholder-image.jpg'} 
                        alt={producto.nombre || 'Producto'} 
                        className='instrument-card__image' 
                    />
                    <div className="instrument-card__overlay">
                        <Button
                            kind="primary"
                            size="sm"
                            hasIconOnly
                            iconDescription="Ver detalles"
                            className="view-details-btn"
                        >
                            <View />
                        </Button>
                    </div>
                </div>
                
                <div className="instrument-card__content">
                    <h3 className='instrument-card__name'>{producto.nombre}</h3>
                    <p className='instrument-card__price'>
                        ${producto.precio ? producto.precio.toLocaleString() : 'N/A'}
                    </p>
                    <p className='instrument-card__description'>{producto.descripcion}</p>
                    
                    {producto.marca && (
                        <p className='instrument-card__brand'>{producto.marca}</p>
                    )}

                    <div className="instrument-card__actions">
                        <Button
                            kind="primary"
                            size="md"
                            onClick={handleAddToCart}
                            className="add-to-cart-btn"
                            disabled={producto.stock === 0}
                        >
                            <ShoppingCart />
                            {cartQuantity > 0 ? `En carrito (${cartQuantity})` : 'Agregar al carrito'}
                        </Button>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={producto}
            />
        </>
    );
}

export default ProductCard;