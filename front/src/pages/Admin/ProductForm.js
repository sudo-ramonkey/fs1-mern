import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createProductService, updateProductService } from '../../service/service';
import { fetchCategoriesThunk } from '../../redux/slices/shopSlice';
import CategoryTreeSelector from '../../components/CategoryTreeSelector/CategoryTreeSelector';

const ProductForm = ({ product, onProductCreated, onProductUpdated, onCancel }) => {
  const dispatch = useDispatch();
  const { categoriesTree, categoriesLoading } = useSelector(state => state.shop);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    marca: '',
    stock: '',
    tipo: 'Instrumento',
    imagenes: ['', '', ''],
    categories: [], // Changed from categoriaProducto to categories array
    subcategoriaAccesorio: '',
    // Instrumento fields
    categoria: '',
    tipoInstrumento: '',
    materialCuerpo: '',
    materialMastil: '',
    materialDiapason: '',
    numeroCuerdas: '',
    color: '',
    incluyeEstuche: false,
    subcategoriaInstrumento: '',
    // Equipo fields
    tipoEquipo: '',
    potencia: '',
    entradas: '',
    salidas: '',
    caracteristicasAdicionales: '',
    // Accesorio fields
    tipoAccesorio: '',
    compatibilidad: '',
    material: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    if (!categoriesTree || categoriesTree.length === 0) {
      dispatch(fetchCategoriesThunk());
    }
  }, [dispatch, categoriesTree]);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        marca: product.marca || '',
        stock: product.stock || '',
        tipo: product.tipo || 'Instrumento',
        imagenes: product.imagenes || ['', '', ''],
        categories: product.categories || [], // Updated from categoriaProducto
        subcategoriaAccesorio: product.subcategoriaAccesorio || '',
        // Instrumento fields
        categoria: product.categoria || '',
        tipoInstrumento: product.tipoInstrumento || '',
        materialCuerpo: product.materialCuerpo || '',
        materialMastil: product.materialMastil || '',
        materialDiapason: product.materialDiapason || '',
        numeroCuerdas: product.numeroCuerdas || '',
        color: product.color || '',
        incluyeEstuche: product.incluyeEstuche || false,
        subcategoriaInstrumento: product.subcategoriaInstrumento || '',
        // Equipo fields
        tipoEquipo: product.tipoEquipo || '',
        potencia: product.potencia || '',
        entradas: product.entradas || '',
        salidas: product.salidas || '',
        caracteristicasAdicionales: product.caracteristicasAdicionales || '',
        // Accesorio fields
        tipoAccesorio: product.tipoAccesorio || '',
        compatibilidad: product.compatibilidad || '',
        material: product.material || ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (selectedCategories) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagenes];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      imagenes: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Clean up the data before sending
      const cleanData = { ...formData };

      // Remove empty images
      cleanData.imagenes = cleanData.imagenes.filter(img => img.trim() !== '');

      // Convert numbers
      if (cleanData.precio) cleanData.precio = Number(cleanData.precio);
      if (cleanData.stock) cleanData.stock = Number(cleanData.stock);
      if (cleanData.potencia) cleanData.potencia = Number(cleanData.potencia);
      if (cleanData.entradas) cleanData.entradas = Number(cleanData.entradas);
      if (cleanData.salidas) cleanData.salidas = Number(cleanData.salidas);
      if (cleanData.numeroCuerdas) cleanData.numeroCuerdas = Number(cleanData.numeroCuerdas);

      // Clean up empty enum values that could cause validation errors
      if (cleanData.marca === '') delete cleanData.marca;
      if (cleanData.categoriaProducto === '') delete cleanData.categoriaProducto;

      // Remove empty fields based on type
      if (cleanData.tipo !== 'Instrumento') {
        delete cleanData.categoria;
        delete cleanData.tipoInstrumento;
        delete cleanData.materialCuerpo;
        delete cleanData.materialMastil;
        delete cleanData.materialDiapason;
        delete cleanData.numeroCuerdas;
        delete cleanData.incluyeEstuche;
        delete cleanData.subcategoriaInstrumento;
      } else {
        // For instruments, clean up empty enum values
        if (cleanData.categoria === '') delete cleanData.categoria;
        if (cleanData.tipoInstrumento === '') delete cleanData.tipoInstrumento;
        if (cleanData.subcategoriaInstrumento === '') delete cleanData.subcategoriaInstrumento;
      }

      if (cleanData.tipo !== 'Equipo') {
        delete cleanData.tipoEquipo;
        delete cleanData.potencia;
        delete cleanData.entradas;
        delete cleanData.salidas;
        delete cleanData.caracteristicasAdicionales;
      } else {
        // For equipment, clean up empty enum values
        if (cleanData.tipoEquipo === '') delete cleanData.tipoEquipo;
      }

      if (cleanData.tipo !== 'Accesorio') {
        delete cleanData.tipoAccesorio;
        delete cleanData.compatibilidad;
        delete cleanData.subcategoriaAccesorio;
      } else {
        // For accessories, remove empty string values to avoid enum validation errors
        if (cleanData.subcategoriaAccesorio === '') {
          delete cleanData.subcategoriaAccesorio;
        }
        if (cleanData.tipoAccesorio === '') {
          delete cleanData.tipoAccesorio;
        }
        if (cleanData.compatibilidad === '') {
          delete cleanData.compatibilidad;
        }
      }

      if (product) {
        // Update existing product
        await updateProductService(product._id, cleanData);
        setSuccess('Producto actualizado exitosamente');
        setTimeout(() => {
          onProductUpdated();
        }, 1500);
      } else {
        // Create new product
        await createProductService(cleanData);
        setSuccess('Producto creado exitosamente');
        setTimeout(() => {
          onProductCreated();
        }, 1500);
      }
    } catch (err) {
      setError(err.error || 'Error al guardar el producto');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const marcasOptions = [
    "Fender", "Squier", "Jackson", "LTD", "Ibanez",
    "Epiphone", "EVH", "Gretsch", "Gibson", "Martin",
    "Taylor", "Yamaha", "PRS", "Behringer", "Elixir",
    "Dunlop", "Snark", "Otros"
  ];

  const tiposAccesorios = [
    "Atriles & Soportes", "Afinadores & Metronomos", "Fundas & Estuches",
    "Cables", "Capos", "Cuerdas Guitarra Acustica", "Cuerdas Guitarra Electrica",
    "Herramientas & Limpiadores", "Pastillas", "Puas", "Refacciones & Partes",
    "Slides", "Tahalis", "Lifestyle", "Correa", "Otro"
  ];

  return (
    <div className="product-form">
      <div className="form-header">
        <h2>{product ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form-content">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              >
                <option value="Instrumento">Instrumento</option>
                <option value="Equipo">Equipo</option>
                <option value="Accesorio">Accesorio</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <select
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar marca</option>
                {marcasOptions.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoriaProducto">Categorías del Producto</label>
              <div className="category-selector-wrapper">
                <CategoryTreeSelector
                  categories={categoriesTree}
                  selectedCategories={formData.categories}
                  onSelectionChange={handleCategoryChange}
                  allowMultiple={true}
                  showProductCount={false}
                  disabled={categoriesLoading}
                />
                {categoriesLoading && <div className="loading-message">Cargando categorías...</div>}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="form-section">
          <h3>Imágenes</h3>
          <p className="section-description">Puedes agregar hasta 3 imágenes (URLs)</p>
          <div className="images-grid">
            {formData.imagenes.map((imagen, index) => (
              <div key={index} className="form-group">
                <label htmlFor={`imagen${index}`}>Imagen {index + 1}</label>
                <input
                  type="url"
                  id={`imagen${index}`}
                  value={imagen}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="URL de la imagen"
                />
                {imagen && (
                  <div className="image-preview">
                    <img
                      src={imagen}
                      alt={`Preview ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instrument Specific Fields */}
        {formData.tipo === 'Instrumento' && (
          <div className="form-section">
            <h3>Especificaciones de Instrumento</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="categoria">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Acustico">Acústico</option>
                  <option value="Electrico">Eléctrico</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipoInstrumento">Tipo de Instrumento</label>
                <select
                  id="tipoInstrumento"
                  name="tipoInstrumento"
                  value={formData.tipoInstrumento}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Guitarra">Guitarra</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Ukelele">Ukelele</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="materialCuerpo">Material del Cuerpo</label>
                <input
                  type="text"
                  id="materialCuerpo"
                  name="materialCuerpo"
                  value={formData.materialCuerpo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="materialMastil">Material del Mástil</label>
                <input
                  type="text"
                  id="materialMastil"
                  name="materialMastil"
                  value={formData.materialMastil}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="materialDiapason">Material del Diapasón</label>
                <input
                  type="text"
                  id="materialDiapason"
                  name="materialDiapason"
                  value={formData.materialDiapason}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroCuerdas">Número de Cuerdas</label>
                <input
                  type="number"
                  id="numeroCuerdas"
                  name="numeroCuerdas"
                  value={formData.numeroCuerdas}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="incluyeEstuche">
                  <input
                    type="checkbox"
                    id="incluyeEstuche"
                    name="incluyeEstuche"
                    checked={formData.incluyeEstuche}
                    onChange={handleInputChange}
                  />
                  Incluye Estuche
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Specific Fields */}
        {formData.tipo === 'Equipo' && (
          <div className="form-section">
            <h3>Especificaciones de Equipo</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoEquipo">Tipo de Equipo</label>
                <select
                  id="tipoEquipo"
                  name="tipoEquipo"
                  value={formData.tipoEquipo}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Mezcladora">Mezcladora</option>
                  <option value="Amplificador">Amplificador</option>
                  <option value="Parlante">Parlante</option>
                  <option value="Efecto">Efecto</option>
                  <option value="Interfaz">Interfaz</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="potencia">Potencia (W)</label>
                <input
                  type="number"
                  id="potencia"
                  name="potencia"
                  value={formData.potencia}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="entradas">Número de Entradas</label>
                <input
                  type="number"
                  id="entradas"
                  name="entradas"
                  value={formData.entradas}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salidas">Número de Salidas</label>
                <input
                  type="number"
                  id="salidas"
                  name="salidas"
                  value={formData.salidas}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="caracteristicasAdicionales">Características Adicionales</label>
              <textarea
                id="caracteristicasAdicionales"
                name="caracteristicasAdicionales"
                value={formData.caracteristicasAdicionales}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </div>
        )}

        {/* Accessory Specific Fields */}
        {formData.tipo === 'Accesorio' && (
          <div className="form-section">
            <h3>Especificaciones de Accesorio</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoAccesorio">Tipo de Accesorio</label>
                <select
                  id="tipoAccesorio"
                  name="tipoAccesorio"
                  value={formData.tipoAccesorio}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposAccesorios.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategoriaAccesorio">Subcategoría de Accesorio</label>
                <select
                  id="subcategoriaAccesorio"
                  name="subcategoriaAccesorio"
                  value={formData.subcategoriaAccesorio}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar subcategoría</option>
                  <option value="Atriles & Soportes">Atriles & Soportes</option>
                  <option value="Afinadores & Metronomos">Afinadores & Metronomos</option>
                  <option value="Fundas & Estuches">Fundas & Estuches</option>
                  <option value="Cables">Cables</option>
                  <option value="Capos">Capos</option>
                  <option value="Cuerdas Guitarra Acustica">Cuerdas Guitarra Acustica</option>
                  <option value="Cuerdas Guitarra Electrica">Cuerdas Guitarra Electrica</option>
                  <option value="Herramientas & Limpiadores">Herramientas & Limpiadores</option>
                  <option value="Pastillas">Pastillas</option>
                  <option value="Puas">Puas</option>
                  <option value="Refacciones & Partes">Refacciones & Partes</option>
                  <option value="Slides">Slides</option>
                  <option value="Tahalis">Tahalis</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="compatibilidad">Compatibilidad</label>
                <select
                  id="compatibilidad"
                  name="compatibilidad"
                  value={formData.compatibilidad}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar compatibilidad</option>
                  <option value="Guitarra Eléctrica">Guitarra Eléctrica</option>
                  <option value="Guitarra Acústica">Guitarra Acústica</option>
                  <option value="Bajo Eléctrico">Bajo Eléctrico</option>
                  <option value="Bajo Acústico">Bajo Acústico</option>
                  <option value="Universal">Universal</option>
                  <option value="Amplificador">Amplificador</option>
                  <option value="Efectos">Efectos</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
