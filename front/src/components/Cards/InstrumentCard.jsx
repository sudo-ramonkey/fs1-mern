import React from 'react'
import "./styles.css"

function ProductCard(props) {
    const {producto,key} = props
    return (
        <>
            <div key={key} className='instrument-card'>
                <img src={producto.imagenes[0]} alt={producto.nombre} className='instrument-card__img' />
                <div className='instrument-card__info'>
                    <h2 className='instrument-card__title'>{producto.nombre}</h2>
                    <p className='instrument-card__description'>{producto.descripcion}</p>
                    <p className='instrument-card__price'>${producto.precio}</p>
                </div>
            </div>
        </>
    )
}

export default ProductCard