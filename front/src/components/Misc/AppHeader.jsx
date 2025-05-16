
import { Search } from '@carbon/react';
import './styles.css';

const AppHeader = () => {
  return (
    <>
      <header className="app-header">
        <h1>El mundo de las guitarras</h1>
        <Search
          size="lg"
          labelText="Buscar"
          placeholder="Buscar guitarras..."
          closeButtonLabelText="Limpiar búsqueda"
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
  );
};

export default AppHeader;