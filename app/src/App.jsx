import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/jsx/home.jsx';
import Products from './page/jsx/products.jsx';
import Product from './page/jsx/product.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;