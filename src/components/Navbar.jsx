import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    sectionId: 'home',
    matches: (pathname) => pathname === '/',
  },
  {
    key: 'products',
    label: 'Products',
    href: '/products',
    sectionId: 'products',
    matches: (pathname) => pathname === '/products' || pathname.startsWith('/product/'),
  },
  {
    key: 'categories',
    label: 'Categories',
    href: '/categories',
    sectionId: 'categories',
    matches: (pathname) => pathname === '/categories' || pathname.startsWith('/category/'),
  },
  {
    key: 'offers',
    label: 'Offers',
    href: '/offers',
    sectionId: 'offers',
    matches: (pathname) => pathname === '/offers',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    href: '/reviews',
    sectionId: 'reviews',
    matches: (pathname) => pathname === '/reviews',
  },
  {
    key: 'about',
    label: 'About',
    href: '/about',
    sectionId: 'about',
    matches: (pathname) => pathname === '/about',
  },
  {
    key: 'contact',
    label: 'Contact',
    href: '/contact',
    sectionId: 'contact',
    matches: (pathname) => pathname === '/contact',
  },
];

const HOME_SCROLL_OFFSET = 108;

const Navbar = ({ cartSlot }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('home');
      return undefined;
    }

    const sections = navLinks
      .map((link) => link.sectionId && document.getElementById(link.sectionId))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].target.id);
      }
    }, {
      rootMargin: '-42% 0px -42% 0px',
      threshold: [0, 0.18, 0.32, 0.55],
    });

    sections.forEach((section) => observer.observe(section));

    const syncEdgeSections = () => {
      if (window.scrollY < 80) {
        setActiveSection('home');
        return;
      }

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;
      if (nearBottom) {
        setActiveSection(sections[sections.length - 1].id);
      }
    };
    syncEdgeSections();
    window.addEventListener('scroll', syncEdgeSections, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncEdgeSections);
    };
  }, [isHomePage]);

  const routeActiveKey = useMemo(
    () => navLinks.find((link) => link.matches(pathname))?.key || 'home',
    [pathname],
  );
  const activeKey = isHomePage ? activeSection : routeActiveKey;

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const nextTop = section.getBoundingClientRect().top + window.scrollY - HOME_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    setActiveSection(sectionId);
    setMobileOpen(false);
  };

  const handleNavClick = (link) => (event) => {
    if (isHomePage && link.sectionId) {
      event.preventDefault();
      scrollToSection(link.sectionId);
      return;
    }

    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-500 md:px-8 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-[1.9rem] border px-4 transition-all duration-500 md:px-6 ${
          scrolled
            ? 'border-white/54 bg-[linear-gradient(135deg,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_100%)] py-3 shadow-[0_26px_64px_rgba(15,23,42,0.14),0_0_36px_rgba(86,166,255,0.1)] backdrop-blur-[28px]'
            : 'border-white/42 bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.18)_100%)] py-4 shadow-[0_20px_54px_rgba(15,23,42,0.1)] backdrop-blur-[24px]'
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(86,166,255,0.18)] bg-[rgba(255,255,255,0.72)] text-sm font-semibold text-[#1a2433] shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
            G
          </div>
          <div className="min-w-0 leading-none">
            <div className="truncate text-[0.95rem] font-semibold uppercase tracking-[0.28em] text-[#0f172a] sm:text-[1.05rem] sm:tracking-[0.42em]">
              Gadget69
            </div>
            <div className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.38em] text-[#64748b] sm:block">
              Luxury tech atelier
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/45 bg-[rgba(248,250,252,0.58)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              onClick={handleNavClick(link)}
              className="relative"
            >
              <motion.span
                animate={{ scale: activeKey === link.key ? 1.04 : 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`relative inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  activeKey === link.key
                    ? 'text-white'
                    : 'text-[#526173] hover:text-[#0f172a]'
                }`}
              >
                {activeKey === link.key ? (
                  <>
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#172554_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.18),0_0_28px_rgba(86,166,255,0.18)]"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute bottom-[0.38rem] left-4 right-4 h-[2px] rounded-full bg-[#7dd3fc]"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </>
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </motion.span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {cartSlot}

          <Link to="/products" className="hidden md:inline-flex btn-primary px-6 py-2.5 text-sm">
            Explore Collection
          </Link>

          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full border border-[rgba(86,166,255,0.14)] bg-[rgba(255,255,255,0.7)] p-3 text-[#0f172a] shadow-[0_14px_28px_rgba(15,23,42,0.08)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_44px_rgba(86,166,255,0.16)] lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-4 max-w-7xl overflow-hidden rounded-[1.8rem] border border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(248,250,252,0.72)_100%)] shadow-[0_24px_52px_rgba(15,23,42,0.12),0_0_34px_rgba(86,166,255,0.08)] backdrop-blur-[24px] lg:hidden"
          >
            <div className="border-b border-[rgba(148,163,184,0.18)] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#315dff]">
                Navigate the collection
              </p>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  onClick={handleNavClick(link)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeKey === link.key
                      ? 'bg-[linear-gradient(135deg,#0f172a_0%,#172554_100%)] text-white shadow-[0_16px_30px_rgba(15,23,42,0.16),0_0_28px_rgba(86,166,255,0.18)]'
                      : 'text-[#526173] hover:bg-white/80 hover:text-[#0f172a] hover:shadow-[0_16px_28px_rgba(86,166,255,0.1)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/products" className="btn-primary mt-3 justify-center text-sm">
                Shop premium picks
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
