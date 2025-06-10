import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from './InstrumentCard';

// Mock del hook useCart
jest.mock('../../hooks/useCart', () => ({
  __esModule: true,
  default: () => ({
    addItem: jest.fn(),
    getItemQuantity: () => 0,
  }),
}));

jest.mock('@carbon/react', () => ({
  Button: ({ children, disabled }) => (
    <button disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  ShoppingCart: () => <span>CartIcon</span>,
  View: () => <span>ViewIcon</span>,
}));


jest.mock('../ProductModal/ProductModal', () => () => null);

describe('ProductCard - Pruebas de Renderizado', () => {
  const mockProduct = {
    _id: '123',
    nombre: 'Guitarra Acústica',
    descripcion: 'Guitarra de concierto profesional',
    precio: 899.99,
    imagenes: ['/guitar.jpg'],
    marca: 'Yamaha',
    stock: 5
  };

  test('1. Renderiza el nombre y la marca del producto', () => {
    render(<ProductCard producto={mockProduct} />);
    expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.marca)).toBeInTheDocument();
  });

  test('2. Muestra el precio formateado correctamente', () => {
    render(<ProductCard producto={mockProduct} />);
    expect(screen.getByText('$899.99')).toBeInTheDocument();
  });

  test('3. Muestra imagen del producto', () => {
    render(<ProductCard producto={mockProduct} />);
    const img = screen.getByAltText(mockProduct.nombre);
    expect(img).toHaveAttribute('src', mockProduct.imagenes[0]);
  });

  test('4. Renderiza correctamente el botón principal', () => {
    render(<ProductCard producto={mockProduct} />);
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });
});