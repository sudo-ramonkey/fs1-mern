import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Wrapper from './components/Wrapper/Wrapper';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Category from './pages/Category';
import { getUserProfile } from './redux/slices/authSlice';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app startup
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch]);
  return (
    <Wrapper>
      <Layout>        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<AllProducts />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/category/:categoryId/:subcategory" element={<Category />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Wrapper>
  );
}

export default App;
