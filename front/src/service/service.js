import axios from 'axios';

const API_URL = 'http://fs1.teclaguna.systems:5000'; // Cambia esto por la URL de tu API

const fetchProductos = async () => {
    try {
        const response = await axios.get(API_URL + '/api/productos');
        console.log('Datos obtenidos:', response.data);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
};

// Auth services
export const loginService = async ({ login, password }) => {
    try {
        const response = await axios.post(API_URL + '/api/auth/login', { login, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw { error: 'Network error' };
    }
};

export const registerService = async (userData) => {
    try {
        const response = await axios.post(API_URL + '/api/auth/register', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw { error: 'Network error' };
    }
};

export const getProfileService = async (token) => {
    try {
        const response = await axios.get(API_URL + '/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw { error: 'Network error' };
    }
};

export const logoutService = async (token) => {
    try {
        await axios.post(API_URL + '/api/auth/logout', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return {};
    } catch (error) {
        return {};
    }
};

// Auth services para actualizar perfil
export const updateProfileService = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(API_URL + '/api/auth/profile', userData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { error: 'Network error' };
    }
};

export const changePasswordService = async (passwordData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(API_URL + '/api/auth/change-password', passwordData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { error: 'Network error' };
    }
};

export { fetchProductos };