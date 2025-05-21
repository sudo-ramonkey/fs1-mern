import React from 'react'
import FilterPopUp from '../components/FilterPopUp/FilterPopUp'
import InstrumentCard from '../components/Cards/InstrumentCard'
import { useSelector } from 'react-redux';
import "./styles.css"

const Home = () => {
    const {
        articles
    } = useSelector(state => state.shop);

    return (
        <div>
            <FilterPopUp />
            <div className='ArticleWrapper'>
            {
                articles.map((article) => (
                    <InstrumentCard key={article.id} instrument={article} />
                ))
            }
            </div>
        </div>
    )
}

export default Home