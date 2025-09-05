import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './pages/Index.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Footer from './components/Footer.jsx';
import Cart from './components/Cart.jsx';
import Products from './components/Products.jsx';
import CartProvider from './components/CartContext';
import SignUp from './pages/SignUp.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import Payment from './pages/Payment';
import AboutUs from './pages/AboutUs.jsx';
import Catalog from './pages/Catalog.jsx';
import Admin from './pages/Admin.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <CartProvider>
      <div>
        <Navbar user={user} setUser={setUser} /> {/* Pasamos user al Navbar */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pasamos setUser */}
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
