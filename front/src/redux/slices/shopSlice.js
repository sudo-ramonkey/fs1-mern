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

// Función helper para aplicar filtros
const filterProducts = (productos, filters) => {
    let filtered = [...productos];
    
    // Filtrar por categorías
    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        filtered = filtered.filter(producto => 
            filters.selectedCategories.includes(producto.categoriaProducto)
        );
    }
    
    // Filtrar por rango de precios
    filtered = filtered.filter(producto => 
        producto.precio >= filters.priceRange[0] && 
        producto.precio <= filters.priceRange[1]
    );
    
    // Filtrar por marcas
    if (filters.selectedBrands.length > 0) {
        filtered = filtered.filter(producto => 
            filters.selectedBrands.includes(producto.marca)
        );
    }
    
    // Filtrar por texto de búsqueda
    if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        filtered = filtered.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion?.toLowerCase().includes(searchTerm) ||
            producto.marca?.toLowerCase().includes(searchTerm)
        );
    }
    
    // Ordenar
    filtered.sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-asc':
                return a.precio - b.precio;
            case 'price-desc':
                return b.precio - a.precio;
            case 'name':
            default:
                return a.nombre.localeCompare(b.nombre);
        }
    });
    
    return filtered;
};

const initialState = {
    productos: [], // Inicializa como arreglo vacío
    categories: [
        { id: "Guitarras Electricas", name: "Guitarras Eléctricas" },
        { id: "Guitarras Acusticas", name: "Guitarras Acústicas" },
        { id: "Bajos", name: "Bajos" },
        { id: "Amplificadores", name: "Amplificadores" },
        { id: "Efectos", name: "Efectos" },
        { id: "Accesorios", name: "Accesorios" },
        { id: "Otros", name: "Otros" },
    ],
    filters: {
        selectedCategories: [],
        priceRange: [0, 9999],
        selectedBrands: [],
        searchText: '',
        sortBy: 'name'
    },
    filteredProductos: []
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
            state.filters.selectedCategories = action.payload;
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        toggleCategoryFilter: (state, action) => {
            const category = action.payload;
            if (state.filters.selectedCategories.includes(category)) {
                state.filters.selectedCategories = state.filters.selectedCategories.filter(c => c !== category);
            } else {
                state.filters.selectedCategories.push(category);
            }
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        setPriceRangeFilter: (state, action) => {
            state.filters.priceRange = action.payload;
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        toggleBrandFilter: (state, action) => {
            const brand = action.payload;
            if (state.filters.selectedBrands.includes(brand)) {
                state.filters.selectedBrands = state.filters.selectedBrands.filter(b => b !== brand);
            } else {
                state.filters.selectedBrands.push(brand);
            }
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        setSearchText: (state, action) => {
            state.filters.searchText = action.payload;
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        clearFilters: (state) => {
            // Calcular rango de precios dinámico
            let priceRange = [0, 9999];
            if (state.productos.length > 0) {
                const prices = state.productos.map(producto => producto.precio);
                priceRange = [Math.min(...prices), Math.max(...prices)];
            }
            
            state.filters = {
                selectedCategories: [],
                priceRange: priceRange,
                selectedBrands: [],
                searchText: '',
                sortBy: 'name'
            };
            // Aplicar filtros automáticamente
            state.filteredProductos = filterProducts(state.productos, state.filters);
        },
        applyFilters: (state) => {
            state.filteredProductos = filterProducts(state.productos, state.filters);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductosThunk.fulfilled, (state, action) => {
            state.productos = action.payload;
            
            // Establecer rango de precios dinámico si no ha sido modificado por el usuario
            if (state.filters.priceRange[0] === 0 && state.filters.priceRange[1] === 9999) {
                const prices = action.payload.map(producto => producto.precio);
                if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    state.filters.priceRange = [minPrice, maxPrice];
                }
            }
            
            // Aplicar filtros después de cargar productos
            state.filteredProductos = filterProducts(state.productos, state.filters);
        });
    }
});

export const {
    addArticle,
    removeArticle,
    updateArticle,
    setCategoryFilter,
    toggleCategoryFilter,
    setPriceRangeFilter,
    toggleBrandFilter,
    setSearchText,
    setSortBy,
    clearFilters,
    applyFilters
} = shopSlice.actions;

// Selectores
export const selectAllProducts = (state) => state.shop.productos;
export const selectFilteredProducts = (state) => state.shop.filteredProductos;
export const selectFilters = (state) => state.shop.filters;
export const selectCategories = (state) => state.shop.categories;
export const selectAvailableBrands = (state) => {
    const productos = state.shop.productos;
    const brands = [...new Set(productos.map(producto => producto.marca).filter(Boolean))];
    return brands.sort();
};
export const selectPriceRange = (state) => {
    const productos = state.shop.productos;
    if (productos.length === 0) return { min: 0, max: 9999 };
    
    const prices = productos.map(producto => producto.precio);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
};

export default shopSlice.reducer;