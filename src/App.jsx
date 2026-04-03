import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CartIcon from './components/CartIcon';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import OffersPage from './pages/OffersPage';

const App = () => {
  const {
    cart, setCart,
    drawerOpen, setDrawerOpen,
    addToCart, totalItems,
  } = useCart();

  return (
    <BrowserRouter>
      <Navbar
        cartSlot={
          <CartIcon
            count={totalItems}
            onClick={() => setDrawerOpen(true)}
          />
        }
      />

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        setCart={setCart}
      />

      <Routes>
        <Route path="/"               element={<HomePage addToCart={addToCart} />} />
        <Route path="/products"       element={<ProductsPage addToCart={addToCart} />} />
        <Route path="/categories"     element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage addToCart={addToCart} />} />
        <Route path="/product/:id"    element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="/offers"         element={<OffersPage />} />
        <Route path="/reviews"        element={<ReviewsPage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/contact"        element={<ContactPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
