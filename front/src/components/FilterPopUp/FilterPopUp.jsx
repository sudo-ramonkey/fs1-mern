import React, { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Popover,
  PopoverContent,
  Button,
  Accordion,
  AccordionItem,
  Checkbox,
  TextInput,
  NumberInput,
  Select,
  SelectItem,
  Slider,
} from "@carbon/react";
import { Filter } from "@carbon/react/icons";
import {
  setCategoryFilter,
  toggleCategoryFilter,
  setPriceRangeFilter,
  toggleBrandFilter,
  setSearchText,
  setSortBy,
  clearFilters,
  selectFilters,
  selectCategories,
  selectAvailableBrands,
  selectPriceRange,
} from '../../redux/slices/shopSlice';
import "./styles.css";

function FilterPopUp() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const categories = useSelector(selectCategories);
  const availableBrands = useSelector(selectAvailableBrands);
  const priceRange = useSelector(selectPriceRange);

  const handleCategoryToggle = useCallback((category) => {
    dispatch(toggleCategoryFilter(category));
  }, [dispatch]);

  const handleBrandToggle = useCallback((brand) => {
    dispatch(toggleBrandFilter(brand));
  }, [dispatch]);

  const handlePriceRangeChange = useCallback((type, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const limitedValue = Math.min(Math.max(numValue, priceRange.min), priceRange.max);
    const newRange = [...filters.priceRange];
    
    if (type === 'min') {
      newRange[0] = Math.min(limitedValue, newRange[1] - 50);
    } else {
      newRange[1] = Math.max(limitedValue, newRange[0] + 50);
    }
    
    dispatch(setPriceRangeFilter(newRange));
  }, [dispatch, filters.priceRange, priceRange]);

  const handleSliderChange = useCallback((data) => {
    // El slider de Carbon retorna { value, valueUpper }
    const minValue = Math.max(priceRange.min, data.value || 0);
    const maxValue = Math.min(priceRange.max, data.valueUpper || priceRange.max);
    
    dispatch(setPriceRangeFilter([minValue, maxValue]));
  }, [dispatch, priceRange]);

  const handleSearchChange = useCallback((event) => {
    dispatch(setSearchText(event.target.value));
  }, [dispatch]);

  const handleSortChange = useCallback((event) => {
    dispatch(setSortBy(event.target.value));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return (
    <Popover
      align="bottom-left"
      isTabTip
      open={open}
      onRequestClose={() => setOpen(false)}
    >
      <Button
        size="sm"
        onClick={() => setOpen(!open)}
        renderIcon={Filter}
        className="pop-up-filter-btn"
      >
        Filters
      </Button>
      <PopoverContent>
        <div style={{ width: "350px", padding: "16px" }}>
          {/* Búsqueda */}
          <div className="filter-section">
            <TextInput
              id="search-input" 
              placeholder="Buscar productos..."
              value={filters.searchText}
              onChange={handleSearchChange}
              labelText="Búsqueda"
            />
          </div>

          {/* Ordenar */}
          <div className="filter-section">
            <Select
              id="sort-select"
              labelText="Ordenar por"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <SelectItem value="name" text="Nombre" />
              <SelectItem value="price-asc" text="Precio (menor a mayor)" />
              <SelectItem value="price-desc" text="Precio (mayor a menor)" />
            </Select>
          </div>

          <Accordion align="start">
            {/* Categorías */}
            <AccordionItem title="Categorías">
              <div className="filter-checkbox-group">
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    id={`category-${category.id}`}
                    labelText={category.name}
                    checked={filters.selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                ))}
              </div>
            </AccordionItem>

            {/* Rango de Precios */}
            <AccordionItem title="Rango de Precios">
              <div className="price-range-section">
                <div className="price-range-display">
                  <span className="price-label">Precio seleccionado:</span>
                  <span className="price-values">
                    ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  </span>
                </div>
                
                {/* Slider de Carbon con dual range */}
                <Slider
                  ariaLabelInput="Precio mínimo"
                  unstable_ariaLabelInputUpper="Precio máximo"
                  labelText=""
                  value={filters.priceRange[0]}
                  unstable_valueUpper={filters.priceRange[1]}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={50}
                  stepMultiplier={10}
                  hideTextInput={true}
                  formatLabel={() => ""}
                  onChange={handleSliderChange}
                />
                
                {/* Inputs numéricos como alternativa */}
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label htmlFor="min-price-input" className="input-label">Mínimo</label>
                    <input
                      id="min-price-input"
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      step="50"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className="price-input"
                    />
                  </div>
                  <div className="price-input-group">
                    <label htmlFor="max-price-input" className="input-label">Máximo</label>
                    <input
                      id="max-price-input"
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      step="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className="price-input"
                    />
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* Marcas */}
            <AccordionItem title="Marcas">
              <div className="filter-checkbox-group">
                {availableBrands.map((brand) => (
                  <Checkbox
                    key={brand}
                    id={`brand-${brand}`}
                    labelText={brand}
                    checked={filters.selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                ))}
              </div>
            </AccordionItem>
          </Accordion>

          {/* Botones */}
          <div className="filter-buttons">
            <Button
              size="sm"
              kind="secondary"
              onClick={handleClearFilters}
            >
              Limpiar Filtros
            </Button>
            <Button
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopUp;
