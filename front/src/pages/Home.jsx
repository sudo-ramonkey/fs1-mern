import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductosThunk } from '../redux/slices/shopSlice';
import FilterPopUp from '../components/FilterPopUp/FilterPopUp';
import ProductCard from '../components/Cards/InstrumentCard';
import "./styles.css"

const Home = () => {
    const dispatch = useDispatch();
    const { productos } = useSelector(state => state.shop);

    useEffect(() => {
        dispatch(fetchProductosThunk());
    }, [dispatch]);

    return (
        <div>
            <FilterPopUp />
            <div className='articleWrapper'>
                {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                ))}
            </div>
        </div>
    );
};

export default Home;