import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminNotice } from '../../components/admin/AdminUI';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, apiErrorMessage } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pageNotice, setPageNotice] = useState(location.state?.notice || '');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  useEffect(() => {
    setPageNotice(location.state?.notice || '');
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setPageNotice('');

    try {
      await login(email.trim(), password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (submitError) {
      setError(apiErrorMessage(submitError, 'Unable to sign in with the provided admin credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.22),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(26,18,11,0.08),transparent_18%),linear-gradient(180deg,#f5f1ea_0%,#eee5d8_100%)] text-[#1a120b]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative hidden overflow-hidden lg:flex"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a120b_0%,#2a1d14_100%)]" />
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#C8A96A]/18 blur-[110px]" />
          <div className="absolute bottom-[-7rem] right-[-6rem] h-80 w-80 rounded-full bg-[#C8A96A]/14 blur-[130px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(255,255,255,0.09),transparent_18%),radial-gradient(circle_at_78%_70%,rgba(200,169,106,0.1),transparent_22%)]" />

          <div className="relative z-10 flex min-h-screen w-full items-center px-12 xl:px-16">
            <div className="max-w-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/12 bg-white/8 text-[#f7e3bc] shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C8A96A]">
                Secure workspace
              </p>
              <h1 className="mt-4 font-display text-[3.4rem] leading-[0.92] text-[#f5f1ea] xl:text-[4rem]">
                Gadget69 Admin
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-white/62 xl:text-lg">
                Secure access to your control panel.
              </p>
            </div>
          </div>
        </motion.section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(200,169,106,0.1),transparent_20%)]" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative z-10 w-full max-w-[420px]"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#5f4d3d] transition-colors duration-300 hover:text-[#1a120b]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to storefront
              </Link>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(26,18,11,0.08)] bg-white/52 text-[#1a120b] shadow-[0_12px_28px_rgba(26,18,11,0.08)] lg:hidden">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-[20px] border border-white/44 bg-[rgba(255,255,255,0.6)] p-8 shadow-[0_28px_70px_rgba(26,18,11,0.12)] backdrop-blur-[20px] sm:p-9">
              <div>
                <p className="font-display text-[2.1rem] leading-none text-[#1a120b]">Gadget69</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a6738]">
                  Admin Portal
                </p>
                <div className="mt-5 h-px w-20 bg-[linear-gradient(90deg,#C8A96A_0%,rgba(200,169,106,0.15)_100%)]" />
              </div>

              <div className="mt-8">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#1a120b]">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6a5849]">
                  Sign in to continue to your secure control panel.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {pageNotice ? <AdminNotice tone="success">{pageNotice}</AdminNotice> : null}
                {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#4f3f31]">
                    Email
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e7d6e]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="username"
                      required
                      placeholder="admin@example.com"
                      className="w-full rounded-[12px] border border-[#ddd6cb] bg-[#f5f1ea] py-3.5 pl-11 pr-4 text-sm text-[#1a120b] outline-none transition-all duration-300 placeholder:text-[#9a8c7d] focus:border-[#C8A96A] focus:bg-white focus:shadow-[0_0_0_4px_rgba(200,169,106,0.16)]"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#4f3f31]">
                    Password
                  </span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e7d6e]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="w-full rounded-[12px] border border-[#ddd6cb] bg-[#f5f1ea] py-3.5 pl-11 pr-4 text-sm text-[#1a120b] outline-none transition-all duration-300 placeholder:text-[#9a8c7d] focus:border-[#C8A96A] focus:bg-white focus:shadow-[0_0_0_4px_rgba(200,169,106,0.16)]"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-[12px] px-4 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(200,169,106,0.34)] disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0 disabled:hover:shadow-[0_18px_36px_rgba(200,169,106,0.28)]"
                  style={{
                    background: 'linear-gradient(135deg, #C8A96A, #E6C200)',
                    boxShadow: '0 18px 36px rgba(200, 169, 106, 0.28)',
                  }}
                >
                  {submitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default AdminLoginPage;
