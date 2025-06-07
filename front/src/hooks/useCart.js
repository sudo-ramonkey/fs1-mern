import { useDispatch, useSelector } from 'react-redux';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    selectCartItems,
    selectCartTotalItems,
    selectCartTotalPrice,
    selectCartIsOpen,
    selectCartItemById,
    selectCartItemQuantity
} from '../redux/slices/cartSlice';

export const useCart = () => {
    const dispatch = useDispatch();
    
    // Selectores
    const items = useSelector(selectCartItems);
    const totalItems = useSelector(selectCartTotalItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const isOpen = useSelector(selectCartIsOpen);

    // Acciones
    const addItem = (product) => dispatch(addToCart(product));
    const removeItem = (productId) => dispatch(removeFromCart(productId));
    const updateItemQuantity = (productId, quantity) => dispatch(updateQuantity({ productId, quantity }));
    const clearAllItems = () => dispatch(clearCart());
    const toggleCartDrawer = () => dispatch(toggleCart());
    const openCartDrawer = () => dispatch(openCart());
    const closeCartDrawer = () => dispatch(closeCart());

    // Funciones de utilidad
    const getItemQuantity = (productId) => {
        const item = items.find(item => item._id === productId);
        return item ? item.quantity : 0;
    };

    const hasItem = (productId) => {
        return items.some(item => item._id === productId);
    };

    const getItemById = (productId) => {
        return items.find(item => item._id === productId);
    };

    const addMultipleItems = (product, quantity = 1) => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    const incrementItem = (productId) => {
        const currentQuantity = getItemQuantity(productId);
        updateItemQuantity(productId, currentQuantity + 1);
    };

    const decrementItem = (productId) => {
        const currentQuantity = getItemQuantity(productId);
        if (currentQuantity > 1) {
            updateItemQuantity(productId, currentQuantity - 1);
        } else {
            removeItem(productId);
        }
    };

    return {
        // Estado
        items,
        totalItems,
        totalPrice,
        isOpen,
        
        // Acciones básicas
        addItem,
        removeItem,
        updateItemQuantity,
        clearAllItems,
        
        // Control del drawer
        toggleCartDrawer,
        openCartDrawer,
        closeCartDrawer,
        
        // Funciones de utilidad
        getItemQuantity,
        hasItem,
        getItemById,
        addMultipleItems,
        incrementItem,
        decrementItem,
        
        // Estado calculado
        isEmpty: totalItems === 0,
        hasItems: totalItems > 0
    };
};

export default useCart;
