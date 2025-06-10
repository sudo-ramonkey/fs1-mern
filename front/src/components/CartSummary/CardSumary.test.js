import React from 'react';
import { render, screen } from '@testing-library/react';
import CartSummary from './CartSummary';
import { useSelector } from 'react-redux';

// Mock de react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock de los selectores de Redux
jest.mock('../../redux/slices/cartSlice', () => ({
  selectCartTotalItems: jest.fn(),
  selectCartTotalPrice: jest.fn(),
}));

import { selectCartTotalItems, selectCartTotalPrice } from '../../redux/slices/cartSlice';

describe('CartSummary - Pruebas de Renderizado', () => {
  beforeEach(() => {
    // Resetear todos los mocks antes de cada prueba
    useSelector.mockClear();
    selectCartTotalItems.mockClear();
    selectCartTotalPrice.mockClear();
  });

  test('1. Muestra 0 productos cuando el carrito está vacío', () => {
    // Configurar mocks
    selectCartTotalItems.mockReturnValue(0);
    selectCartTotalPrice.mockReturnValue(0);
    useSelector.mockImplementation(selector => {
      if (selector === selectCartTotalItems) return 0;
      if (selector === selectCartTotalPrice) return 0;
      return null;
    });

    render(<CartSummary />);
    expect(screen.getByText('0 productos')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  test('2. Muestra 1 producto en singular', () => {
    selectCartTotalItems.mockReturnValue(1);
    selectCartTotalPrice.mockReturnValue(100);
    useSelector.mockImplementation(selector => {
      if (selector === selectCartTotalItems) return 1;
      if (selector === selectCartTotalPrice) return 100;
      return null;
    });

    render(<CartSummary />);
    expect(screen.getByText('1 producto')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  test('3. Muestra múltiples productos en plural', () => {
    selectCartTotalItems.mockReturnValue(3);
    selectCartTotalPrice.mockReturnValue(350.5);
    useSelector.mockImplementation(selector => {
      if (selector === selectCartTotalItems) return 3;
      if (selector === selectCartTotalPrice) return 350.5;
      return null;
    });

    render(<CartSummary />);
    expect(screen.getByText('3 productos')).toBeInTheDocument();
    expect(screen.getByText('$350.5')).toBeInTheDocument();
  });

  test('4. Muestra precio formateado correctamente', () => {
    selectCartTotalItems.mockReturnValue(2);
    selectCartTotalPrice.mockReturnValue(1999.99);
    useSelector.mockImplementation(selector => {
      if (selector === selectCartTotalItems) return 2;
      if (selector === selectCartTotalPrice) return 1999.99;
      return null;
    });

    render(<CartSummary />);
    expect(screen.getByText('2 productos')).toBeInTheDocument();
    expect(screen.getByText('$1,999.99')).toBeInTheDocument();
  });
});