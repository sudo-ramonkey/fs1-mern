# Enhanced Product Filtering System

This document describes the enhanced product filtering system implemented for the musical instruments e-commerce application.

## Overview

The filtering system provides a comprehensive way to filter products based on their schema properties, with full URL synchronization and a modern user interface.

## Key Features

- **Schema-based filtering**: Filters are directly mapped to the product database schemas
- **URL synchronization**: All filters are reflected in the URL for bookmarking and sharing
- **Category-specific subcategories**: Dynamic subcategory menus based on main category
- **Real-time filtering**: Instant results as filters are applied
- **Mobile-responsive**: Optimized for all screen sizes
- **Visual feedback**: Active filters displayed as removable tags

## Architecture

### Components

#### AppHeader.jsx
Enhanced header with schema-based category dropdowns:
- Dynamic category menus with subcategories
- Integrated search functionality
- Mobile-responsive navigation
- Visual category indicators with icons

#### AllProducts.jsx
Main products listing page with filtering:
- URL parameter handling
- Active filters display
- Pagination with filter preservation
- Empty state handling

### Hooks

#### useUrlFilters.js
Custom hook for URL and filter synchronization:
- Bidirectional URL ↔ Redux sync
- Filter validation
- Programmatic filter management
- Active filter counting

### Utils

#### filterUtils.js
Utility functions for filter operations:
- URL parameter parsing/serialization
- Category structure definitions
- Filter validation
- Human-readable descriptions

### Redux Integration

#### shopSlice.js
Enhanced Redux slice with comprehensive filtering:
- Multiple filter types support
- Nested property filtering
- Advanced product matching
- Filter combination logic

## Product Schema Mapping

### Categories Structure

```javascript
const categoryStructure = {
  "Guitarras Electricas": {
    name: "Guitarras Eléctricas",
    icon: "🎸",
    subcategories: ["Stratocaster", "Telecaster", "Les Paul", "SG", "Flying V", "Explorer"]
  },
  "Guitarras Acusticas": {
    name: "Guitarras Acústicas", 
    icon: "🎼",
    subcategories: ["Dreadnought", "Folk", "Jazz", "Clásica"]
  },
  "Bajos": {
    name: "Bajos",
    icon: "🎵", 
    subcategories: ["Jazz Bass", "Precision Bass", "Active Bass", "Acoustic Bass"]
  },
  "Amplificadores": {
    name: "Amplificadores",
    icon: "🔊",
    subcategories: ["Cabezal", "Combo", "Gabinete", "Tubos", "Estado Sólido", "Híbrido"]
  },
  "Efectos": {
    name: "Efectos",
    icon: "🎛️",
    subcategories: ["Distorsión", "Overdrive", "Delay", "Reverb", "Chorus", "Multiefectos"]
  },
  "Accesorios": {
    name: "Accesorios",
    icon: "🛠️",
    subcategories: ["Cuerdas Guitarra Electrica", "Cuerdas Guitarra Acustica", "Fundas & Estuches", "Pastillas", "Puas", "Cables"]
  }
}
```

### Filter Types

1. **Main Categories**: `categoriaProducto` field
2. **Subcategories**: 
   - Instruments: `subcategoriaInstrumento`
   - Accessories: `subcategoriaAccesorio`
   - Equipment: `especificacionesAmplificador.tipo` or `especificacionesEfecto.tipoEfecto`
3. **Brands**: `marca` field
4. **Materials**: `materialCuerpo`, `materialMastil`, `materialDiapason`
5. **Special Filters**: Featured, Offers, Search text
6. **Price Range**: `precio` field

## URL Structure

The system uses query parameters to maintain filter state:

```
/productos?category=Guitarras%20Electricas&subcategory=Stratocaster&featured=true&brands=Fender,Squier&minPrice=500&maxPrice=2000
```

### Supported Parameters

- `category`: Main category ID
- `subcategory`: Subcategory ID
- `featured`: Boolean for featured products
- `offers`: Boolean for products on sale
- `search`: Search text
- `brands`: Comma-separated brand list
- `materials`: Comma-separated material list
- `ampTypes`: Comma-separated amplifier types
- `productTypes`: Comma-separated product types
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: Sort order (name, price-asc, price-desc)

## Usage Examples

### Basic Category Navigation

```javascript
// Navigate to electric guitars
handleCategoryNavigation("Guitarras Electricas");

// Navigate to Stratocaster subcategory
handleCategoryNavigation("Guitarras Electricas", "Stratocaster");

// Navigate to featured electric guitars
handleCategoryNavigation("Guitarras Electricas", null, "featured");
```

### Using the Hook

```javascript
import useUrlFilters from '../../hooks/useUrlFilters';

const MyComponent = () => {
  const { 
    filters, 
    addFilter, 
    removeFilter, 
    isFilterActive, 
    getActiveFiltersCount 
  } = useUrlFilters();

  // Add a brand filter
  const handleBrandSelect = (brand) => {
    addFilter('brand', brand);
  };

  // Remove specific filter
  const handleRemoveBrand = (brand) => {
    removeFilter('brand', brand);
  };

  // Check if filter is active
  const isFenderActive = isFilterActive('brand', 'Fender');

  return (
    <div>
      <p>Active filters: {getActiveFiltersCount()}</p>
      <button onClick={() => handleBrandSelect('Fender')}>
        Add Fender Filter
      </button>
    </div>
  );
};
```

### Filter Validation

```javascript
import { validateFilters } from '../../utils/filterUtils';

const filters = {
  selectedCategories: ['Guitarras Electricas'],
  selectedSubcategories: ['Stratocaster'],
  priceRange: [500, 2000]
};

const validation = validateFilters(filters);
if (validation.isValid) {
  // Apply filters
} else {
  console.log('Errors:', validation.errors);
  console.log('Warnings:', validation.warnings);
}
```

## Styling

### CSS Classes

- `.header-category-menu`: Enhanced dropdown menus
- `.category-main-item`: Main category actions
- `.category-subcategory-item`: Subcategory items
- `.active-filters-section`: Active filters display
- `.active-filters-tags`: Filter tag container
- `.mobile-category-section`: Mobile category layout

### Responsive Design

The system includes comprehensive responsive design:
- Desktop: Full dropdown menus with subcategories
- Tablet: Condensed menus with essential options
- Mobile: Collapsible menu with touch-friendly navigation

## Performance Considerations

- **Debounced search**: Search input includes debouncing to prevent excessive API calls
- **Memoized filtering**: Product filtering uses memoization for performance
- **Lazy loading**: Category menus load subcategories on demand
- **URL optimization**: Only changed parameters trigger updates

## Browser Compatibility

- Modern browsers with ES6+ support
- React Router v6 for URL management
- Redux Toolkit for state management
- Carbon Design System for UI components

## Future Enhancements

1. **Saved Filters**: Allow users to save and recall filter combinations
2. **Filter Presets**: Predefined filter sets for common searches
3. **Advanced Search**: Boolean operators and complex queries
4. **Filter Analytics**: Track popular filter combinations
5. **AI Recommendations**: Suggest filters based on user behavior

## Troubleshooting

### Common Issues

1. **Filters not applying**: Check Redux DevTools for state updates
2. **URL not updating**: Verify useUrlFilters hook is properly connected
3. **Missing subcategories**: Ensure product schema includes required fields
4. **Performance issues**: Check for unnecessary re-renders with React DevTools

### Debug Mode

Enable debug logging by setting localStorage:
```javascript
localStorage.setItem('DEBUG_FILTERS', 'true');
```

This will log filter operations to the console for debugging purposes.