import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductos } from '../../service/service';
import { articleMockData } from './articleMockData';

export const fetchProductosThunk = createAsyncThunk(
  'shop/fetchProductos',
  async () => {
    const data = await fetchProductos();
    return data;
  }
);

const initialState = {
    productos: [], // Inicializa como arreglo vacío
    categories: [
        { id: "guitarras", name: "Guitarras" },
        { id: "baterias", name: "Baterías" },
        { id: "bajos", name: "Bajos" },
        { id: "teclados", name: "Teclados" },
        { id: "vientos", name: "Instrumentos de viento" },
        { id: "accesorios", name: "Accesorios" },
        { id: "audio", name: "Audio" },
    ],
    filters: {
        selectedCategory: null,
        priceRange: [0, 9999],
        selectedBrands: []
    }
};

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        addArticle: (state, action) => {
            state.articles.push(action.payload);
        },
        removeArticle: (state, action) => {
            state.articles = state.articles.filter(article => article.id !== action.payload);
        },
        updateArticle: (state, action) => {
            const index = state.articles.findIndex(article => article.id === action.payload.id);
            if (index !== -1) {
                state.articles[index] = action.payload;
            }
        },
        setCategoryFilter: (state, action) => {
            state.filters.selectedCategory = action.payload;
        },
        setPriceRangeFilter: (state, action) => {
            state.filters.priceRange = action.payload;
        },
        toggleBrandFilter: (state, action) => {
            const brand = action.payload;
            if (state.filters.selectedBrands.includes(brand)) {
                state.filters.selectedBrands = state.filters.selectedBrands.filter(b => b !== brand);
            } else {
                state.filters.selectedBrands.push(brand);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductosThunk.fulfilled, (state, action) => {
            state.productos = action.payload; // Llena productos con los datos de la API
        });
    }
});

export const {
    addArticle,
    removeArticle,
    updateArticle,
    setCategoryFilter,
    setPriceRangeFilter,
    toggleBrandFilter
} = shopSlice.actions;

export default shopSlice.reducer;