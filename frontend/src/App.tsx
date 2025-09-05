import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './pages/Index';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Products from './components/Products';
import CartProvider from './components/CartContext';
import SignUp from './pages/SignUp';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import AboutUs from './pages/AboutUs';
import Catalog from './pages/Catalog';
import Admin from './pages/Admin';
import ProfileEdit from './pages/ProfileEdit';
import { User } from './types/user';

function App() {
  // State to manage user authentication
  const [user, setUser] = useState<User | null>(null);

  // Check for user in localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <CartProvider> {/* Cart provider to use cart context */}
      <div>
        <Navbar user={user} setUser={setUser} /> {/* Navbar with user and setUser props */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login setUser={setUser} />} /> {/* <Login /> component with setUser prop */}
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;