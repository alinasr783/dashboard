import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/jsx/home.jsx';
import Products from './page/jsx/products.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;