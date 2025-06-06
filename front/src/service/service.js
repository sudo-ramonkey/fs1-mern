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

export { fetchProductos };