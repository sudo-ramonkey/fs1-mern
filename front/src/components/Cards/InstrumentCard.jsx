import React, { useState, useEffect } from 'react';
import { Button } from '@carbon/react';
import { ShoppingCart, View } from '@carbon/icons-react';
import useCart from '../../hooks/useCart';
import ProductModal from '../ProductModal/ProductModal';
import "./styles.css";

function ProductCard(props) {
    const { article, producto } = props;
    // Usar article si está disponible, sino usar producto como fallback
    const item = article || producto;
    const { addItem, getItemQuantity } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(item);
    
    // Solo calcular cartQuantity cuando sea necesario para evitar renders innecesarios
    const cartQuantity = isModalOpen ? getItemQuantity(item?._id) : 0;
    
    // Actualizar currentProduct cuando cambie el item
    useEffect(() => {
        setCurrentProduct(item);
    }, [item]);
    
    if (!item) {
        return null;
    }

    const handleCardClick = () => {
        setCurrentProduct(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleProductChange = (newProduct) => {
        setCurrentProduct(newProduct);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Evitar que se abra el modal
        addItem(item);
    };

    return (
        <>
            <div className='instrument-card' onClick={handleCardClick}>
                <div className="instrument-card__image-container">
                    <img 
                        src={item.imagenes?.[0] || '/placeholder-image.jpg'} 
                        alt={item.nombre || 'Producto'} 
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
                    <h3 className='instrument-card__name'>{item.nombre}</h3>
                    <p className='instrument-card__price'>
                        ${item.precio ? item.precio.toLocaleString() : 'N/A'}
                    </p>
                    <p className='instrument-card__description'>{item.descripcion}</p>
                    
                    {item.marca && (
                        <p className='instrument-card__brand'>{item.marca}</p>
                    )}

                    <div className="instrument-card__actions">
                        <Button
                            kind="primary"
                            size="md"
                            onClick={handleAddToCart}
                            className="add-to-cart-btn"
                            disabled={item.stock === 0}
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
                product={currentProduct}
                onProductChange={handleProductChange}
            />
        </>
    );
}

export default ProductCard;