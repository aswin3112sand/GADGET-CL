import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Image as ImageIcon,
  PackagePlus,
  PackageSearch,
  ReceiptText,
  ShoppingBag,
} from 'lucide-react';
import api, { apiErrorMessage } from '../../lib/api';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  AdminEmptyState,
  AdminPageError,
  AdminPageLoader,
  AdminPanel,
} from '../../components/admin/AdminUI';
import { isLowStock, isOutOfStock } from '../../utils/inventory';
import { formatPrice } from '../../utils/priceHelpers';
import { getProductStatus as getWorkflowProductStatus } from '../../utils/productWorkflow';

const isSameDay = (value, targetDate) => {
  const date = new Date(value);

  return date.getFullYear() === targetDate.getFullYear()
    && date.getMonth() === targetDate.getMonth()
    && date.getDate() === targetDate.getDate();
};

const getProductStatus = (product) => getWorkflowProductStatus(product, { isLowStock, isOutOfStock });

const statusToneClasses = {
  success: 'bg-emerald-50 text-emerald-900',
  warning: 'bg-amber-50 text-amber-900',
  danger: 'bg-rose-50 text-rose-900',
  info: 'bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]',
};

const quickActions = [
  {
    to: '/admin/products/new',
    label: 'Add Product',
    icon: PackagePlus,
  },
  {
    to: '/admin/orders',
    label: 'Manage Orders',
    icon: ReceiptText,
  },
  {
    to: '/admin/products?workflow=stock',
    label: 'Fix Stock Issues',
    icon: AlertTriangle,
  },
  {
    to: '/admin/products?workflow=media',
    label: 'Upload Missing Media',
    icon: ImageIcon,
  },
];

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [sectionsResponse, productsResponse, ordersResponse] = await Promise.all([
          api.get('/sections'),
          api.get('/products'),
          api.get('/admin/orders'),
        ]);

        setSections(sectionsResponse.data);
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (loadError) {
        setError(apiErrorMessage(loadError, 'Unable to load admin dashboard data.'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const todayOrders = orders.filter((order) => order.createdAt && isSameDay(order.createdAt, today));
    const yesterdayOrders = orders.filter((order) => order.createdAt && isSameDay(order.createdAt, yesterday));
    const ordersToday = todayOrders.length;
    const ordersYesterday = yesterdayOrders.length;
    const revenueToday = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const revenueYesterday = yesterdayOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const outOfStock = products.filter((product) => getProductStatus(product).label === 'Out of stock').length;
    const lowStock = products.filter((product) => getProductStatus(product).label === 'Low stock').length;
    const missingMedia = products.filter((product) => getProductStatus(product).label === 'Missing media').length;

    return {
      revenue,
      totalSales: orders.length,
      ordersToday,
      ordersYesterday,
      lowStock,
      outOfStock,
      missingMedia,
      sections: sections.length,
      revenueToday,
      revenueYesterday,
    };
  }, [orders, products, sections.length]);

  const issueProducts = useMemo(
    () => products
      .filter((product) => getProductStatus(product).label !== 'Healthy')
      .sort((left, right) => {
        const leftStatus = getProductStatus(left).label;
        const rightStatus = getProductStatus(right).label;
        const ranking = {
          'Out of stock': 3,
          'Low stock': 2,
          'Missing media': 1,
        };

        return (ranking[rightStatus] || 0) - (ranking[leftStatus] || 0);
      })
      .slice(0, 8),
    [products],
  );

  const issueProductsAnchor = (productList, label) => {
    const target = productList.find((product) => getProductStatus(product).label === label);
    if (!target) {
      return label === 'Missing media' ? '/admin/products?workflow=media' : '/admin/products?workflow=stock';
    }

    return `/admin/products/${target.id}/edit?focus=${getProductStatus(target).focus}`;
  };

  const attentionCards = [
    {
      label: 'Out of stock',
      value: metrics.outOfStock,
      icon: AlertTriangle,
      to: issueProductsAnchor(products, 'Out of stock'),
      tone: 'danger',
    },
    {
      label: 'Low stock',
      value: metrics.lowStock,
      icon: PackageSearch,
      to: issueProductsAnchor(products, 'Low stock'),
      tone: 'warning',
    },
    {
      label: 'Missing media',
      value: metrics.missingMedia,
      icon: ImageIcon,
      to: issueProductsAnchor(products, 'Missing media'),
      tone: 'info',
    },
  ];

  if (loading) {
    return <AdminPageLoader title="Loading dashboard" subtitle="Preparing sales, inventory, and operations data." />;
  }

  if (error) {
    return <AdminPageError title="Dashboard unavailable" message={error} />;
  }

  return (
    <section className="space-y-6">
      <section className="admin-panel overflow-hidden px-5 py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="admin-eyebrow">Store overview</p>
            <h2 className="mt-3 text-[2.6rem] font-semibold tracking-tight text-[var(--ink)] md:text-[3.6rem]">
              Dashboard
            </h2>
            <p className="mt-3 text-sm text-[var(--ink-soft)] md:text-base">
              Monitor store performance and manage operations
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/admin/products/new" className="admin-primary-button">
              <PackagePlus className="h-4 w-4" />
              Add Product
            </Link>
            <Link to="/admin/orders" className="admin-ghost-button">
              <ReceiptText className="h-4 w-4" />
              View Orders
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Sales"
          value={metrics.totalSales}
          hint="Completed orders"
          trend={`${metrics.ordersToday} today`}
          trendDirection={metrics.ordersToday > 0 ? 'up' : 'flat'}
          accent="from-[#d8f1df] via-[#89c79a] to-[#2f7d58]"
          tone="success"
          icon={ShoppingBag}
        />
        <AdminStatCard
          label="Orders Today"
          value={metrics.ordersToday}
          hint="Placed today"
          trend={`${metrics.ordersToday - metrics.ordersYesterday >= 0 ? '+' : ''}${metrics.ordersToday - metrics.ordersYesterday} vs yesterday`}
          trendDirection={metrics.ordersToday > metrics.ordersYesterday ? 'up' : metrics.ordersToday < metrics.ordersYesterday ? 'down' : 'flat'}
          accent="from-[#cfe3ff] via-[#7db4ff] to-[#3b82f6]"
          tone="info"
          icon={PackageSearch}
        />
        <AdminStatCard
          label="Low Stock Items"
          value={metrics.lowStock}
          hint="Need restock soon"
          trend={`${metrics.outOfStock} sold out`}
          trendDirection={metrics.outOfStock > 0 ? 'down' : 'flat'}
          accent="from-[#ffd7a1] via-[#f5a94b] to-[#ef7d33]"
          tone={metrics.lowStock > 0 ? 'warning' : 'success'}
          icon={AlertTriangle}
        />
        <AdminStatCard
          label="Revenue"
          value={formatPrice(metrics.revenue)}
          hint="Verified revenue"
          trend={`${metrics.revenueToday >= metrics.revenueYesterday ? '+' : ''}${formatPrice(Math.abs(metrics.revenueToday - metrics.revenueYesterday))} vs yesterday`}
          trendDirection={metrics.revenueToday > metrics.revenueYesterday ? 'up' : metrics.revenueToday < metrics.revenueYesterday ? 'down' : 'flat'}
          accent="from-[#f2dfb0] via-[#c9a96e] to-[#a47d3f]"
          icon={ReceiptText}
        />
      </div>

      <AdminPanel
        eyebrow="Needs attention"
        title="Needs Attention"
        description="Fix the items blocking clean store operations."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {attentionCards.map(({ label, value, icon: Icon, to, tone }) => (
            <div
              key={label}
              className="admin-list-row flex items-center justify-between gap-4 px-5 py-5"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${
                    tone === 'danger'
                      ? 'bg-rose-50 text-rose-700'
                      : tone === 'warning'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">{value}</p>
                </div>
              </div>

              <Link to={to} className="admin-ghost-button whitespace-nowrap">
                Fix Now
              </Link>
            </div>
          ))}
        </div>
      </AdminPanel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <AdminPanel
          eyebrow="Product issues"
          title="Product Issues"
          description="Review stock and media problems at a glance."
          actions={<Link to="/admin/products?workflow=stock" className="admin-ghost-button">Open Products</Link>}
        >
          {issueProducts.length === 0 ? (
            <AdminEmptyState
              title="No active product issues"
              message="Inventory and media are currently in good shape."
              icon={PackageSearch}
            />
          ) : (
            <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(26,18,11,0.07)] bg-white/84 shadow-[0_12px_26px_rgba(26,18,11,0.04)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-[#fcfbf8] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Product Name</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(26,18,11,0.06)]">
                    {issueProducts.map((product) => {
                      const status = getProductStatus(product);

                      return (
                        <tr key={product.id} className="transition-colors duration-300 hover:bg-[#fbf8f3]">
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-[var(--ink)]">{product.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                                {product.sectionName || 'Unassigned'} section
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusToneClasses[status.tone]}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[var(--ink)]">
                            {formatPrice(Number(product.price || 0))}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link to={`/admin/products/${product.id}/edit?focus=${status.focus}`} className="admin-ghost-button">
                              Fix Now
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AdminPanel>

        <AdminPanel eyebrow="Quick actions" title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-[1.2rem] border border-[rgba(26,18,11,0.07)] bg-white/84 p-4 shadow-[0_12px_26px_rgba(26,18,11,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.22)] hover:shadow-[0_18px_32px_rgba(201,169,110,0.14)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)] transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[var(--ink)]">{label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-[rgba(26,18,11,0.07)] bg-[#fcfbf8] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Live overview</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--ink-soft)]">Products</p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{products.length}</p>
              </div>
              <div>
                <p className="text-[var(--ink-soft)]">Categories</p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{metrics.sections}</p>
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
