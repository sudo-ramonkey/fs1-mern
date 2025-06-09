import axios from "axios";

const API_URL = "http://fs1.teclaguna.systems:5000"; // Cambia esto por la URL de tu API

const fetchProductos = async () => {
  try {
    const response = await axios.get(API_URL + "/api/productos");
    console.log("Datos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};

// Auth services
export const loginService = async ({ login, password }) => {
  try {
    const response = await axios.post(API_URL + "/api/auth/login", {
      login,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const registerService = async (userData) => {
  try {
    const response = await axios.post(API_URL + "/api/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getProfileService = async (token) => {
  try {
    const response = await axios.get(API_URL + "/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const logoutService = async (token) => {
  try {
    await axios.post(
      API_URL + "/api/auth/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return {};
  } catch (error) {
    return {};
  }
};

// Auth services para actualizar perfil
export const updateProfileService = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(API_URL + "/api/auth/profile", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const changePasswordService = async (passwordData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      API_URL + "/api/auth/change-password",
      passwordData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

// Admin Product Management Services
export const createProductService = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL + "/api/productos", productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const updateProductService = async (productId, productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      API_URL + `/api/productos/${productId}`,
      productData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const deleteProductService = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      API_URL + `/api/productos/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getProductByIdService = async (productId) => {
  try {
    const response = await axios.get(API_URL + `/api/productos/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

// Category Management Services
export const getCategoriesService = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/api/categories${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getRootCategoriesService = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/roots`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getCategoryByIdService = async (categoryId, params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/api/categories/${categoryId}${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getCategoryBySlugService = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/slug/${slug}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const getCategoryBreadcrumbService = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/${categoryId}/breadcrumb`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const searchCategoriesService = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/search`, {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

// Admin Category Management Services
export const createCategoryService = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/categories`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const updateCategoryService = async (categoryId, categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/categories/${categoryId}`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const deleteCategoryService = async (categoryId, options = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/api/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: options
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const moveCategoryService = async (categoryId, moveData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/categories/${categoryId}/move`, moveData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const reorderCategoriesService = async (categoryOrders) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/categories/reorder`, { categoryOrders }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export const updateProductCountsService = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/categories/update-product-counts`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: "Network error" };
  }
};

export { fetchProductos };
