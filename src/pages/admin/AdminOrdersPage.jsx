import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeIndianRupee,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api, { apiErrorMessage } from '../../lib/api';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  AdminChip,
  AdminEmptyState,
  AdminPageError,
  AdminPageHeader,
  AdminPageLoader,
  AdminPanel,
} from '../../components/admin/AdminUI';
import { formatPrice } from '../../utils/priceHelpers';

const formatDateTime = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/admin/orders');
        setOrders(data);
      } catch (loadError) {
        setError(apiErrorMessage(loadError, 'Unable to load verified orders.'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const avgOrderValue = orders.length ? revenue / orders.length : 0;
    const demoOrders = orders.filter((order) => order.demoMode).length;
    const liveOrders = orders.length - demoOrders;

    return {
      revenue,
      avgOrderValue,
      demoOrders,
      liveOrders,
    };
  }, [orders]);

  if (loading) {
    return <AdminPageLoader title="Loading orders" subtitle="Pulling verified customer orders and payment state." />;
  }

  if (error) {
    return <AdminPageError title="Orders unavailable" message={error} />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Payments desk"
        title="Verified orders"
        description="Audit every verified checkout from one calmer operations surface. Demo and live payments stay visible without mixing the post-purchase story."
        meta={[
          <AdminChip key="verified" tone="success">Verified only</AdminChip>,
          <AdminChip key="live" tone="neutral">Live orders: {metrics.liveOrders}</AdminChip>,
          <AdminChip key="demo" tone={metrics.demoOrders > 0 ? 'info' : 'neutral'}>
            Demo orders: {metrics.demoOrders}
          </AdminChip>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Saved Orders"
          value={orders.length}
          hint="Verified checkouts persisted in the backend."
          accent="from-[#d8c09a] via-[#b7864b] to-[#8c5d2e]"
          icon={ReceiptText}
        />
        <AdminStatCard
          label="Gross Revenue"
          value={formatPrice(metrics.revenue)}
          hint="Combined total from every verified order."
          accent="from-[#31543d] to-[#6c8a5c]"
          tone="success"
          icon={BadgeIndianRupee}
        />
        <AdminStatCard
          label="Average Order"
          value={formatPrice(metrics.avgOrderValue)}
          hint="Average value across all verified checkouts."
          accent="from-[#f59e0b] to-[#f97316]"
          tone="warning"
          icon={ShieldCheck}
        />
        <AdminStatCard
          label="Demo Checkouts"
          value={metrics.demoOrders}
          hint="Local guided confirmations captured for demos."
          accent="from-[#59402b] via-[#8c5d2e] to-[#d6b17c]"
          tone={metrics.demoOrders > 0 ? 'info' : 'neutral'}
          icon={Sparkles}
        />
      </div>

      <AdminPanel
        eyebrow="Recent activity"
        title={orders.length === 0 ? 'No verified orders yet' : `${orders.length} order${orders.length === 1 ? '' : 's'} ready for review`}
        description="Each row keeps customer, payment mode, references, and line items together so finance and fulfillment checks are faster."
      >
        {orders.length === 0 ? (
          <AdminEmptyState
            title="No verified orders yet"
            message="Once a customer finishes payment, the order will land here with payment mode, saved total, and line items."
            icon={ReceiptText}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="admin-list-row">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-[var(--ink)]">{order.customerName}</p>
                      <AdminChip tone="success">{order.paymentStatus}</AdminChip>
                      <AdminChip tone={order.demoMode ? 'info' : 'neutral'}>
                        {order.demoMode ? 'Demo mode' : 'Live gateway'}
                      </AdminChip>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-[var(--ink-soft)] md:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Order</p>
                        <p className="mt-1 text-[var(--ink)]">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Phone</p>
                        <p className="mt-1 text-[var(--ink)]">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Pincode</p>
                        <p className="mt-1 text-[var(--ink)]">{order.pincode}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Saved at</p>
                        <p className="mt-1 text-[var(--ink)]">{formatDateTime(order.createdAt)}</p>
                      </div>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">{order.address}</p>
                  </div>

                  <div className="min-w-[17rem] rounded-[1.25rem] border border-[rgba(34,24,17,0.08)] bg-[rgba(255,252,247,0.86)] px-5 py-4 shadow-[0_10px_22px_rgba(29,20,13,0.04)]">
                    <div className="flex items-center justify-between gap-4 text-sm text-[var(--ink-soft)]">
                      <span>Payment reference</span>
                      <span className="truncate text-right font-medium text-[var(--ink)]">{order.razorpayPaymentId}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[var(--ink-soft)]">
                      <span>Gateway order</span>
                      <span className="truncate text-right font-medium text-[var(--ink)]">{order.razorpayOrderId}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-sm text-[var(--ink-soft)]">Saved total</span>
                      <span className="text-2xl font-semibold text-[var(--ink)]">{formatPrice(Number(order.totalAmount || 0))}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      <ArrowRight className="h-3.5 w-3.5" />
                      {order.items.length} line item{order.items.length === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productId}`} className="rounded-[1.15rem] border border-[rgba(34,24,17,0.08)] bg-[rgba(255,252,247,0.84)] px-4 py-4 shadow-[0_10px_22px_rgba(29,20,13,0.04)]">
                      <p className="text-sm font-semibold text-[var(--ink)]">{item.productName}</p>
                      <p className="mt-1 text-xs text-[var(--ink-muted)]">Product #{item.productId}</p>
                      <div className="mt-3 flex items-center justify-between text-sm text-[var(--ink-soft)]">
                        <span>Qty {item.quantity}</span>
                        <span className="font-semibold text-[var(--ink)]">{formatPrice(Number(item.price) * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </section>
  );
};

export default AdminOrdersPage;
