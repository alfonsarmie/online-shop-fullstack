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
import ProfileEdit from './pages/profileEdit.jsx';

function App() {
  // State to manage user authentication
  const [user, setUser] = useState(null);

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
          <Route path="/profile-edit" element={<ProfileEdit user={user} setUser={setUser} />} /> {/* <ProfileEdit /> with user and setUser props */}
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
