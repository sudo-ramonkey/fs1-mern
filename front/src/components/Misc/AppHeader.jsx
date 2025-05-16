import { useRef } from 'react';
import { Search } from '@carbon/react';
import './styles.css';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/contact', label: 'Contacto' },
  { href: '/shop', label: 'Tienda' },
  { href: '/shop/guitarras', label: 'Guitarras' },
  { href: '/shop/bajos', label: 'Bajos' },
  { href: '/shop/baterias', label: 'Baterías' },
  { href: '/shop/accesorios', label: 'Accesorios' },
];

const AppHeader = () => {
  const selected = useRef('/');

  const handleSelect = (href) => {
    selected.current = href;
    window.location.href = href;
  };

  return (
    <>
      <header className="app-header">
        <h1>El mundo de las guitarras</h1>
        <Search
          size="md"
          labelText="Buscar"
          placeholder="Buscar guitarras..."
          closeButtonLabelText="Limpiar búsqueda"
          className="app-header-search"
        />
      </header>
      <div className="app-header-nav">
        <nav>
          <ul>
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={window.location.pathname === link.href ? 'selected' : ''}
                  onClick={e => {
                    e.preventDefault();
                    handleSelect(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AppHeader;