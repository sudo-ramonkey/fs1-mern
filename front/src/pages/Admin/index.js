import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import './Admin.css';

const Admin = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'Admin') {
      // Redirect to home or show unauthorized message
      window.location.href = '/';
    }
  }, [isAuthenticated, user]);

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== 'Admin') {
    return (
      <div className="admin-unauthorized">
        <h2>Acceso No Autorizado</h2>
        <p>Solo los administradores pueden acceder a esta página.</p>
      </div>
    );
  }

  const handleProductCreated = () => {
    setActiveTab('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProductUpdated = () => {
    setActiveTab('list');
    setEditingProduct(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('form');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('list');
  };

  const handleProductDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user.username}</p>
      </div>

      <div className="admin-nav">
        <button
          className={`admin-nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('list');
            setEditingProduct(null);
          }}
        >
          Lista de Productos
        </button>
        <button
          className={`admin-nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            setEditingProduct(null);
          }}
        >
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'list' && (
          <ProductList
            onEditProduct={handleEditProduct}
            onProductDeleted={handleProductDeleted}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === 'form' && (
          <ProductForm
            product={editingProduct}
            onProductCreated={handleProductCreated}
            onProductUpdated={handleProductUpdated}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
