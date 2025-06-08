import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '@carbon/react';
import { fetchProductosThunk, selectFilteredProducts, applyFilters } from '../redux/slices/shopSlice';
import FilterPopUp from '../components/FilterPopUp/FilterPopUp';
import ProductCard from '../components/Cards/InstrumentCard';
import "./styles.css"

const Home = () => {
    const dispatch = useDispatch();
    const productos = useSelector(selectFilteredProducts);
    
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
        <div className="home-container">
            <div className="home-header">
                <FilterPopUp />
                <div className="products-count">
                    Mostrando {paginatedData.length} de {productos.length} productos
                </div>
            </div>
            
            <div className='articleWrapper'>
                {paginatedData.map((producto) => (
                    <ProductCard key={producto.id || producto._id} article={producto} />
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
                    <p>Intenta ajustar los filtros para ver más resultados.</p>
                </div>
            )}
        </div>
    );
};

export default Home;