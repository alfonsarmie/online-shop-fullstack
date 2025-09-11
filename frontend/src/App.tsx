// App.tsx (actualizado)
/**
 * App router and layout
 * - Decides which navbar to render based on route prefix
 * - Registers public routes and admin routes (e.g., /admin/dashboard)
 */
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './pages/Index';
import Navbar from './components/Navbar';
import NavBarAdmin from './components/NavBarAdmin';
import NavBarReceiver from './components/NavBarReceptionist';
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
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ProfileEdit from './pages/ProfileEdit';
import Delivery from './pages/Delivery';
import AdminOrders from './pages/AdminOrders';
import ReceptionistOrders from './pages/ReceptionistOrders';
import ReceptionistStock from './components/ReceptionistStock';
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

  // Determine which navbar to show based on user role
  const location = useLocation();
  // Always scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);
  const isAdminUser = user?.role === 'admin';
  const isReceptionistUser = user?.role === 'receptionist';

  return (
    <CartProvider> {/* Cart provider to use cart context */}
      <div>
        {/* Route-aware navbar: admin vs receptionist vs public */}
        {isAdminUser ? (
          <NavBarAdmin user={user} setUser={setUser} />
        ) : isReceptionistUser ? (
          <NavBarReceiver user={user} setUser={setUser} />
        ) : (
          <Navbar user={user} setUser={setUser} />
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/catalog" element={<Catalog />} />
          {/* Admin routes (kebab-case) */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-products" element={<AdminProducts />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          {/* Backwards compatibility redirects */}
          <Route path="/admindashboard" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/adminproducts" element={<Navigate to="/admin-products" replace />} />
          <Route path="/adminorders" element={<Navigate to="/admin-orders" replace />} />
          <Route path="/profile-edit" element={<ProfileEdit user={user} setUser={setUser} />} />
          <Route path="/delivery" element={<Delivery user={user} setUser={setUser} />} />
          {/* Receptionist routes (kebab-case) */}
          <Route path="/receptionist-orders" element={<ReceptionistOrders />} />
          <Route path="/receptionist-stock" element={<ReceptionistStock />} />
          {/* Backwards compatibility redirects */}
          <Route path="/receptionist" element={<Navigate to="/receptionist-orders" replace />} />
          <Route path="/receptionist/orders" element={<Navigate to="/receptionist-orders" replace />} />
          <Route path="/receptionist/stock" element={<Navigate to="/receptionist-stock" replace />} />
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
