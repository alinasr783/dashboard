import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/jsx/home.jsx';
import Products from './page/jsx/products.jsx';
import Product from './page/jsx/product.jsx';
import Orders from './page/jsx/orders.jsx';
import Order from './page/jsx/order.jsx';
import Users from './page/jsx/users.jsx';
import Category from './page/jsx/category.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/users" element={<Users />} />
        <Route path="/category" element={<Category />} />
      </Routes>
    </Router>
  );
}

export default App;