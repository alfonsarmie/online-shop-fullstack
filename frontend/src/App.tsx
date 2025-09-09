/**
 * App router and layout
 * - Decides which navbar to render based on route prefix
 * - Registers public routes and admin routes (e.g., /admin/dashboard)
 */
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './pages/Index';
import Navbar from './components/Navbar';
import NavBarAdmin from './components/NavBarAdmin';
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
import AdminDashboard from './pages/AdminDashboard';
import ProfileEdit from './pages/ProfileEdit';
import Delivery from './pages/Delivery';
import { User } from './types/user';
import { useLocation } from 'react-router-dom';

function App() {
  // State to manage user authentication
  const [user, setUser] = useState<User | null>(null);

  // Restore logged-in user from localStorage on first mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // If the current URL starts with /admin, we show the admin navbar
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider> {/* Cart provider to use cart context */}
      <div>
        {/* Route-aware navbar: admin vs public */}
        {isAdminRoute ? (
          <NavBarAdmin user={user} setUser={setUser} />
        ) : (
          <Navbar user={user} setUser={setUser} />
        )}
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
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile-edit" element={<ProfileEdit user={user} setUser={setUser} />} />
          <Route path="/delivery" element={<Delivery user={user} setUser={setUser} />} />
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
