import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { useCart } from './hooks/useCart';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CartIcon from './components/CartIcon';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import OffersPage from './pages/OffersPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSectionsPage from './pages/admin/AdminSectionsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSecurityPage from './pages/admin/AdminSecurityPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const {
    cart,
    setCart,
    drawerOpen,
    setDrawerOpen,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <>
      <ScrollToTop />

      {!isAdminRoute ? (
        <>
          <Navbar
            cartSlot={(
              <CartIcon
                count={totalItems}
                onClick={() => setDrawerOpen(true)}
              />
            )}
          />

          <CartDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            cart={cart}
            setCart={setCart}
          />
        </>
      ) : null}

      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="/offers" element={<OffersPage addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={(
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              totalPrice={totalPrice}
            />
          )}
        />
        <Route
          path="/checkout"
          element={(
            <CheckoutPage
              cart={cart}
              totalPrice={totalPrice}
              clearCart={clearCart}
            />
          )}
        />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="sections" element={<AdminSectionsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductsPage />} />
            <Route path="products/:productId/edit" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute ? <Footer /> : null}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AdminAuthProvider>
      <AppShell />
    </AdminAuthProvider>
  </BrowserRouter>
);

export default App;
