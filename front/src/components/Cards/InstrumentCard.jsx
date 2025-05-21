import React from 'react'
import "./styles.css"

function InstrumentCard(props) {
    const {instrument,key} = props
    return (
        <>
            <div key={key} className='instrument-card'>
                <img src={instrument.image} alt={instrument.name} className='instrument-card__img' />
                <div className='instrument-card__info'>
                    <h2 className='instrument-card__title'>{instrument.name}</h2>
                    <p className='instrument-card__description'>{instrument.description}</p>
                    <p className='instrument-card__price'>${instrument.price}</p>
                </div>
            </div>
        </>
    )
}

export default InstrumentCard