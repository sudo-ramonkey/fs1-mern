import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Tag, Button } from "@carbon/react";
import { Filter, Close } from "@carbon/react/icons";
import {
  fetchProductosThunk,
  selectFilteredProducts,
  applyFilters,
} from "../../redux/slices/shopSlice";
import FilterPopUp from "../../components/FilterPopUp/FilterPopUp";
import InstrumentCard from "../../components/Cards/InstrumentCard";
import useUrlFilters from "../../hooks/useUrlFilters";
import { getCategoryInfo } from "../../utils/filterUtils";
import "./AllProducts.css";

const AllProducts = () => {
  const dispatch = useDispatch();
  const productos = useSelector(selectFilteredProducts);
  const { filters, removeFilter, getActiveFiltersCount } = useUrlFilters();

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Calcular productos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return productos.slice(startIndex, endIndex);
  }, [productos, currentPage, pageSize]);

  useEffect(() => {
    dispatch(fetchProductosThunk());
  }, [dispatch]);

  // Apply filters when they change
  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, dispatch]);

  // Resetear a la primera página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [productos.length]);

  const handlePaginationChange = ({ page, pageSize: newPageSize }) => {
    setCurrentPage(page);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Resetear a la primera página cuando cambie el tamaño
    }
  };

  return (
    <div className="all-products-container">
      <div className="all-products-header">
        <div className="page-title">
          <h1>
            {filters.selectedCategories?.length > 0
              ? getCategoryInfo(filters.selectedCategories[0]).name
              : "Todos los Productos"}
          </h1>
          <p>
            {filters.selectedCategories?.length > 0
              ? `Explora nuestra colección de ${getCategoryInfo(filters.selectedCategories[0]).name.toLowerCase()}`
              : "Explora nuestra colección completa de instrumentos musicales"}
          </p>
        </div>
        <div className="header-controls">
          <FilterPopUp />
          <div className="products-count">
            Mostrando {paginatedData.length} de {productos.length} productos
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="active-filters-section">
          <div className="active-filters-header">
            <div className="filters-title">
              <Filter size={16} />
              <span>Filtros activos ({getActiveFiltersCount()})</span>
            </div>
            <Button
              kind="ghost"
              size="sm"
              onClick={() => removeFilter("all")}
              renderIcon={Close}
            >
              Limpiar todos
            </Button>
          </div>
          <div className="active-filters-tags">
            {filters.selectedCategories?.map((category) => (
              <Tag
                key={category}
                type="blue"
                onClose={() => removeFilter("category", category)}
                filter
              >
                {getCategoryInfo(category).icon}{" "}
                {getCategoryInfo(category).name}
              </Tag>
            ))}
            {filters.selectedSubcategories?.map((subcategory) => (
              <Tag
                key={subcategory}
                type="cyan"
                onClose={() => removeFilter("subcategory", subcategory)}
                filter
              >
                📂 {subcategory}
              </Tag>
            ))}
            {filters.selectedBrands?.map((brand) => (
              <Tag
                key={brand}
                type="green"
                onClose={() => removeFilter("brand", brand)}
                filter
              >
                🏷️ {brand}
              </Tag>
            ))}
            {filters.selectedMaterials?.map((material) => (
              <Tag
                key={material}
                type="purple"
                onClose={() => removeFilter("material", material)}
                filter
              >
                🌳 {material}
              </Tag>
            ))}

            {filters.searchText && (
              <Tag type="gray" onClose={() => removeFilter("search")} filter>
                🔍 "{filters.searchText}"
              </Tag>
            )}
          </div>
        </div>
      )}
      <div className="articleWrapper">
        {paginatedData.map((producto) => (
          <InstrumentCard
            key={producto.id || producto._id}
            article={producto}
          />
        ))}
      </div>

      {productos.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            backwardText="Página anterior"
            forwardText="Página siguiente"
            itemsPerPageText="Productos por página:"
            page={currentPage}
            pageNumberText="Número de página"
            pageSize={pageSize}
            pageSizes={[6, 12, 24, 48]}
            size="md"
            totalItems={productos.length}
            onChange={handlePaginationChange}
          />
        </div>
      )}

      {productos.length === 0 && (
        <div className="no-products">
          <h3>No se encontraron productos</h3>
          <p>
            {getActiveFiltersCount() > 0
              ? "Intenta ajustar los filtros para ver más resultados."
              : "No hay productos disponibles en este momento."}
          </p>
          {getActiveFiltersCount() > 0 && (
            <Button
              kind="secondary"
              onClick={() => removeFilter("all")}
              renderIcon={Close}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
