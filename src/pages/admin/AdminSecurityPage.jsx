import { useState } from 'react';
import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../../lib/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  AdminChip,
  AdminNotice,
  AdminPageHeader,
  AdminPanel,
} from '../../components/admin/AdminUI';

const AdminSecurityPage = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return 'All password fields are required.';
    }

    if (newPassword.length < 8) {
      return 'New password must be at least 8 characters long.';
    }

    if (newPassword === currentPassword) {
      return 'New password must be different from the current password.';
    }

    if (newPassword !== confirmPassword) {
      return 'Confirm password must match the new password.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.post('/admin/change-password', {
        currentPassword,
        newPassword,
      });
      logout();
      navigate('/admin/login', {
        replace: true,
        state: {
          notice: 'Password updated. Sign in again with your new password.',
        },
      });
    } catch (submitError) {
      setError(apiErrorMessage(submitError, 'Unable to update the admin password.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Access safety"
        title="Admin security"
        description="Change the admin password from one focused page without exposing credentials anywhere in the UI."
        meta={[
          <AdminChip key="account" tone="neutral">Admin: {admin?.email || 'Signed in'}</AdminChip>,
          <AdminChip key="scope" tone="success">Admin-only route</AdminChip>,
          <AdminChip key="policy" tone="info">Min 8 characters</AdminChip>,
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <AdminPanel
          eyebrow="Change password"
          title="Rotate the admin password"
          description="After a successful update, the current browser session is cleared and the admin is asked to sign in again."
          actions={<AdminChip tone="neutral">Current password required</AdminChip>}
          className="xl:sticky xl:top-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-[var(--ink-soft)]">Current password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="admin-dark-field pl-11 pr-4"
                  placeholder="Enter current password"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--ink-soft)]">New password</span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="admin-dark-field pl-11 pr-4"
                  placeholder="Enter new password"
                />
              </div>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">Use at least 8 characters and avoid reusing the current password.</p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--ink-soft)]">Confirm new password</span>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="admin-dark-field pl-11 pr-4"
                  placeholder="Re-enter new password"
                />
              </div>
            </label>

            {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}

            <button type="submit" disabled={saving} className="admin-primary-button">
              {saving ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        </AdminPanel>

        <AdminPanel
          eyebrow="Security notes"
          title="How this flow behaves"
          description="This page keeps the rules obvious before the admin submits a password change."
        >
          <div className="space-y-3">
            <div className="admin-list-row">
              <p className="text-sm font-semibold text-[var(--ink)]">Who can use this page?</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">Only a signed-in admin session can access this route or submit the password update request.</p>
            </div>
            <div className="admin-list-row">
              <p className="text-sm font-semibold text-[var(--ink)]">What happens after a successful update?</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">The current local admin session is cleared immediately and the login page prompts for the new password.</p>
            </div>
            <div className="admin-list-row">
              <p className="text-sm font-semibold text-[var(--ink)]">What is checked before submit?</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">All fields are required, the new password must be at least 8 characters, it must match confirmation, and it cannot be the same as the current password.</p>
            </div>
            <div className="admin-list-row">
              <p className="text-sm font-semibold text-[var(--ink)]">What is no longer shown in the UI?</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">The login screen no longer exposes sample admin credentials, including in localhost mode.</p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </section>
  );
};

export default AdminSecurityPage;
