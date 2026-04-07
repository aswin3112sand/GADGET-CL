import { Suspense, lazy, useEffect } from 'react';
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
import { PageLoader } from './components/PageFeedback';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminSectionsPage = lazy(() => import('./pages/admin/AdminSectionsPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminSecurityPage = lazy(() => import('./pages/admin/AdminSecurityPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const SuspensePage = ({ children, title = 'Loading page', subtitle = 'Preparing the next view.' }) => (
  <Suspense
    fallback={(
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageLoader title={title} subtitle={subtitle} />
        </div>
      </main>
    )}
  >
    {children}
  </Suspense>
);

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
        <Route
          path="/products"
          element={(
            <SuspensePage title="Loading products" subtitle="Preparing the live catalog.">
              <ProductsPage addToCart={addToCart} />
            </SuspensePage>
          )}
        />
        <Route
          path="/categories"
          element={(
            <SuspensePage title="Loading categories" subtitle="Getting the storefront sections ready.">
              <CategoriesPage />
            </SuspensePage>
          )}
        />
        <Route
          path="/category/:slug"
          element={(
            <SuspensePage title="Loading category" subtitle="Preparing the filtered storefront view.">
              <CategoryPage addToCart={addToCart} />
            </SuspensePage>
          )}
        />
        <Route
          path="/product/:id"
          element={(
            <SuspensePage title="Loading product" subtitle="Fetching the full product view.">
              <ProductDetailsPage addToCart={addToCart} />
            </SuspensePage>
          )}
        />
        <Route
          path="/offers"
          element={(
            <SuspensePage title="Loading offers" subtitle="Preparing the current spotlight picks.">
              <OffersPage addToCart={addToCart} />
            </SuspensePage>
          )}
        />
        <Route
          path="/cart"
          element={(
            <SuspensePage title="Loading cart" subtitle="Restoring your selected items.">
              <CartPage
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                totalPrice={totalPrice}
              />
            </SuspensePage>
          )}
        />
        <Route
          path="/checkout"
          element={(
            <SuspensePage title="Loading checkout" subtitle="Preparing the secure payment flow.">
              <CheckoutPage
                cart={cart}
                totalPrice={totalPrice}
                clearCart={clearCart}
              />
            </SuspensePage>
          )}
        />
        <Route
          path="/checkout/success"
          element={(
            <SuspensePage title="Loading receipt" subtitle="Finalizing your order summary.">
              <CheckoutSuccessPage />
            </SuspensePage>
          )}
        />
        <Route
          path="/reviews"
          element={(
            <SuspensePage title="Loading reviews" subtitle="Preparing customer feedback.">
              <ReviewsPage />
            </SuspensePage>
          )}
        />
        <Route
          path="/about"
          element={(
            <SuspensePage title="Loading about page" subtitle="Preparing the brand story.">
              <AboutPage />
            </SuspensePage>
          )}
        />
        <Route
          path="/contact"
          element={(
            <SuspensePage title="Loading contact page" subtitle="Preparing support and contact details.">
              <ContactPage />
            </SuspensePage>
          )}
        />

        <Route
          path="/admin/login"
          element={(
            <SuspensePage title="Loading admin login" subtitle="Preparing the admin sign-in flow.">
              <AdminLoginPage />
            </SuspensePage>
          )}
        />
        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={(
              <SuspensePage title="Loading admin workspace" subtitle="Preparing the management console.">
                <AdminLayout />
              </SuspensePage>
            )}
          >
            <Route
              index
              element={(
                <SuspensePage title="Loading dashboard" subtitle="Preparing the live admin overview.">
                  <AdminDashboardPage />
                </SuspensePage>
              )}
            />
            <Route
              path="sections"
              element={(
                <SuspensePage title="Loading sections" subtitle="Preparing the catalog structure workspace.">
                  <AdminSectionsPage />
                </SuspensePage>
              )}
            />
            <Route
              path="products"
              element={(
                <SuspensePage title="Loading products" subtitle="Preparing guided product workflows.">
                  <AdminProductsPage />
                </SuspensePage>
              )}
            />
            <Route
              path="products/new"
              element={(
                <SuspensePage title="Loading product editor" subtitle="Preparing a new product workflow.">
                  <AdminProductsPage />
                </SuspensePage>
              )}
            />
            <Route
              path="products/:productId/edit"
              element={(
                <SuspensePage title="Loading product editor" subtitle="Preparing the live product workflow.">
                  <AdminProductsPage />
                </SuspensePage>
              )}
            />
            <Route
              path="orders"
              element={(
                <SuspensePage title="Loading orders" subtitle="Preparing the order management view.">
                  <AdminOrdersPage />
                </SuspensePage>
              )}
            />
            <Route
              path="customers"
              element={(
                <SuspensePage title="Loading customers" subtitle="Preparing the customer workspace.">
                  <AdminCustomersPage />
                </SuspensePage>
              )}
            />
            <Route
              path="security"
              element={(
                <SuspensePage title="Loading security" subtitle="Preparing the admin security controls.">
                  <AdminSecurityPage />
                </SuspensePage>
              )}
            />
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
