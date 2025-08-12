import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Footer from './components/Footer.jsx';
import Cart from './components/Cart.jsx';
import Products from './components/Products.jsx';
import { CartProvider } from './components/CartContext';
import SignUp from './pages/SignUp.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Checkout from './pages/Checkout.jsx';

function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;