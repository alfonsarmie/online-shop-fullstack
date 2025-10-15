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
// Intermediate screen prompting users to verify their email
import VerifyEmail from './pages/VerifyEmail';
// Screen shown after successful account activation
import AccountActivated from './pages/AccountActivated';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailure from './pages/CheckoutFailure';
import CheckoutPending from './pages/CheckoutPending';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutUs from './pages/AboutUs';
import Catalog from './pages/Catalog';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ProfileEdit from './pages/ProfileEdit';
import Delivery from './pages/Delivery';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import ReceptionistOrders from './pages/ReceptionistOrders';
import ReceptionistStock from './components/ReceptionistStock';
import MyOrders from './pages/MyOrders';
import { User } from './types/user';
import { useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/SignUp" element={<SignUp />} />
          {/* Remind newly registered users to confirm their email */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Show success message after account activation */}
          <Route path="/activate/:token" element={<AccountActivated />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failure" element={<CheckoutFailure />} />
          <Route path="/checkout/pending" element={<CheckoutPending />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/my-orders" element={<MyOrders />} />
          {/* Admin protected routes */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute user={user} requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin-products" element={
            <PrivateRoute user={user} requiredRole="admin">
              <AdminProducts />
            </PrivateRoute>
          } />
          <Route path="/admin-orders" element={
            <PrivateRoute user={user} requiredRole="admin">
              <AdminOrders />
            </PrivateRoute>
          } />
          <Route path="/admin-categories" element={
            <PrivateRoute user={user} requiredRole="admin">
              <AdminCategories />
            </PrivateRoute>
          } />
          <Route path="/admin-users" element={
            <PrivateRoute user={user} requiredRole="admin">
              <AdminUsers />
            </PrivateRoute>
          } />
          {/* Backwards compatibility redirects */}
          <Route path="/admindashboard" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/adminproducts" element={<Navigate to="/admin-products" replace />} />
          <Route path="/adminorders" element={<Navigate to="/admin-orders" replace />} />
          <Route path="/admincategories" element={<Navigate to="/admin-categories" replace />} />
          <Route path="/profile-edit" element={<ProfileEdit user={user} setUser={setUser} />} />
          <Route path="/delivery" element={<Delivery user={user} setUser={setUser} />} />
          {/* Receptionist routes protegidas */}
          <Route path="/receptionist-orders" element={
            <PrivateRoute user={user} requiredRole="receptionist">
              <ReceptionistOrders />
            </PrivateRoute>
          } />
          <Route path="/receptionist-stock" element={
            <PrivateRoute user={user} requiredRole="receptionist">
              <ReceptionistStock />
            </PrivateRoute>
          } />
          {/* Backwards compatibility redirects */}
          <Route path="/receptionist" element={<Navigate to="/receptionist-orders" replace />} />
          <Route path="/receptionist/orders" element={<Navigate to="/receptionist-orders" replace />} />
          <Route path="/receptionist/stock" element={<Navigate to="/receptionist-stock" replace />} />
        </Routes>
        <Footer />
        {/* Carrito solo para usuarios que no sean admin ni recepcionista */}
        {(!user || (user.role !== "admin" && user.role !== "receptionist")) && <Cart />}
      </div>
    </CartProvider>
  );
}

export default App;

