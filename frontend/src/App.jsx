import './App.css'
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index.jsx';
import Navbar from './components/Navbar.jsx';

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  )
}

export default App
