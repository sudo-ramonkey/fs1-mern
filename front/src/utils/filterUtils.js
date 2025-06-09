// Utility functions for handling URL parameters and product filtering

/**
 * Parse URL search parameters into filter object
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Filter object for Redux store
 */
export const parseURLFilters = (searchParams) => {
  const filters = {};

  // Category filter
  const category = searchParams.get("category");
  if (category) {
    filters.selectedCategories = [category];
  }

  // Subcategory filter
  const subcategory = searchParams.get("subcategory");
  if (subcategory) {
    filters.selectedSubcategories = [subcategory];
  }

  // Search text
  const search = searchParams.get("search");
  if (search) {
    filters.searchText = search;
  }

  // Sort by
  const sort = searchParams.get("sort");
  if (sort) {
    filters.sortBy = sort;
  }

  // Brands filter (comma-separated)
  const brands = searchParams.get("brands");
  if (brands) {
    filters.selectedBrands = brands.split(",").filter(Boolean);
  }

  // Materials filter (comma-separated)
  const materials = searchParams.get("materials");
  if (materials) {
    filters.selectedMaterials = materials.split(",").filter(Boolean);
  }

  // Amp types filter (comma-separated)
  const ampTypes = searchParams.get("ampTypes");
  if (ampTypes) {
    filters.selectedAmpTypes = ampTypes.split(",").filter(Boolean);
  }

  // Product types filter (comma-separated)
  const productTypes = searchParams.get("productTypes");
  if (productTypes) {
    filters.selectedProductTypes = productTypes.split(",").filter(Boolean);
  }

  // Price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.priceRange = [
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 9999,
    ];
  }

  return filters;
};

/**
 * Convert filter object to URL search parameters
 * @param {Object} filters - Filter object from Redux store
 * @returns {URLSearchParams} URL search parameters
 */
export const filtersToURLParams = (filters) => {
  const params = new URLSearchParams();

  // Category filter
  if (filters.selectedCategories && filters.selectedCategories.length > 0) {
    params.set("category", filters.selectedCategories[0]);
  }

  // Subcategory filter
  if (
    filters.selectedSubcategories &&
    filters.selectedSubcategories.length > 0
  ) {
    params.set("subcategory", filters.selectedSubcategories[0]);
  }

  // Search text
  if (filters.searchText && filters.searchText.trim()) {
    params.set("search", filters.searchText.trim());
  }

  // Sort by
  if (filters.sortBy && filters.sortBy !== "name") {
    params.set("sort", filters.sortBy);
  }

  // Brands filter
  if (filters.selectedBrands && filters.selectedBrands.length > 0) {
    params.set("brands", filters.selectedBrands.join(","));
  }

  // Materials filter
  if (filters.selectedMaterials && filters.selectedMaterials.length > 0) {
    params.set("materials", filters.selectedMaterials.join(","));
  }

  // Amp types filter
  if (filters.selectedAmpTypes && filters.selectedAmpTypes.length > 0) {
    params.set("ampTypes", filters.selectedAmpTypes.join(","));
  }

  // Product types filter
  if (filters.selectedProductTypes && filters.selectedProductTypes.length > 0) {
    params.set("productTypes", filters.selectedProductTypes.join(","));
  }

  // Price range (only if different from default)
  if (
    filters.priceRange &&
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 9999)
  ) {
    if (filters.priceRange[0] !== 0) {
      params.set("minPrice", filters.priceRange[0].toString());
    }
    if (filters.priceRange[1] !== 9999) {
      params.set("maxPrice", filters.priceRange[1].toString());
    }
  }

  return params;
};

/**
 * Get available subcategories for a given main category from dynamic category tree
 * @param {string} categoryId - Main category ID or slug
 * @param {Array} categoriesTree - Dynamic categories tree from Redux
 * @returns {Array} Array of subcategory objects
 */
export const getSubcategoriesForCategory = (categoryId, categoriesTree = []) => {
  if (!categoryId || !categoriesTree) return [];

  // Find the category in the tree (by ID, slug, or name)
  const findCategory = (categories, id) => {
    for (const category of categories) {
      if (category._id === id || category.slug === id || category.name === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategory(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const category = findCategory(categoriesTree, categoryId);
  if (!category || !category.children) return [];

  // Convert children to the expected format
  return category.children.map(child => ({
    id: child.slug || child._id,
    name: child.name,
    icon: child.icon || "�",
    _id: child._id,
    slug: child.slug
  }));
};

/**
 * Get category display name with icon from dynamic category tree
 * @param {string} categoryId - Category ID, slug, or name
 * @param {Array} categoriesTree - Dynamic categories tree from Redux
 * @returns {Object} Category object with name and icon
 */
export const getCategoryInfo = (categoryId, categoriesTree = []) => {
  if (!categoryId) return { name: "Sin categoría", icon: "📦" };

  // Find category in the tree
  const findCategory = (categories, id) => {
    for (const category of categories) {
      if (category._id === id || category.slug === id || category.name === id) {
        return {
          name: category.name,
          icon: category.icon || "�",
          _id: category._id,
          slug: category.slug
        };
      }
      if (category.children && category.children.length > 0) {
        const found = findCategory(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryInfo = findCategory(categoriesTree, categoryId);
  return categoryInfo || { name: categoryId, icon: "📦" };
};

/**
 * Get appropriate filter path for product based on its type and category
 * @param {Object} product - Product object
 * @returns {string} Filter key to use for subcategory filtering
 */
export const getProductFilterPath = (product) => {
  if (!product) return null;

  switch (product.tipo) {
    case "Instrumento":
      return "subcategoriaInstrumento";
    case "Accesorio":
      return "subcategoriaAccesorio";
    case "Equipo":
      if (product.tipoEquipo === "Amplificador") {
        return "especificacionesAmplificador.tipo";
      }
      if (product.tipoEquipo === "Efecto") {
        return "especificacionesEfecto.tipoEfecto";
      }
      return null;
    default:
      return null;
  }
};

/**
 * Get nested property value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., "especificaciones.tipo")
 * @returns {*} Property value or null if not found
 */
export const getNestedProperty = (obj, path) => {
  if (!obj || !path) return null;

  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Validate if a filter combination makes sense
 * @param {Object} filters - Filter object
 * @param {Array} categoriesTree - Dynamic categories tree from Redux
 * @returns {Object} Validation result with errors and warnings
 */
export const validateFilters = (filters, categoriesTree = []) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Check if price range is valid
  if (filters.priceRange && filters.priceRange[0] > filters.priceRange[1]) {
    result.isValid = false;
    result.errors.push("El precio mínimo no puede ser mayor al precio máximo");
  }

  // Check if subcategory matches main category
  if (filters.selectedCategories && filters.selectedSubcategories) {
    const mainCategory = filters.selectedCategories[0];
    const subcategory = filters.selectedSubcategories[0];

    if (mainCategory && subcategory) {
      const validSubcategories = getSubcategoriesForCategory(mainCategory, categoriesTree);
      const isValidCombination = validSubcategories.some(
        (sub) => sub.id === subcategory || sub.slug === subcategory || sub._id === subcategory,
      );

      if (!isValidCombination) {
        result.warnings.push(
          `La subcategoría "${subcategory}" no pertenece a "${mainCategory}"`,
        );
      }
    }
  }

  // Warn about too many active filters
  const activeFiltersCount = [
    filters.selectedCategories?.length || 0,
    filters.selectedSubcategories?.length || 0,
    filters.selectedBrands?.length || 0,
    filters.selectedMaterials?.length || 0,
    filters.selectedAmpTypes?.length || 0,
    filters.selectedProductTypes?.length || 0,
  ].reduce((sum, count) => sum + count, 0);

  if (activeFiltersCount > 5) {
    result.warnings.push(
      "Tienes muchos filtros activos, esto podría limitar demasiado los resultados",
    );
  }

  return result;
};

/**
 * Generate user-friendly filter description
 * @param {Object} filters - Current filters
 * @param {Array} categoriesTree - Dynamic categories tree from Redux
 * @returns {string} Human-readable description of active filters
 */
export const getFilterDescription = (filters, categoriesTree = []) => {
  const descriptions = [];

  if (filters.selectedCategories?.length > 0) {
    const categoryInfo = getCategoryInfo(filters.selectedCategories[0], categoriesTree);
    descriptions.push(`Categoría: ${categoryInfo.name}`);
  }

  if (filters.selectedSubcategories?.length > 0) {
    descriptions.push(`Tipo: ${filters.selectedSubcategories[0]}`);
  }

  if (filters.selectedBrands?.length > 0) {
    descriptions.push(`Marcas: ${filters.selectedBrands.join(", ")}`);
  }

  if (filters.searchText) {
    descriptions.push(`Búsqueda: "${filters.searchText}"`);
  }

  if (
    filters.priceRange &&
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 9999)
  ) {
    descriptions.push(
      `Precio: $${filters.priceRange[0]} - $${filters.priceRange[1]}`,
    );
  }

  return descriptions.length > 0
    ? descriptions.join(" • ")
    : "Sin filtros activos";
};
