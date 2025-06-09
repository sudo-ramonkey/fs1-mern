import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Checkbox,
  NumberInput,
  Form,
  InlineNotification,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  OverflowMenu,
  OverflowMenuItem,
  Loading,
  Tag,
} from '@carbon/react';
import {
  Add,
  Edit,
  TrashCan,
  Move,
  View,
  Folder,
  FolderOpen,
} from '@carbon/react/icons';
import {
  fetchCategoriesThunk,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../redux/slices/shopSlice';
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  moveCategoryService,
  getCategoryByIdService,
} from '../../service/service';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'move'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    isActive: true,
    sortOrder: 0,
    icon: '',
    image: '',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent: '',
      isActive: true,
      sortOrder: 0,
      icon: '',
      image: '',
      metaTitle: '',
      metaDescription: '',
    });
    setError(null);
    setSuccess(null);
  };

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    
    if (category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        parent: category.parent || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        sortOrder: category.sortOrder || 0,
        icon: category.icon || '',
        image: category.image || '',
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
      });
    } else {
      resetForm();
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (modalMode === 'create') {
        await createCategoryService(formData);
        setSuccess('Categoría creada exitosamente');
      } else if (modalMode === 'edit') {
        await updateCategoryService(selectedCategory._id, formData);
        setSuccess('Categoría actualizada exitosamente');
      }

      dispatch(fetchCategoriesThunk());
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setError(err.error || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
      try {
        setLoading(true);
        await deleteCategoryService(category._id);
        setSuccess('Categoría eliminada exitosamente');
        dispatch(fetchCategoriesThunk());
      } catch (err) {
        setError(err.error || 'Error al eliminar la categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  const getRootCategories = () => {
    return categories.filter(cat => !cat.parent);
  };

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  const renderCategoryLevel = (categoryList, level = 0) => {
    return categoryList.map((category) => (
      <TableRow key={category._id}>
        <TableCell>
          <div style={{ paddingLeft: `${level * 20}px`, display: 'flex', alignItems: 'center' }}>
            {level > 0 && <span style={{ marginRight: '8px' }}>└─</span>}
            {category.children && category.children.length > 0 ? (
              <FolderOpen size={16} style={{ marginRight: '8px' }} />
            ) : (
              <Folder size={16} style={{ marginRight: '8px' }} />
            )}
            {category.name}
          </div>
        </TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell>{category.productCount || 0}</TableCell>
        <TableCell>
          <Tag type={category.isActive ? 'green' : 'red'}>
            {category.isActive ? 'Activa' : 'Inactiva'}
          </Tag>
        </TableCell>
        <TableCell>{category.level}</TableCell>
        <TableCell>
          <OverflowMenu ariaLabel="Acciones" flipped>
            <OverflowMenuItem itemText="Ver" onClick={() => console.log('Ver', category)} />
            <OverflowMenuItem itemText="Editar" onClick={() => openModal('edit', category)} />
            <OverflowMenuItem itemText="Mover" onClick={() => openModal('move', category)} />
            <OverflowMenuItem itemText="Eliminar" onClick={() => handleDelete(category)} isDelete />
          </OverflowMenu>
        </TableCell>
      </TableRow>
    ));
  };

  const buildHierarchicalRows = () => {
    const rows = [];
    const processedIds = new Set();

    const addCategoryAndChildren = (category, level = 0) => {
      if (processedIds.has(category._id)) return;
      
      processedIds.add(category._id);
      rows.push(...renderCategoryLevel([category], level));
      
      const children = getSubcategories(category._id);
      children.forEach(child => addCategoryAndChildren(child, level + 1));
    };

    const rootCategories = getRootCategories();
    rootCategories.forEach(category => addCategoryAndChildren(category));

    return rows;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { key: 'name', header: 'Nombre' },
    { key: 'slug', header: 'Slug' },
    { key: 'productCount', header: 'Productos' },
    { key: 'isActive', header: 'Estado' },
    { key: 'level', header: 'Nivel' },
    { key: 'actions', header: 'Acciones' },
  ];

  if (categoriesLoading) {
    return <Loading description="Cargando categorías..." />;
  }

  return (
    <div className="category-management">
      <div className="category-management-header">
        <h2>Gestión de Categorías</h2>
        <Button
          renderIcon={Add}
          onClick={() => openModal('create')}
        >
          Nueva Categoría
        </Button>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      {success && (
        <InlineNotification
          kind="success"
          title="Éxito"
          subtitle={success}
          onCloseButtonClick={() => setSuccess(null)}
        />
      )}

      <DataTable
        rows={searchTerm ? filteredCategories : categories}
        headers={headers}
        render={({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchTerm ? 
                filteredCategories.map(category => renderCategoryLevel([category], 0)) :
                buildHierarchicalRows()
              }
            </TableBody>
          </Table>
        )}
      />

      {/* Category Form Modal */}
      <Modal
        open={isModalOpen}
        onRequestClose={closeModal}
        modalHeading={
          modalMode === 'create' ? 'Nueva Categoría' :
          modalMode === 'edit' ? 'Editar Categoría' :
          'Mover Categoría'
        }
        primaryButtonText={loading ? 'Guardando...' : 'Guardar'}
        secondaryButtonText="Cancelar"
        onRequestSubmit={handleSubmit}
        primaryButtonDisabled={loading}
      >
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            style={{ marginBottom: '1rem' }}
          />
        )}

        {success && (
          <InlineNotification
            kind="success"
            title="Éxito"
            subtitle={success}
            style={{ marginBottom: '1rem' }}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <div className="form-grid">
            <TextInput
              id="name"
              labelText="Nombre *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />

            <TextInput
              id="slug"
              labelText="Slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              helperText="Se genera automáticamente si se deja vacío"
            />

            <Select
              id="parent"
              labelText="Categoría Padre"
              value={formData.parent}
              onChange={(e) => handleInputChange('parent', e.target.value)}
            >
              <SelectItem value="" text="Sin categoría padre (raíz)" />
              {getRootCategories().map((category) => (
                <SelectItem
                  key={category._id}
                  value={category._id}
                  text={category.name}
                />
              ))}
            </Select>

            <NumberInput
              id="sortOrder"
              label="Orden"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.imaginaryTarget.value)}
              min={0}
            />

            <TextArea
              id="description"
              labelText="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />

            <TextInput
              id="icon"
              labelText="Icono (clase CSS)"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
            />

            <TextInput
              id="image"
              labelText="Imagen (URL)"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
            />

            <TextInput
              id="metaTitle"
              labelText="Meta Título"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            />

            <TextArea
              id="metaDescription"
              labelText="Meta Descripción"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={2}
            />

            <Checkbox
              id="isActive"
              labelText="Categoría activa"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
