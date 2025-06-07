import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartTotalItems, selectCartTotalPrice } from '../../redux/slices/cartSlice';

const CartSummary = ({ className = '' }) => {
    const totalItems = useSelector(selectCartTotalItems);
    const totalPrice = useSelector(selectCartTotalPrice);

    return (
        <div className={`cart-summary ${className}`}>
            <div className="cart-summary__items">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </div>
            <div className="cart-summary__price">
                ${totalPrice.toLocaleString()}
            </div>
        </div>
    );
};

export default CartSummary;
