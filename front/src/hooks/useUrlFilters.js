import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFiltersFromURL, selectFilters } from "../redux/slices/shopSlice";
import { parseURLFilters, validateFilters } from "../utils/filterUtils";

/**
 * Custom hook for synchronizing URL parameters with Redux filters
 * Handles bidirectional sync between URL and store state
 */
export const useUrlFilters = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectFilters);

  /**
   * Initialize filters from URL on mount and when URL changes
   */
  useEffect(() => {
    const urlFilters = parseURLFilters(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFiltersFromURL(urlFilters));
    }
  }, [searchParams, dispatch]); // Run when URL parameters change

  /**
   * Apply filters from URL parameters
   * @param {Object} filters - Filter object to apply
   */
  const applyUrlFilters = (filters) => {
    const validation = validateFilters(filters);

    if (validation.isValid) {
      dispatch(setFiltersFromURL(filters));
    } else {
      console.warn("Invalid filter combination:", validation.errors);
    }
  };

  /**
   * Get current URL parameters as object
   */
  const getCurrentUrlParams1 = () => {
    return Object.fromEntries(searchParams.entries());
  };

  /**
   * Add a single filter to current filters
   * @param {string} filterType - Type of filter (e.g., 'selectedCategories')
   * @param {*} value - Filter value
   */
  const addFilter = (filterType, value) => {
    const newFilters = { ...currentFilters };

    switch (filterType) {
      case "category":
        newFilters.selectedCategories = [value];
        // Clear subcategories when changing main category
        newFilters.selectedSubcategories = [];
        break;
      case "subcategory":
        newFilters.selectedSubcategories = [value];
        break;
      case "brand":
        if (!newFilters.selectedBrands) newFilters.selectedBrands = [];
        if (!newFilters.selectedBrands.includes(value)) {
          newFilters.selectedBrands.push(value);
        }
        break;
      case "material":
        if (!newFilters.selectedMaterials) newFilters.selectedMaterials = [];
        if (!newFilters.selectedMaterials.includes(value)) {
          newFilters.selectedMaterials.push(value);
        }
        break;

      case "search":
        newFilters.searchText = value;
        break;
      default:
        console.warn(`Unknown filter type: ${filterType}`);
        return;
    }

    dispatch(setFiltersFromURL(newFilters));
  };

  /**
   * Remove a single filter from current filters
   * @param {string} filterType - Type of filter
   * @param {*} value - Filter value to remove (optional for some types)
   */
  const removeFilter = (filterType, value = null) => {
    const newFilters = { ...currentFilters };

    switch (filterType) {
      case "category":
        newFilters.selectedCategories = [];
        newFilters.selectedSubcategories = []; // Also clear subcategories
        break;
      case "subcategory":
        newFilters.selectedSubcategories = [];
        break;
      case "brand":
        if (value && newFilters.selectedBrands) {
          newFilters.selectedBrands = newFilters.selectedBrands.filter(
            (b) => b !== value,
          );
        } else {
          newFilters.selectedBrands = [];
        }
        break;
      case "material":
        if (value && newFilters.selectedMaterials) {
          newFilters.selectedMaterials = newFilters.selectedMaterials.filter(
            (m) => m !== value,
          );
        } else {
          newFilters.selectedMaterials = [];
        }
        break;

      case "search":
        newFilters.searchText = "";
        break;
      case "all":
        // Clear all filters
        newFilters.selectedCategories = [];
        newFilters.selectedSubcategories = [];
        newFilters.selectedBrands = [];
        newFilters.selectedMaterials = [];
        newFilters.selectedAmpTypes = [];
        newFilters.selectedProductTypes = [];
        newFilters.searchText = "";
        break;
      default:
        console.warn(`Unknown filter type: ${filterType}`);
        return;
    }

    dispatch(setFiltersFromURL(newFilters));
  };

  /**
   * Get current URL parameters as object
   */
  const getCurrentUrlParams = () => {
    return Object.fromEntries(searchParams.entries());
  };

  /**
   * Check if specific filter is active
   * @param {string} filterType - Type of filter
   * @param {*} value - Filter value (optional)
   */
  const isFilterActive = (filterType, value = null) => {
    switch (filterType) {
      case "category":
        return value
          ? currentFilters.selectedCategories?.includes(value)
          : currentFilters.selectedCategories?.length > 0;
      case "subcategory":
        return value
          ? currentFilters.selectedSubcategories?.includes(value)
          : currentFilters.selectedSubcategories?.length > 0;
      case "brand":
        return value
          ? currentFilters.selectedBrands?.includes(value)
          : currentFilters.selectedBrands?.length > 0;
      case "material":
        return value
          ? currentFilters.selectedMaterials?.includes(value)
          : currentFilters.selectedMaterials?.length > 0;

      case "search":
        return Boolean(currentFilters.searchText?.trim());
      default:
        return false;
    }
  };

  /**
   * Get count of active filters
   */
  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.selectedCategories?.length > 0) count++;
    if (currentFilters.selectedSubcategories?.length > 0) count++;
    if (currentFilters.selectedBrands?.length > 0)
      count += currentFilters.selectedBrands.length;
    if (currentFilters.selectedMaterials?.length > 0)
      count += currentFilters.selectedMaterials.length;
    if (currentFilters.searchText?.trim()) count++;
    return count;
  };

  return {
    // State
    filters: currentFilters,
    urlParams: getCurrentUrlParams(),

    // Actions
    applyUrlFilters,
    addFilter,
    removeFilter,

    // Getters
    isFilterActive,
    getActiveFiltersCount,

    // Validation
    validateFilters: (filters) => validateFilters(filters || currentFilters),
  };
};

export default useUrlFilters;
