import React from 'react';
import { Button } from '@carbon/react';
import { 
    ShoppingCart, 
    Close, 
    Add, 
    Subtract, 
    TrashCan 
} from '@carbon/icons-react';
import useCart from '../../hooks/useCart';
import './CartDrawer.css';

const CartDrawer = () => {
    const {
        items,
        totalItems,
        totalPrice,
        isOpen,
        closeCartDrawer,
        updateItemQuantity,
        removeItem,
        clearAllItems,
        isEmpty
    } = useCart();

    const handleCheckout = () => {
        // Aquí puedes implementar la lógica de checkout
        alert('Funcionalidad de checkout en desarrollo');
    };

    // Prevent body scroll when drawer is open on mobile
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    // Handle overlay click with better touch support
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeCartDrawer();
        }
    };

    // Handle touch events for better mobile experience
    const handleTouchStart = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="cart-drawer__overlay" 
                    onClick={handleOverlayClick}
                    onTouchStart={handleTouchStart}
                    aria-hidden="true"
                />
            )}
            
            {/* Drawer */}
            <div 
                className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
                onTouchStart={handleTouchStart}
            >
                <div className="cart-drawer__header">
                    <div className="cart-drawer__title">
                        <ShoppingCart />
                        <h2>Carrito de Compras ({totalItems})</h2>
                    </div>
                    <Button
                        kind="ghost"
                        size="sm"
                        onClick={closeCartDrawer}
                        hasIconOnly
                        iconDescription="Cerrar carrito"
                        className="cart-drawer__close"
                    >
                        <Close />
                    </Button>
                </div>

                <div className="cart-drawer__content">
                    {isEmpty ? (
                        <div className="cart-drawer__empty">
                            <ShoppingCart size={48} />
                            <p>Tu carrito está vacío</p>
                            <p className="cart-drawer__empty-subtitle">
                                Agrega productos para comenzar tu compra
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-drawer__items">
                                {items.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <div className="cart-item__image">
                                            <img 
                                                src={item.imagenes?.[0] || '/placeholder-image.jpg'} 
                                                alt={item.nombre}
                                            />
                                        </div>
                                        
                                        <div className="cart-item__details">
                                            <h3 className="cart-item__name">{item.nombre}</h3>
                                            {item.marca && (
                                                <p className="cart-item__brand">{item.marca}</p>
                                            )}
                                            <p className="cart-item__price">
                                                ${item.precio?.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="cart-item__actions">
                                            <div className="cart-item__quantity">
                                                <Button
                                                    kind="ghost"
                                                    size="sm"
                                                    onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    hasIconOnly
                                                    iconDescription="Disminuir cantidad"
                                                >
                                                    <Subtract />
                                                </Button>
                                                <span className="cart-item__quantity-value">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    kind="ghost"
                                                    size="sm"
                                                    onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                                                    hasIconOnly
                                                    iconDescription="Aumentar cantidad"
                                                >
                                                    <Add />
                                                </Button>
                                            </div>
                                            
                                            <Button
                                                kind="danger--ghost"
                                                size="sm"
                                                onClick={() => removeItem(item._id)}
                                                hasIconOnly
                                                iconDescription="Eliminar producto"
                                                className="cart-item__remove"
                                            >
                                                <TrashCan />
                                            </Button>
                                        </div>

                                        <div className="cart-item__total">
                                            ${(item.precio * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-drawer__footer">
                                <div className="cart-drawer__summary">
                                    <div className="cart-summary__row">
                                        <span>Subtotal ({totalItems} productos):</span>
                                        <span className="cart-summary__price">
                                            ${totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="cart-summary__row cart-summary__total">
                                        <span>Total:</span>
                                        <span className="cart-summary__price">
                                            ${totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="cart-drawer__actions">
                                    <Button
                                        kind="secondary"
                                        size="lg"
                                        onClick={clearAllItems}
                                        className="cart-action-btn"
                                    >
                                        Vaciar Carrito
                                    </Button>
                                    <Button
                                        kind="primary"
                                        size="lg"
                                        onClick={handleCheckout}
                                        className="cart-action-btn"
                                    >
                                        Proceder al Pago
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
