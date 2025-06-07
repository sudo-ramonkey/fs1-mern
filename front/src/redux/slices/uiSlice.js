import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isProductModalOpen: false,
    selectedProduct: null,
    isCartModalOpen: false
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openProductModal: (state, action) => {
            state.isProductModalOpen = true;
            state.selectedProduct = action.payload;
        },
        closeProductModal: (state) => {
            state.isProductModalOpen = false;
            state.selectedProduct = null;
        },
        openCartModal: (state) => {
            state.isCartModalOpen = true;
        },
        closeCartModal: (state) => {
            state.isCartModalOpen = false;
        },
        toggleCartModal: (state) => {
            state.isCartModalOpen = !state.isCartModalOpen;
        }
    }
});

export const {
    openProductModal,
    closeProductModal,
    openCartModal,
    closeCartModal,
    toggleCartModal
} = uiSlice.actions;

// Selectores
export const selectIsProductModalOpen = (state) => state.ui.isProductModalOpen;
export const selectSelectedProduct = (state) => state.ui.selectedProduct;
export const selectIsCartModalOpen = (state) => state.ui.isCartModalOpen;

export default uiSlice.reducer;
