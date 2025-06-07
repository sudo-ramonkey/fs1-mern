import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Array de productos en el carrito
    totalItems: 0,
    totalPrice: 0,
    isOpen: false // Para controlar si el drawer del carrito está abierto
};

// Función helper para calcular totales
const calculateTotals = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    return { totalItems, totalPrice };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item._id === product._id);
            
            if (existingItem) {
                // Si el producto ya existe, incrementar la cantidad
                existingItem.quantity += 1;
            } else {
                // Si es un producto nuevo, agregarlo con cantidad 1
                state.items.push({
                    ...product,
                    quantity: 1
                });
            }
            
            // Recalcular totales
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;
        },
        
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item._id !== productId);
            
            // Recalcular totales
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;
        },
        
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item._id === productId);
            
            if (item) {
                if (quantity <= 0) {
                    // Si la cantidad es 0 o menor, remover el producto
                    state.items = state.items.filter(item => item._id !== productId);
                } else {
                    item.quantity = quantity;
                }
                
                // Recalcular totales
                const totals = calculateTotals(state.items);
                state.totalItems = totals.totalItems;
                state.totalPrice = totals.totalPrice;
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
        
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        
        openCart: (state) => {
            state.isOpen = true;
        },
        
        closeCart: (state) => {
            state.isOpen = false;
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
} = cartSlice.actions;

// Selectores
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartItemById = (productId) => (state) => 
    state.cart.items.find(item => item._id === productId);
export const selectCartItemQuantity = (productId) => (state) => {
    const item = state.cart.items.find(item => item._id === productId);
    return item ? item.quantity : 0;
};

export default cartSlice.reducer;
