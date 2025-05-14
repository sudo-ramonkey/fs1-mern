import './styles.css'
import { Search , Slider} from '@carbon/react';
const AppHeader = () => {
    return (
        <>
        <header className="app-header">
            <h1>El mundo de las guitarras</h1> 
            <Search
                closeButtonLabelText="Clear search input"
                id="search-default-1"
                labelText="Label text"
                placeholder="Placeholder text"
                role="searchbox"
                size="md"
                type="text"
            />
        </header>
        <div className="app-header-nav">
                <nav>
                    <ul>
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/about">Sobre nosotros</a></li>
                        <li><a href="/contact">Contacto</a></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default AppHeader;