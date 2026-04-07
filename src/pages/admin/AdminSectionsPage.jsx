import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Layers3, Pencil, Plus, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../lib/api';
import {
  AdminChip,
  AdminEmptyState,
  AdminNotice,
  AdminPageError,
  AdminPageHeader,
  AdminPageLoader,
  AdminPanel,
} from '../../components/admin/AdminUI';

const initialForm = { name: '' };
const formatCountLabel = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;

const AdminSectionsPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [pageError, setPageError] = useState('');
  const [pageNotice, setPageNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadSections = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const sectionsResponse = await api.get('/sections');
      setSections(sectionsResponse.data);
    } catch (loadError) {
      setLoadError(apiErrorMessage(loadError, 'Unable to load sections.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const metrics = useMemo(() => {
    const emptySections = sections.filter((section) => Number(section.productCount || 0) === 0).length;
    return {
      emptySections,
      productCoverage: sections.filter((section) => Number(section.productCount || 0) > 0).length,
    };
  }, [sections]);

  const resetForm = ({ notice = '' } = {}) => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
    setFormNotice(notice);
    setPageError('');
    setPageNotice('');
    setConfirmDeleteId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setPageError('');
    setPageNotice('');
    setFormError('');
    setFormNotice('');
    try {
      const successNotice = editingId
        ? 'Section updated and ready to reorganize the storefront.'
        : 'Section created and ready for inventory.';

      if (editingId) {
        await api.put(`/admin/sections/${editingId}`, form);
      } else {
        await api.post('/admin/sections', form);
      }

      await loadSections();
      resetForm({ notice: successNotice });
    } catch (submitError) {
      setFormError(apiErrorMessage(submitError, 'Unable to save section.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sectionId) => {
    try {
      await api.delete(`/admin/sections/${sectionId}`);
      await loadSections();
      if (editingId === sectionId) {
        resetForm({ notice: 'Section removed from the catalog structure.' });
        return;
      }
      setConfirmDeleteId(null);
      setPageNotice('Section removed from the catalog structure.');
    } catch (deleteError) {
      setPageError(apiErrorMessage(deleteError, 'Unable to delete section.'));
    }
  };

  if (loading) {
    return <AdminPageLoader title="Loading sections" subtitle="Pulling the current catalog structure from the backend." />;
  }

  if (loadError) {
    return <AdminPageError title="Sections unavailable" message={loadError} />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog structure"
        title="Sections workspace"
        description="Use this page to keep storefront navigation clean. Each section should either hold live products or be intentionally empty for upcoming inventory."
        meta={[
          <AdminChip key="count" tone="neutral">Sections: {sections.length}</AdminChip>,
          <AdminChip key="coverage" tone="success">In use: {metrics.productCoverage}</AdminChip>,
          <AdminChip key="empty" tone={metrics.emptySections > 0 ? 'warning' : 'neutral'}>
            Empty sections: {metrics.emptySections}
          </AdminChip>,
        ]}
        actions={[
          <button key="create" type="button" onClick={() => resetForm()} className="admin-primary-button">
            <Plus className="h-4 w-4" />
            Create section
          </button>,
        ]}
      />

      {pageNotice ? <AdminNotice tone="success">{pageNotice}</AdminNotice> : null}
      {pageError ? <AdminNotice tone="danger">{pageError}</AdminNotice> : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
        <AdminPanel
          eyebrow="Section editor"
          title={editingId ? 'Edit section' : 'Create section'}
          description="Use short, high-confidence names that make sense in category navigation and filter menus."
          actions={editingId ? <AdminChip tone="info">Editing live section</AdminChip> : <AdminChip tone="neutral">Ready for new section</AdminChip>}
          className="xl:sticky xl:top-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-[var(--ink-soft)]">Section name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ name: event.target.value })}
                required
                placeholder="Mobile Phones"
                className="admin-dark-field"
              />
              <p className="mt-2 text-xs text-[var(--ink-muted)]">Keep labels shopper-friendly. This name appears directly in the storefront structure.</p>
            </label>

            {formNotice ? <AdminNotice tone="success">{formNotice}</AdminNotice> : null}
            {formError ? <AdminNotice tone="danger">{formError}</AdminNotice> : null}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="admin-primary-button">
                {saving ? 'Saving...' : editingId ? 'Publish section update' : 'Create section'}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="admin-ghost-button">
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </AdminPanel>

        <AdminPanel
          eyebrow="Live section list"
          title={formatCountLabel(sections.length, 'section')}
          description="Review usage before renaming or removing a section. Product counts are live so delete decisions stay safe."
          actions={<AdminChip tone="neutral">Product counts update from backend data</AdminChip>}
        >
          {sections.length === 0 ? (
            <AdminEmptyState title="No sections yet" message="Create the first section to start organizing products and storefront navigation." icon={Layers3} />
          ) : (
            <div className="space-y-3">
              {sections.map((section) => {
                const sectionProductCount = Number(section.productCount || 0);
                const isConfirmingDelete = confirmDeleteId === section.id;
                const deleteBlocked = sectionProductCount > 0;

                return (
                  <div key={section.id} className="admin-list-row">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--ink)]">{section.name}</p>
                          <AdminChip tone={sectionProductCount > 0 ? 'success' : 'warning'}>
                            {formatCountLabel(sectionProductCount, 'product')}
                          </AdminChip>
                          <AdminChip tone={sectionProductCount > 0 ? 'neutral' : 'warning'}>
                            {sectionProductCount > 0 ? 'In use' : 'Empty'}
                          </AdminChip>
                        </div>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">Section ID #{section.id}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(section.id);
                            setForm({ name: section.name });
                            setPageError('');
                            setPageNotice('');
                            setFormError('');
                            setFormNotice('Editing a live section. Save to update storefront grouping.');
                            setConfirmDeleteId(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="admin-ghost-button"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId((current) => (current === section.id ? null : section.id))}
                          className="admin-danger-button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {isConfirmingDelete ? (
                      <div className="mt-4">
                        <AdminNotice tone="danger" icon={AlertTriangle}>
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <span>
                              {deleteBlocked
                                ? `This section still contains ${formatCountLabel(sectionProductCount, 'product')}. Move those products before deleting the section.`
                                : 'Deleting this section removes it from storefront navigation immediately.'}
                            </span>
                            <span className="flex flex-wrap gap-2">
                              {deleteBlocked ? (
                                <Link to="/admin/products" className="admin-primary-button">
                                  Open products
                                </Link>
                              ) : (
                                <button type="button" onClick={() => handleDelete(section.id)} className="admin-danger-button">
                                  Confirm delete
                                </button>
                              )}
                              <button type="button" onClick={() => setConfirmDeleteId(null)} className="admin-ghost-button">
                                Keep section
                              </button>
                            </span>
                          </div>
                        </AdminNotice>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </AdminPanel>
      </div>
    </section>
  );
};

export default AdminSectionsPage;
