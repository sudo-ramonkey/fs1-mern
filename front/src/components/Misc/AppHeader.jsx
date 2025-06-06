import { useRef } from 'react';
import { useSelector } from 'react-redux';
import HeaderTooltip from './HeaderTooltip';
import './AppHeaderstyles.css';

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
      const {
        categories,
    } = useSelector(state => state.shop);

  const handleSelect = (href) => {
    selected.current = href;
    window.location.href = href;
  };

  return (
    <>
      <header className="app-header">
        <h1>LOGO</h1>
        {categories && categories.map(cat => (
          <HeaderTooltip key={cat._id || cat.name} name={cat.name} />
        ))}
      </header>
    </>
  );
};

export default AppHeader;