import './App.css'
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
