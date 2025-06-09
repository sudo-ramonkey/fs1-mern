import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TreeView,
  TreeNode,
  Checkbox,
  Loading,
  Button,
  Search,
} from '@carbon/react';
import { Folder, FolderOpen } from '@carbon/react/icons';
import {
  fetchCategoriesThunk,
  selectCategoriesTree,
  selectCategoriesLoading,
  selectCategoriesError,
  toggleCategoryFilter,
  selectFilters,
} from '../../redux/slices/shopSlice';
import './CategoryTreeSelector.css';

const CategoryTreeSelector = ({ 
  multiple = true, 
  showProductCount = true,
  onSelectionChange,
  disabled = false,
  compact = false
}) => {
  const dispatch = useDispatch();
  const categoriesTree = useSelector(selectCategoriesTree);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);
  const filters = useSelector(selectFilters);
  
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTree, setFilteredTree] = useState([]);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (categoriesTree.length > 0) {
      // Auto-expand root nodes
      const rootIds = categoriesTree.map(cat => cat._id);
      setExpandedNodes(new Set(rootIds));
      setFilteredTree(categoriesTree);
    }
  }, [categoriesTree]);

  const filterCategoriesBySearch = useCallback((categories, search) => {
    const searchLower = search.toLowerCase();
    return categories.reduce((acc, category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchLower);
      const filteredChildren = category.children 
        ? filterCategoriesBySearch(category.children, search)
        : [];
      
      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...category,
          children: filteredChildren
        });
      }
      
      return acc;
    }, []);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      // Filter categories based on search term
      const filtered = filterCategoriesBySearch(categoriesTree, searchTerm);
      setFilteredTree(filtered);
      
      // Expand all nodes when searching
      const allIds = getAllCategoryIds(filtered);
      setExpandedNodes(new Set(allIds));
    } else {
      setFilteredTree(categoriesTree);
    }
  }, [searchTerm, categoriesTree, filterCategoriesBySearch]);

  const getAllCategoryIds = (categories) => {
    const ids = [];
    const traverse = (cats) => {
      cats.forEach(cat => {
        ids.push(cat._id);
        if (cat.children) {
          traverse(cat.children);
        }
      });
    };
    traverse(categories);
    return ids;
  };

  const handleNodeToggle = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCategorySelect = (categoryId) => {
    if (disabled) return;
    
    dispatch(toggleCategoryFilter(categoryId));
    
    if (onSelectionChange) {
      onSelectionChange(categoryId);
    }
  };

  const renderCategoryNode = (category) => {
    const isSelected = filters.selectedCategories.includes(category._id);
    const isExpanded = expandedNodes.has(category._id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <TreeNode
        key={category._id}
        id={category._id}
        value={category._id}
        label={
          <div className={`category-node ${compact ? 'compact' : ''}`}>
            {multiple && (
              <Checkbox
                id={`category-${category._id}`}
                checked={isSelected}
                onChange={() => handleCategorySelect(category._id)}
                labelText=""
                hideLabel
                disabled={disabled}
              />
            )}
            
            <div 
              className="category-label"
              onClick={() => !multiple && handleCategorySelect(category._id)}
            >
              <span className="category-name">{category.name}</span>
              {showProductCount && category.productCount !== undefined && (
                <span className="product-count">({category.productCount})</span>
              )}
            </div>
          </div>
        }
        isExpanded={isExpanded}
        renderIcon={({ expanded, leaf }) => {
          if (leaf || !hasChildren) {
            return <Folder size={16} />;
          }
          return expanded ? <FolderOpen size={16} /> : <Folder size={16} />;
        }}
        onToggle={() => hasChildren && handleNodeToggle(category._id)}
      >
        {hasChildren && isExpanded && category.children.map(renderCategoryNode)}
      </TreeNode>
    );
  };

  if (categoriesLoading) {
    return (
      <div className="category-tree-loading">
        <Loading description="Cargando categorías..." />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="category-tree-error">
        <p>Error al cargar categorías: {categoriesError}</p>
        <Button 
          size="sm" 
          onClick={() => dispatch(fetchCategoriesThunk())}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={`category-tree-selector ${compact ? 'compact' : ''}`}>
      {!compact && (
        <div className="category-search">
          <Search
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
          />
        </div>
      )}
      
      <div className="category-tree">
        {filteredTree.length > 0 ? (
          <TreeView
            hideLabel
            size={compact ? 'sm' : 'default'}
          >
            {filteredTree.map(renderCategoryNode)}
          </TreeView>
        ) : (
          <div className="no-categories">
            {searchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTreeSelector;
