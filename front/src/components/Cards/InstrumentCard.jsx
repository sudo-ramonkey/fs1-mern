import React from 'react';
import "./styles.css";

function ProductCard(props) {
    const { producto } = props;
    
    if (!producto) {
        return null;
    }

    return (
        <div className='instrument-card'>
            <img 
                src={producto.imagenes?.[0] || '/placeholder-image.jpg'} 
                alt={producto.nombre || 'Producto'} 
                className='instrument-card__image' 
            />
            <h3 className='instrument-card__name'>{producto.nombre}</h3>
            <p className='instrument-card__price'>
                ${producto.precio ? producto.precio.toLocaleString() : 'N/A'}
            </p>
            <p className='instrument-card__description'>{producto.descripcion}</p>
        </div>
    );
}

export default ProductCard;