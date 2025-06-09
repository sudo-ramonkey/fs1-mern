import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductos, getCategoriesService } from "../../service/service";

export const fetchProductosThunk = createAsyncThunk(
  "shop/fetchProductos",
  async () => {
    const data = await fetchProductos();
    return data;
  },
);

export const fetchCategoriesThunk = createAsyncThunk(
  "shop/fetchCategories",
  async (params = {}) => {
    const data = await getCategoriesService(params);
    return data;
  },
);

// Helper function to get all descendant category IDs from a tree structure
const getCategoryDescendants = (categories, categoryId) => {
  const descendants = [];
  const findDescendants = (id) => {
    const category = categories.find(cat => cat._id === id);
    if (category && category.children) {
      category.children.forEach(childId => {
        descendants.push(childId);
        findDescendants(childId);
      });
    }
  };
  findDescendants(categoryId);
  return descendants;
};

// Helper function to check if a product belongs to a category or its subcategories
const productBelongsToCategory = (product, selectedCategoryIds, categories) => {
  if (!product.categoria || !selectedCategoryIds.length) return true;
  
  // Get all category IDs that should match (including descendants)
  const allRelevantCategoryIds = [];
  selectedCategoryIds.forEach(categoryId => {
    allRelevantCategoryIds.push(categoryId);
    allRelevantCategoryIds.push(...getCategoryDescendants(categories, categoryId));
  });
  
  // Check if product's category reference matches any of the relevant categories
  return allRelevantCategoryIds.includes(product.categoria);
};

// Función helper para aplicar filtros
const filterProducts = (productos, filters, categories = []) => {
  let filtered = [...productos];

  // Filtrar por categorías (ahora soporta estructura de árbol)
  if (filters.selectedCategories && filters.selectedCategories.length > 0) {
    filtered = filtered.filter((producto) =>
      productBelongsToCategory(producto, filters.selectedCategories, categories)
    );
  }

  // Filtrar por subcategorías
  if (
    filters.selectedSubcategories &&
    filters.selectedSubcategories.length > 0
  ) {
    filtered = filtered.filter((producto) => {
      // Para instrumentos, verificar subcategoriaInstrumento
      if (producto.tipo === "Instrumento" && producto.subcategoriaInstrumento) {
        return filters.selectedSubcategories.includes(
          producto.subcategoriaInstrumento,
        );
      }
      // Para accesorios, verificar subcategoriaAccesorio
      if (producto.tipo === "Accesorio" && producto.subcategoriaAccesorio) {
        return filters.selectedSubcategories.includes(
          producto.subcategoriaAccesorio,
        );
      }
      // Para equipos, verificar especificaciones
      if (producto.tipo === "Equipo") {
        if (
          producto.tipoEquipo === "Amplificador" &&
          producto.especificacionesAmplificador?.tipo
        ) {
          return filters.selectedSubcategories.includes(
            producto.especificacionesAmplificador.tipo,
          );
        }
        if (
          producto.tipoEquipo === "Efecto" &&
          producto.especificacionesEfecto?.tipoEfecto
        ) {
          return filters.selectedSubcategories.includes(
            producto.especificacionesEfecto.tipoEfecto,
          );
        }
      }
      return false;
    });
  }

  // Filtrar por tipo de amplificador
  if (filters.selectedAmpTypes && filters.selectedAmpTypes.length > 0) {
    filtered = filtered.filter(
      (producto) =>
        producto.tipo === "Equipo" &&
        producto.tipoEquipo === "Amplificador" &&
        producto.especificacionesAmplificador?.tecnologia &&
        filters.selectedAmpTypes.includes(
          producto.especificacionesAmplificador.tecnologia,
        ),
    );
  }

  // Filtrar por rango de precios
  filtered = filtered.filter(
    (producto) =>
      producto.precio >= filters.priceRange[0] &&
      producto.precio <= filters.priceRange[1],
  );

  // Filtrar por marcas
  if (filters.selectedBrands.length > 0) {
    filtered = filtered.filter((producto) =>
      filters.selectedBrands.includes(producto.marca),
    );
  }

  // Filtrar por tipo de producto
  if (filters.selectedProductTypes && filters.selectedProductTypes.length > 0) {
    filtered = filtered.filter((producto) =>
      filters.selectedProductTypes.includes(producto.tipo),
    );
  }

  // Filtrar por material (para instrumentos)
  if (filters.selectedMaterials && filters.selectedMaterials.length > 0) {
    filtered = filtered.filter((producto) => {
      if (producto.tipo === "Instrumento") {
        return filters.selectedMaterials.some(
          (material) =>
            producto.materialCuerpo?.includes(material) ||
            producto.materialMastil?.includes(material) ||
            producto.materialDiapason?.includes(material),
        );
      }
      return true;
    });
  }

  // Filtrar por texto de búsqueda
  if (filters.searchText) {
    const searchTerm = filters.searchText.toLowerCase();
    filtered = filtered.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion?.toLowerCase().includes(searchTerm) ||
        producto.marca?.toLowerCase().includes(searchTerm) ||
        producto.categoriaProducto?.toLowerCase().includes(searchTerm) ||
        producto.subcategoriaAccesorio?.toLowerCase().includes(searchTerm) ||
        producto.subcategoriaInstrumento?.toLowerCase().includes(searchTerm),
    );
  }

  // Ordenar
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.precio - b.precio;
      case "price-desc":
        return b.precio - a.precio;
      case "name":
      default:
        return a.nombre.localeCompare(b.nombre);
    }
  });

  return filtered;
};

const initialState = {
  productos: [], // Inicializa como arreglo vacío
  categories: [], // Now populated from API instead of hardcoded
  categoriesTree: [], // Tree structure for hierarchical display
  categoriesLoading: false,
  categoriesError: null,
  filters: {
    selectedCategories: [],
    selectedSubcategories: [],
    selectedAmpTypes: [],
    selectedProductTypes: [],
    selectedMaterials: [],
    priceRange: [0, 9999],
    selectedBrands: [],
    searchText: "",
    sortBy: "name",
  },
  filteredProductos: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addArticle: (state, action) => {
      state.articles.push(action.payload);
    },
    removeArticle: (state, action) => {
      state.articles = state.articles.filter(
        (article) => article.id !== action.payload,
      );
    },
    updateArticle: (state, action) => {
      const index = state.articles.findIndex(
        (article) => article.id === action.payload.id,
      );
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    setCategoryFilter: (state, action) => {
      state.filters.selectedCategories = action.payload;
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleCategoryFilter: (state, action) => {
      const category = action.payload;
      if (state.filters.selectedCategories.includes(category)) {
        state.filters.selectedCategories =
          state.filters.selectedCategories.filter((c) => c !== category);
      } else {
        state.filters.selectedCategories.push(category);
      }
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setSubcategoryFilter: (state, action) => {
      state.filters.selectedSubcategories = action.payload;
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleSubcategoryFilter: (state, action) => {
      const subcategory = action.payload;
      if (state.filters.selectedSubcategories.includes(subcategory)) {
        state.filters.selectedSubcategories =
          state.filters.selectedSubcategories.filter((s) => s !== subcategory);
      } else {
        state.filters.selectedSubcategories.push(subcategory);
      }
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setAmpTypeFilter: (state, action) => {
      state.filters.selectedAmpTypes = action.payload;
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleAmpTypeFilter: (state, action) => {
      const ampType = action.payload;
      if (state.filters.selectedAmpTypes.includes(ampType)) {
        state.filters.selectedAmpTypes = state.filters.selectedAmpTypes.filter(
          (a) => a !== ampType,
        );
      } else {
        state.filters.selectedAmpTypes.push(ampType);
      }
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setProductTypeFilter: (state, action) => {
      state.filters.selectedProductTypes = action.payload;
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleProductTypeFilter: (state, action) => {
      const productType = action.payload;
      if (state.filters.selectedProductTypes.includes(productType)) {
        state.filters.selectedProductTypes =
          state.filters.selectedProductTypes.filter((p) => p !== productType);
      } else {
        state.filters.selectedProductTypes.push(productType);
      }
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setMaterialFilter: (state, action) => {
      state.filters.selectedMaterials = action.payload;
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleMaterialFilter: (state, action) => {
      const material = action.payload;
      if (state.filters.selectedMaterials.includes(material)) {
        state.filters.selectedMaterials =
          state.filters.selectedMaterials.filter((m) => m !== material);
      } else {
        state.filters.selectedMaterials.push(material);
      }
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },

    setFiltersFromURL: (state, action) => {
      // Permite establecer múltiples filtros desde parámetros URL
      const filters = action.payload;

      if (filters.selectedCategories) {
        state.filters.selectedCategories = filters.selectedCategories;
      }
      if (filters.selectedSubcategories) {
        state.filters.selectedSubcategories = filters.selectedSubcategories;
      }
      if (filters.selectedBrands) {
        state.filters.selectedBrands = filters.selectedBrands;
      }
      if (filters.selectedMaterials) {
        state.filters.selectedMaterials = filters.selectedMaterials;
      }
      if (filters.selectedAmpTypes) {
        state.filters.selectedAmpTypes = filters.selectedAmpTypes;
      }
      if (filters.selectedProductTypes) {
        state.filters.selectedProductTypes = filters.selectedProductTypes;
      }
      if (filters.searchText !== undefined) {
        state.filters.searchText = filters.searchText;
      }
      if (filters.sortBy) {
        state.filters.sortBy = filters.sortBy;
      }
      if (filters.priceRange) {
        state.filters.priceRange = filters.priceRange;
      }

      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setPriceRangeFilter: (state, action) => {
      state.filters.priceRange = action.payload;
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    toggleBrandFilter: (state, action) => {
      const brand = action.payload;
      if (state.filters.selectedBrands.includes(brand)) {
        state.filters.selectedBrands = state.filters.selectedBrands.filter(
          (b) => b !== brand,
        );
      } else {
        state.filters.selectedBrands.push(brand);
      }
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setSearchText: (state, action) => {
      state.filters.searchText = action.payload;
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    clearFilters: (state) => {
      // Calcular rango de precios dinámico
      let priceRange = [0, 9999];
      if (state.productos.length > 0) {
        const prices = state.productos.map((producto) => producto.precio);
        priceRange = [Math.min(...prices), Math.max(...prices)];
      }

      state.filters = {
        selectedCategories: [],
        selectedSubcategories: [],
        selectedAmpTypes: [],
        selectedProductTypes: [],
        priceRange: priceRange,
        selectedBrands: [],
        searchText: "",
        sortBy: "name",
      };
      // Aplicar filtros automáticamente
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
    applyFilters: (state) => {
      state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductosThunk.fulfilled, (state, action) => {
        state.productos = action.payload;

        // Establecer rango de precios dinámico si no ha sido modificado por el usuario
        if (
          state.filters.priceRange[0] === 0 &&
          state.filters.priceRange[1] === 9999
        ) {
          const prices = action.payload.map((producto) => producto.precio);
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            state.filters.priceRange = [minPrice, maxPrice];
          }
        }

        // Aplicar filtros después de cargar productos
        state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
      })
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data || action.payload;
        
        // If the response includes a tree structure, store it separately
        if (action.payload.tree) {
          state.categoriesTree = action.payload.tree;
        } else {
          // Create a basic tree structure from flat categories
          state.categoriesTree = state.categories.filter(cat => !cat.parent);
        }
        
        // Re-apply filters with new categories
        state.filteredProductos = filterProducts(state.productos, state.filters, state.categories);
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message;
      });
  },
});

export const {
  addArticle,
  removeArticle,
  updateArticle,
  setCategoryFilter,
  toggleCategoryFilter,
  setSubcategoryFilter,
  toggleSubcategoryFilter,
  setAmpTypeFilter,
  toggleAmpTypeFilter,
  setProductTypeFilter,
  toggleProductTypeFilter,
  setMaterialFilter,
  toggleMaterialFilter,
  setPriceRangeFilter,
  toggleBrandFilter,
  setSearchText,
  setSortBy,
  setFiltersFromURL,
  clearFilters,
  applyFilters,
} = shopSlice.actions;

// Selectores
export const selectAllProducts = (state) => state.shop.productos;
export const selectFilteredProducts = (state) => state.shop.filteredProductos;
export const selectFilters = (state) => state.shop.filters;
export const selectCategories = (state) => state.shop.categories;
export const selectCategoriesTree = (state) => state.shop.categoriesTree;
export const selectCategoriesLoading = (state) => state.shop.categoriesLoading;
export const selectCategoriesError = (state) => state.shop.categoriesError;
export const selectAvailableBrands = (state) => {
  const productos = state.shop.productos;
  const brands = [
    ...new Set(productos.map((producto) => producto.marca).filter(Boolean)),
  ];
  return brands.sort();
};
export const selectPriceRange = (state) => {
  const productos = state.shop.productos;
  if (productos.length === 0) return { min: 0, max: 9999 };

  const prices = productos.map((producto) => producto.precio);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

// Nuevos selectores para las categorías y subcategorías disponibles
export const selectAvailableSubcategories = (state) => {
  const productos = state.shop.productos;
  const subcategories = new Set();

  productos.forEach((producto) => {
    if (producto.subcategoriaInstrumento) {
      subcategories.add(producto.subcategoriaInstrumento);
    }
    if (producto.subcategoriaAccesorio) {
      subcategories.add(producto.subcategoriaAccesorio);
    }
    if (
      producto.tipo === "Equipo" &&
      producto.tipoEquipo === "Amplificador" &&
      producto.especificacionesAmplificador?.tipo
    ) {
      subcategories.add(producto.especificacionesAmplificador.tipo);
    }
    if (
      producto.tipo === "Equipo" &&
      producto.tipoEquipo === "Efecto" &&
      producto.especificacionesEfecto?.tipoEfecto
    ) {
      subcategories.add(producto.especificacionesEfecto.tipoEfecto);
    }
  });

  return Array.from(subcategories).sort();
};

export const selectAvailableMaterials = (state) => {
  const productos = state.shop.productos;
  const materials = new Set();

  productos.forEach((producto) => {
    if (producto.tipo === "Instrumento") {
      if (producto.materialCuerpo) materials.add(producto.materialCuerpo);
      if (producto.materialMastil) materials.add(producto.materialMastil);
      if (producto.materialDiapason) materials.add(producto.materialDiapason);
    }
  });

  return Array.from(materials).sort();
};

export const selectAvailableAmpTypes = (state) => {
  const productos = state.shop.productos;
  const ampTypes = new Set();

  productos.forEach((producto) => {
    if (
      producto.tipo === "Equipo" &&
      producto.tipoEquipo === "Amplificador" &&
      producto.especificacionesAmplificador?.tecnologia
    ) {
      ampTypes.add(producto.especificacionesAmplificador.tecnologia);
    }
  });

  return Array.from(ampTypes).sort();
};

export default shopSlice.reducer;
