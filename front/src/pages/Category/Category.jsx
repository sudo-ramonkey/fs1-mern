import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  Button,
  Loading,
  Section,
  Heading,
  Dropdown,
  Pagination,
  Tile,
} from '@carbon/react';
import {
  Filter,
  Grid as GridIcon,
  List,
  ArrowUp,
} from '@carbon/react/icons';
import { 
  fetchProductosThunk, 
  fetchCategoriesThunk,
  selectFilteredProducts, 
  selectCategories,
  setCategoryFilter,
} from '../../redux/slices/shopSlice';
import { getCategoryBreadcrumbService } from '../../service/service';
import InstrumentCard from '../../components/Cards/InstrumentCard';
import './Category.css';

const Category = () => {
  const { categorySlug, subcategory } = useParams(); // Changed from categoryId to categorySlug
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productos = useSelector(selectFilteredProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(state => state.shop.loading);
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const productsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProductosThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    const findCategoryBySlug = async () => {
      if (!categorySlug || !categories.length) return;
      
      try {
        // Try to find category by slug
        const foundCategory = categories.find(cat => cat.slug === categorySlug);
        
        if (foundCategory) {
          setCurrentCategory(foundCategory);
          
          // Get breadcrumb if category has parents
          if (foundCategory._id) {
            try {
              const breadcrumbResponse = await getCategoryBreadcrumbService(foundCategory._id);
              // Breadcrumb data available but not currently used in UI
              console.log('Breadcrumb:', breadcrumbResponse.data);
            } catch (error) {
              console.warn('Could not fetch breadcrumb:', error);
            }
          }
          
          // Set filter to include this category and its children
          dispatch(setCategoryFilter([foundCategory._id]));
        } else {
          // Fallback: try to find by name (backward compatibility)
          const categoryByName = categories.find(cat => 
            cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
            cat.name.toLowerCase() === categorySlug.replace(/-/g, ' ')
          );
          
          if (categoryByName) {
            setCurrentCategory(categoryByName);
            dispatch(setCategoryFilter([categoryByName._id]));
          }
        }
      } catch (error) {
        console.error('Error finding category:', error);
      }
    };

    findCategoryBySlug();
  }, [categorySlug, categories, dispatch]);

  useEffect(() => {
    if (productos && productos.length > 0 && currentCategory) {
      let filtered = [...productos];

      // Apply subcategory filter if present
      if (subcategory === 'featured') {
        filtered = filtered.slice(0, 6); // Show first 6 as featured
      } else if (subcategory === 'offers') {
        filtered = filtered.filter(product => product.precio < 1000); // Mock offers filter
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.precio - b.precio;
          case 'price-high':
            return b.precio - a.precio;
          case 'name':
          default:
            return a.nombre.localeCompare(b.nombre);
        }
      });

      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [productos, currentCategory, subcategory, sortBy]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getPageTitle = () => {
    if (!currentCategory) return 'Categoría';
    
    let title = currentCategory.name;
    if (subcategory === 'featured') title += ' - Destacados';
    if (subcategory === 'offers') title += ' - Ofertas';
    
    return title;
  };

  const getPageDescription = () => {
    if (!currentCategory) return 'Explora nuestros productos';
    
    if (subcategory === 'featured') {
      return `Los mejores productos destacados de ${currentCategory.name.toLowerCase()}`;
    }
    if (subcategory === 'offers') {
      return `Ofertas especiales en ${currentCategory.name.toLowerCase()}`;
    }
    
    return `Descubre toda nuestra colección de ${currentCategory.name.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="category-loading">
        <Loading description="Cargando productos..." />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="category-not-found">
        <Section>
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className="not-found-content">
                <Heading>Categoría no encontrada</Heading>
                <p>La categoría que buscas no existe o ha sido movida.</p>
                <Button onClick={() => navigate('/productos')}>
                  Ver todos los productos
                </Button>
              </div>
            </Column>
          </Grid>
        </Section>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Section */}
      <Section className="category-hero">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="hero-content">
              <div className="hero-icon">
                {subcategory === 'featured' && '⭐'}
                {subcategory === 'offers' && '🔥'}
                {!subcategory && '🎵'}
              </div>
              <Heading className="hero-title">
                {getPageTitle()}
              </Heading>
              <p className="hero-description">
                {getPageDescription()}
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{filteredProducts.length}</span>
                  <span className="stat-label">Productos</span>
                </div>
                {subcategory === 'offers' && (
                  <div className="stat-item">
                    <span className="stat-number">30%</span>
                    <span className="stat-label">Desc. promedio</span>
                  </div>
                )}
              </div>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* Breadcrumb */}
      <Section className="category-breadcrumb">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Breadcrumb>
              <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
              <BreadcrumbItem href="/productos">Productos</BreadcrumbItem>
              <BreadcrumbItem href={`/category/${categorySlug}`}>
                {currentCategory.name}
              </BreadcrumbItem>
              {subcategory && (
                <BreadcrumbItem isCurrentPage>
                  {subcategory === 'featured' ? 'Destacados' : 'Ofertas'}
                </BreadcrumbItem>
              )}
            </Breadcrumb>
          </Column>
        </Grid>
      </Section>

      {/* Filters and Controls */}
      <Section className="category-controls">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="controls-container">
              <div className="controls-left">
                <Tag type="blue" size="md">
                  {filteredProducts.length} productos encontrados
                </Tag>
              </div>
              
              <div className="controls-right">
                <Dropdown
                  id="sort-dropdown"
                  titleText=""
                  label="Ordenar por"
                  items={[
                    { id: 'name', text: 'Nombre A-Z' },
                    { id: 'price-low', text: 'Precio: Menor a Mayor' },
                    { id: 'price-high', text: 'Precio: Mayor a Menor' },
                  ]}
                  selectedItem={{ id: sortBy }}
                  onChange={({ selectedItem }) => setSortBy(selectedItem.id)}
                />
                
                <div className="view-toggle">
                  <Button
                    kind={viewMode === 'grid' ? 'primary' : 'secondary'}
                    size="md"
                    hasIconOnly
                    renderIcon={GridIcon}
                    iconDescription="Vista de cuadrícula"
                    onClick={() => setViewMode('grid')}
                  />
                  <Button
                    kind={viewMode === 'list' ? 'primary' : 'secondary'}
                    size="md"
                    hasIconOnly
                    renderIcon={List}
                    iconDescription="Vista de lista"
                    onClick={() => setViewMode('list')}
                  />
                </div>
              </div>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* Products */}
      <Section className="category-products">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            {currentProducts.length === 0 ? (
              <div className="no-products">
                <Tile className="no-products-tile">
                  <div className="no-products-content">
                    <Filter size={48} />
                    <Heading>No se encontraron productos</Heading>
                    <p>No hay productos disponibles en esta categoría en este momento.</p>
                    <Button onClick={() => navigate('/productos')}>
                      Ver todos los productos
                    </Button>
                  </div>
                </Tile>
              </div>
            ) : (
              <div className={`products-container ${viewMode}`}>
                <Grid className="products-grid">                  {currentProducts.map((product) => (
                    <Column 
                      key={product._id} 
                      lg={viewMode === 'grid' ? 4 : 16} 
                      md={viewMode === 'grid' ? 4 : 8} 
                      sm={4}
                      className="product-col"                    >
                      <InstrumentCard 
                        article={product}
                      />
                    </Column>
                  ))}
                </Grid>
              </div>
            )}
          </Column>
        </Grid>
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Section className="category-pagination">
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className="pagination-container">
                <Pagination
                  backwardText="Anterior"
                  forwardText="Siguiente"
                  itemsPerPageText="Productos por página:"
                  page={currentPage}
                  pageNumberText="Página"
                  pageSize={productsPerPage}
                  pageSizes={[12, 24, 36]}
                  totalItems={filteredProducts.length}
                  onChange={({ page }) => setCurrentPage(page)}
                />
              </div>
            </Column>
          </Grid>
        </Section>
      )}

      {/* Related Categories */}
      {categories && categories.length > 1 && (
        <Section className="related-categories">
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className="section-header">
                <Heading className="section-title">
                  🎯 Otras Categorías
                </Heading>
                <p className="section-subtitle">
                  Explora otras categorías que podrían interesarte
                </p>
              </div>
            </Column>
          </Grid>
          
          <Grid className="categories-grid">
            {categories
              .filter(cat => cat.id !== categorySlug && cat._id !== categorySlug && cat.slug !== categorySlug)
              .slice(0, 4)
              .map((category) => (
                <Column key={category.id || category._id} lg={4} md={4} sm={4}>
                  <Tile 
                    className="category-card"
                    onClick={() => navigate(`/category/${category.id || category._id}`)}
                  >
                    <div className="category-icon">🎵</div>
                    <h4 className="category-name">{category.name}</h4>
                    <p className="category-description">
                      {category.description || `Explora ${category.name.toLowerCase()}`}
                    </p>
                    <Button kind="ghost" size="sm">
                      Ver productos
                    </Button>
                  </Tile>
                </Column>
              ))}
          </Grid>
        </Section>
      )}

      {/* Back to Top */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default Category;
