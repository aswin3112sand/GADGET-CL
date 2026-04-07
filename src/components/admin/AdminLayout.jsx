import { useMemo } from 'react';
import {
  Bell,
  LayoutDashboard,
  Layers3,
  LogOut,
  PackageSearch,
  ReceiptText,
  Settings2,
  Users,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/products',
    label: 'Products',
    icon: PackageSearch,
  },
  {
    to: '/admin/sections',
    label: 'Sections',
    icon: Layers3,
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: ReceiptText,
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    to: '/admin/security',
    label: 'Settings',
    icon: Settings2,
  },
];

const themeMap = {
  dashboard: {
    accent: '#C9A96E',
    accentStrong: '#A47D3F',
    accentTint: 'rgba(201, 169, 110, 0.16)',
    accentTintStrong: 'rgba(201, 169, 110, 0.28)',
    accentText: '#7C6338',
    pageGradient: 'linear-gradient(180deg, #f8f6f2 0%, #f3eee6 100%)',
  },
  products: {
    accent: '#3B82F6',
    accentStrong: '#1D4ED8',
    accentTint: 'rgba(59, 130, 246, 0.14)',
    accentTintStrong: 'rgba(59, 130, 246, 0.24)',
    accentText: '#2157A6',
    pageGradient: 'linear-gradient(180deg, #f5f9ff 0%, #eef5ff 100%)',
  },
  orders: {
    accent: '#10B981',
    accentStrong: '#047857',
    accentTint: 'rgba(16, 185, 129, 0.14)',
    accentTintStrong: 'rgba(16, 185, 129, 0.24)',
    accentText: '#0A7D59',
    pageGradient: 'linear-gradient(180deg, #f4fbf7 0%, #ecf8f1 100%)',
  },
  customers: {
    accent: '#8B5CF6',
    accentStrong: '#6D28D9',
    accentTint: 'rgba(139, 92, 246, 0.14)',
    accentTintStrong: 'rgba(139, 92, 246, 0.24)',
    accentText: '#6533C5',
    pageGradient: 'linear-gradient(180deg, #f8f5ff 0%, #f1edff 100%)',
  },
  settings: {
    accent: '#6B7280',
    accentStrong: '#374151',
    accentTint: 'rgba(107, 114, 128, 0.14)',
    accentTintStrong: 'rgba(107, 114, 128, 0.24)',
    accentText: '#4B5563',
    pageGradient: 'linear-gradient(180deg, #f8f8f9 0%, #f2f4f7 100%)',
  },
};

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();

  const currentMeta = useMemo(() => {
    if (location.pathname === '/admin') {
      return {
        theme: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Store overview and priority actions',
      };
    }

    if (location.pathname.startsWith('/admin/products')) {
      return {
        theme: 'products',
        title: 'Products',
        subtitle: 'Inventory, stock, and pricing',
      };
    }

    if (location.pathname.startsWith('/admin/orders')) {
      return {
        theme: 'orders',
        title: 'Orders',
        subtitle: 'Verified checkout activity',
      };
    }

    if (location.pathname.startsWith('/admin/customers')) {
      return {
        theme: 'customers',
        title: 'Customers',
        subtitle: 'Repeat buyers and contact history',
      };
    }

    if (location.pathname.startsWith('/admin/sections')) {
      return {
        theme: 'products',
        title: 'Categories',
        subtitle: 'Store structure and navigation',
      };
    }

    if (location.pathname.startsWith('/admin/security')) {
      return {
        theme: 'settings',
        title: 'Settings',
        subtitle: 'Access and account controls',
      };
    }

    return {
      theme: 'dashboard',
      title: 'Admin',
      subtitle: 'Workspace',
    };
  }, [location.pathname]);

  const currentTheme = themeMap[currentMeta.theme] || themeMap.dashboard;

  const adminEmail = admin?.email || 'admin@gadget69.com';
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  return (
    <main
      className="min-h-screen text-[#1a120b]"
      style={{
        background: currentTheme.pageGradient,
        '--admin-accent': currentTheme.accent,
        '--admin-accent-strong': currentTheme.accentStrong,
        '--admin-accent-tint': currentTheme.accentTint,
        '--admin-accent-tint-strong': currentTheme.accentTintStrong,
        '--admin-accent-text': currentTheme.accentText,
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-[1560px] flex-col gap-5 px-4 py-4 lg:px-6 xl:flex-row xl:items-start xl:gap-7 xl:px-7">
        <aside className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:w-[15rem] xl:flex-none">
          <div className="flex flex-col gap-4 rounded-[1.6rem] border border-[rgba(26,18,11,0.06)] bg-white/68 p-3 shadow-[0_18px_44px_rgba(26,18,11,0.06)] backdrop-blur-xl xl:h-full">
            <Link
              to="/"
              className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] text-xl font-black text-[#1a120b] shadow-[0_16px_28px_rgba(26,18,11,0.12)]"
              style={{ background: `linear-gradient(135deg, ${currentTheme.accentTintStrong} 0%, ${currentTheme.accent} 52%, ${currentTheme.accentStrong} 100%)` }}
              aria-label="Back to storefront"
            >
              G
            </Link>

            <nav className="grid grid-cols-2 gap-2 pb-1 sm:grid-cols-3 xl:flex xl:flex-1 xl:flex-col xl:pb-0">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `group relative rounded-[1.1rem] px-3 py-3 transition-all duration-300 ${
                    isActive
                      ? 'text-[#1a120b] shadow-[0_12px_28px_rgba(26,18,11,0.08)]'
                      : 'text-[#6b5d50] hover:bg-white/78 hover:text-[#1a120b] hover:shadow-[0_10px_24px_rgba(201,169,110,0.12)]'
                  }`}
                  style={({ isActive }) => isActive ? { background: 'var(--admin-accent-tint)' } : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-full transition-all duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                      }`}
                        style={{ backgroundColor: 'var(--admin-accent)' }}
                      />
                      <span className="flex items-center gap-3 pl-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-[0.95rem] border transition-all duration-300 ${
                          isActive
                            ? 'border-[var(--admin-accent-tint-strong)] bg-white/74 text-[var(--admin-accent-text)]'
                            : 'border-transparent bg-transparent text-[#7b6c5c] group-hover:border-[var(--admin-accent-tint-strong)] group-hover:bg-white/76 group-hover:text-[var(--admin-accent-text)]'
                        }`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-sm font-semibold">{label}</span>
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-4 z-20 mb-6 rounded-[1.5rem] border border-[rgba(26,18,11,0.06)] bg-white/74 px-5 py-4 shadow-[0_18px_44px_rgba(26,18,11,0.06)] backdrop-blur-xl md:px-6">
            <div className="mb-4 h-1.5 w-full rounded-full" style={{ background: `linear-gradient(90deg, ${currentTheme.accent} 0%, ${currentTheme.accentStrong} 100%)` }} />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--admin-accent-text)]">
                  Gadget69 admin
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1a120b] md:text-[2rem]">
                  {currentMeta.title}
                </h1>
                <p className="mt-1 text-sm text-[#756657]">{currentMeta.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[rgba(26,18,11,0.08)] bg-white/82 text-[#1a120b] shadow-[0_10px_24px_rgba(26,18,11,0.04)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(26,18,11,0.08)]"
                  style={{ borderColor: 'var(--admin-accent-tint-strong)' }}
                  aria-label="Notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--admin-accent)]" />
                </button>

                <div className="flex items-center gap-3 rounded-[1rem] border border-[rgba(26,18,11,0.06)] bg-white/82 px-3 py-2 shadow-[0_10px_24px_rgba(26,18,11,0.04)]">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] text-sm font-bold text-[#1a120b]"
                    style={{ background: `linear-gradient(135deg, ${currentTheme.accentTintStrong} 0%, ${currentTheme.accent} 100%)` }}
                  >
                    {adminInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1a120b]">{adminEmail}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8f7c69]">Administrator</p>
                  </div>
                </div>

                <button onClick={logout} className="admin-ghost-button">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="admin-fade-in space-y-6 pb-10">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
