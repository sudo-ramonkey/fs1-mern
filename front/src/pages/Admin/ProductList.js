import React, { useState, useEffect } from "react";
import { fetchProductos, deleteProductService } from "../../service/service";

const ProductList = ({ onEditProduct, onProductDeleted, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProductos();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar productos");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProductService(productId);
      setDeleteConfirm(null);
      onProductDeleted();
    } catch (err) {
      setError("Error al eliminar producto");
      console.error("Error deleting product:", err);
    }
  };

  const confirmDelete = (product) => {
    setDeleteConfirm(product);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.nombre
      .toLowerCase()
      .includes(filter.toLowerCase());
    const matchesType = typeFilter === "" || product.tipo === typeFilter;
    return matchesName && matchesType;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  if (loading) {
    return <div className="admin-loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Lista de Productos ({filteredProducts.length})</h2>

        <div className="product-filters">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            <option value="Instrumento">Instrumentos</option>
            <option value="Equipo">Equipos</option>
            <option value="Accesorio">Accesorios</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-images">
              {product.imagenes && product.imagenes.length > 0 ? (
                <div className="image-gallery">
                  {product.imagenes.slice(0, 3).map((imagen, index) => (
                    <img
                      key={index}
                      src={imagen}
                      alt={`${product.nombre} - ${index + 1}`}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4=";
                        e.target.style.objectFit = "contain";
                      }}
                    />
                  ))}
                  {product.imagenes.length > 3 && (
                    <div className="more-images">
                      +{product.imagenes.length - 3} más
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-image">
                  <span>Sin imágenes</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.nombre}</h3>
              <div className="product-details">
                <p>
                  <strong>Tipo:</strong> {product.tipo}
                </p>
                <p>
                  <strong>Marca:</strong> {product.marca || "N/A"}
                </p>
                <p>
                  <strong>Precio:</strong> {formatPrice(product.precio)}
                </p>
                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>
                {product.categoriaProducto && (
                  <p>
                    <strong>Categoría:</strong> {product.categoriaProducto}
                  </p>
                )}
              </div>

              {product.descripcion && (
                <p className="product-description">
                  {product.descripcion.length > 100
                    ? `${product.descripcion.substring(0, 100)}...`
                    : product.descripcion}
                </p>
              )}

              <div className="product-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEditProduct(product)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => confirmDelete(product)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No se encontraron productos que coincidan con los filtros.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que quieres eliminar el producto "
              {deleteConfirm.nombre}"?
            </p>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancelar
              </button>
              <button
                className="btn-confirm-delete"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
