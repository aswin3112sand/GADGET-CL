import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertTriangle,
  ChevronsRight,
  Image as ImageIcon,
  PackagePlus,
} from 'lucide-react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../../lib/api';
import { invalidateCatalogCache } from '../../hooks/useCatalog';
import {
  AdminNotice,
  AdminPageError,
  AdminPageHeader,
  AdminPageLoader,
  AdminPanel,
} from '../../components/admin/AdminUI';
import ProductWorkflowWizard from '../../components/admin/ProductWorkflowWizard';
import ProductWorkflowQueue from '../../components/admin/ProductWorkflowQueue';
import { isLowStock, isOutOfStock } from '../../utils/inventory';
import {
  compressImageFile,
  MAX_MEDIA_FILE_SIZE_BYTES,
  MAX_MEDIA_FILE_SIZE_MB,
  uploadAdminMedia,
} from '../../utils/mediaUpload';
import {
  createEmptyProductForm,
  createMediaPreviewItems,
  createPreviewId,
  createSkuCandidate,
  filterErrorsForStep,
  getProductStatus,
  getStepIndexByFocus,
  mergeDraftIntoForm,
  productToForm,
  getProductValidationErrors,
} from '../../utils/productWorkflow';
import {
  createLegacyMediaPayload,
  getMediaCounts,
  getMediaTypeFromContentType,
  MEDIA_IMAGE,
} from '../../utils/productMedia';

const STEP_IDS = ['basic', 'inventory', 'media', 'description', 'review'];

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const editorRef = useRef(null);
  const wizardRef = useRef(null);
  const queueRef = useRef(null);
  const routeInitRef = useRef('');
  const mediaPreviewsRef = useRef([]);

  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [pageError, setPageError] = useState('');
  const [form, setForm] = useState(createEmptyProductForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState('');
  const [search, setSearch] = useState('');
  const [queueFilter, setQueueFilter] = useState('ALL');
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [activeMediaId, setActiveMediaId] = useState(null);
  const [editorVersion, setEditorVersion] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deferredSearch = useDeferredValue(search);
  const isCreateRoute = location.pathname.endsWith('/new');
  const requestedFocus = searchParams.get('focus');
  const draftKey = productId ? `g69-admin-product-draft-${productId}` : 'g69-admin-product-draft-new';

  const loadData = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const [productsResponse, sectionsResponse] = await Promise.all([
        api.get('/products'),
        api.get('/sections'),
      ]);
      setProducts(productsResponse.data);
      setSections(sectionsResponse.data);
    } catch (error) {
      setLoadError(apiErrorMessage(error, 'Unable to load product workflows.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, tone = 'success') => setToast({ id: Date.now(), message, tone });

  const activeProduct = useMemo(
    () => (productId ? products.find((product) => String(product.id) === String(productId)) || null : null),
    [productId, products],
  );

  const getStatus = (product) => getProductStatus(product, { isLowStock, isOutOfStock });

  const buildPersistedMediaList = (previews) => previews
    .filter((item) => item.status === 'done' && item.url)
    .map((item, index) => ({
      id: item.persistedId ?? item.id,
      url: item.url,
      type: item.type,
      position: index,
    }));

  const revokeObjectPreview = (preview) => {
    if (preview?.isObjectUrl && preview.previewUrl) {
      URL.revokeObjectURL(preview.previewUrl);
    }
  };

  const applyMediaPreviews = (nextPreviews, {
    syncForm = true,
    activeId,
  } = {}) => {
    const nextPreviewUrls = new Set(
      nextPreviews
        .filter((item) => item.isObjectUrl && item.previewUrl)
        .map((item) => item.previewUrl),
    );

    mediaPreviewsRef.current.forEach((item) => {
      if (item.isObjectUrl && item.previewUrl && !nextPreviewUrls.has(item.previewUrl)) {
        revokeObjectPreview(item);
      }
    });

    mediaPreviewsRef.current = nextPreviews;
    setMediaPreviews(nextPreviews);
    setActiveMediaId((current) => {
      if (activeId && nextPreviews.some((item) => item.id === activeId)) {
        return activeId;
      }
      if (current && nextPreviews.some((item) => item.id === current)) {
        return current;
      }
      return nextPreviews[0]?.id ?? null;
    });

    if (syncForm) {
      setForm((current) => ({
        ...current,
        mediaList: buildPersistedMediaList(nextPreviews),
      }));
    }
  };

  const syncEditorFromProduct = (product, {
    draftLabel = 'Editing live product',
    focus = requestedFocus,
  } = {}) => {
    const nextForm = productToForm(product);
    const nextPreviews = createMediaPreviewItems(nextForm.mediaList);

    setForm(nextForm);
    applyMediaPreviews(nextPreviews, {
      syncForm: false,
      activeId: nextPreviews[0]?.id ?? null,
    });
    setFieldErrors({});
    setPageError('');
    setCurrentStep(getStepIndexByFocus(focus));
    setDraftStatus(draftLabel);
    setEditorVersion((value) => value + 1);
    routeInitRef.current = `edit-${product.id}`;
  };

  useEffect(() => () => {
    mediaPreviewsRef.current.forEach(revokeObjectPreview);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const routeKey = productId ? `edit-${productId}` : isCreateRoute ? 'new' : 'products';
    if (routeInitRef.current === routeKey) {
      return;
    }

    if (productId && !activeProduct) {
      setPageError('This product could not be found in the current catalog.');
      return;
    }

    const baseForm = activeProduct
      ? productToForm(activeProduct)
      : {
        ...createEmptyProductForm(),
        sectionId: sections.length === 1 ? String(sections[0].id) : '',
      };

    let nextForm = baseForm;
    const savedDraft = window.localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        nextForm = mergeDraftIntoForm(baseForm, JSON.parse(savedDraft));
        setDraftStatus('Draft restored');
        showToast('Draft restored', 'info');
      } catch {
        window.localStorage.removeItem(draftKey);
      }
    } else {
      setDraftStatus(activeProduct ? 'Editing live product' : 'New product draft');
    }

    const nextPreviews = createMediaPreviewItems(nextForm.mediaList);
    applyMediaPreviews(nextPreviews, {
      syncForm: false,
      activeId: nextPreviews[0]?.id ?? null,
    });
    setForm(nextForm);
    setFieldErrors({});
    setPageError('');
    setCurrentStep(getStepIndexByFocus(requestedFocus));
    setEditorVersion((value) => value + 1);
    routeInitRef.current = routeKey;

    window.requestAnimationFrame(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [activeProduct, draftKey, isCreateRoute, loading, productId, requestedFocus, sections]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.innerHTML = form.fullDescription || '<p></p>';
  }, [editorVersion, form.fullDescription]);

  useEffect(() => {
    const workflow = searchParams.get('workflow');
    if (workflow === 'stock') setQueueFilter('STOCK');
    else if (workflow === 'media') setQueueFilter('MEDIA');
    else setQueueFilter('ALL');
  }, [searchParams]);

  useEffect(() => {
    if (loading || !routeInitRef.current) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify(form));
      setDraftStatus('Draft auto-saved');
    }, 700);

    return () => window.clearTimeout(timer);
  }, [draftKey, form, loading]);

  const sectionOptions = useMemo(
    () => sections.map((section) => ({ value: String(section.id), label: section.name })),
    [sections],
  );

  const validationErrors = useMemo(() => getProductValidationErrors(form), [form]);
  const canPublish = Object.keys(validationErrors).length === 0
    && !saving
    && !mediaPreviews.some((item) => item.status === 'uploading' || item.status === 'error');

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return products.filter((product) => {
      const status = getStatus(product);
      const matchesSearch = !query || [product.name, product.brand, product.sku, product.sectionName]
        .some((value) => value?.toLowerCase().includes(query));

      const matchesFilter = queueFilter === 'ALL'
        || (queueFilter === 'STOCK' && (status.label === 'Out of stock' || status.label === 'Low stock'))
        || (queueFilter === 'MEDIA' && status.label === 'Missing media');

      return matchesSearch && matchesFilter;
    });
  }, [deferredSearch, products, queueFilter]);

  const workflowTargets = useMemo(() => ({
    stock: products.find((product) => {
      const status = getStatus(product).label;
      return status === 'Out of stock' || status === 'Low stock';
    }) || null,
    media: products.find((product) => getStatus(product).label === 'Missing media') || null,
  }), [products]);

  const activeMediaPreview = useMemo(
    () => mediaPreviews.find((item) => item.id === activeMediaId) || mediaPreviews[0] || null,
    [activeMediaId, mediaPreviews],
  );

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleMediaUpload = async (files) => {
    for (const file of Array.from(files || [])) {
      const mediaType = getMediaTypeFromContentType(file.type);

      if (!mediaType) {
        setPageError('Only image and video uploads are supported.');
        continue;
      }

      if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
        setPageError(`Each media file must be ${MAX_MEDIA_FILE_SIZE_MB} MB or smaller.`);
        continue;
      }

      const previewId = createPreviewId();
      const previewUrl = URL.createObjectURL(file);
      const uploadPreview = {
        id: previewId,
        url: '',
        type: mediaType,
        previewUrl,
        progress: 0,
        status: 'uploading',
        name: file.name,
        isObjectUrl: true,
      };

      applyMediaPreviews([...mediaPreviewsRef.current, uploadPreview], { activeId: previewId });

      try {
        const preparedFile = mediaType === MEDIA_IMAGE ? await compressImageFile(file) : file;
        const data = await uploadAdminMedia({
          file: preparedFile,
          onProgress: (progress) => {
            applyMediaPreviews(
              mediaPreviewsRef.current.map((item) => (
                item.id === previewId ? { ...item, progress } : item
              )),
              { activeId: previewId },
            );
          },
        });

        const nextPreviews = mediaPreviewsRef.current.map((item) => (
          item.id === previewId
            ? {
              ...item,
              url: data.secureUrl || data.url,
              type: data.type || mediaType,
              previewUrl: data.secureUrl || data.url,
              progress: 100,
              status: 'done',
              isObjectUrl: false,
              persistedId: item.id,
            }
            : item
        ));

        applyMediaPreviews(nextPreviews, { activeId: previewId });
        showToast(data.note || `${mediaType === MEDIA_IMAGE ? 'Image' : 'Video'} uploaded successfully`);
      } catch (error) {
        applyMediaPreviews(
          mediaPreviewsRef.current.map((item) => (
            item.id === previewId ? { ...item, status: 'error', progress: 100 } : item
          )),
          { activeId: previewId },
        );
        setPageError(apiErrorMessage(error, 'Unable to upload media.'));
      }
    }
  };

  const handleReorderMedia = (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex
      || fromIndex < 0
      || toIndex < 0
      || fromIndex >= mediaPreviewsRef.current.length
      || toIndex >= mediaPreviewsRef.current.length
    ) {
      return;
    }

    const nextPreviews = [...mediaPreviewsRef.current];
    const [movedItem] = nextPreviews.splice(fromIndex, 1);
    nextPreviews.splice(toIndex, 0, movedItem);
    applyMediaPreviews(nextPreviews, { activeId: movedItem.id });
  };

  const handleStepNavigation = (direction) => {
    const currentStepId = STEP_IDS[currentStep];
    const stepErrors = filterErrorsForStep(validationErrors, currentStepId);

    if (direction === 'next' && Object.keys(stepErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...stepErrors }));
      showToast('Complete the required fields for this step.', 'danger');
      return;
    }

    setCurrentStep((value) => (direction === 'next' ? Math.min(value + 1, STEP_IDS.length - 1) : Math.max(value - 1, 0)));
  };

  const publishProduct = async () => {
    if (!canPublish) {
      setFieldErrors(validationErrors);
      showToast('Finish the required steps before publishing.', 'danger');
      return;
    }

    setSaving(true);

    try {
      const mediaPayload = createLegacyMediaPayload(form.mediaList);
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        description: form.description.trim(),
        fullDescription: form.fullDescription,
        price: Number(form.price),
        discountPercentage: Number(form.discountPercentage || 0),
        stockQuantity: Number(form.stockQuantity),
        sectionId: Number(form.sectionId),
        sku: form.sku.trim(),
        lowStockAlertEnabled: Boolean(form.lowStockAlertEnabled),
        ...mediaPayload,
      };

      const response = productId
        ? await api.put(`/admin/products/${productId}`, payload)
        : await api.post('/admin/products', payload);

      window.localStorage.removeItem(draftKey);
      invalidateCatalogCache();
      syncEditorFromProduct(response.data, {
        draftLabel: 'Saved and synced with live product',
        focus: 'review',
      });
      showToast('Product saved successfully');
      await loadData();
      navigate(`/admin/products/${response.data.id}/edit?focus=review`, { replace: true });
    } catch (error) {
      setPageError(apiErrorMessage(error, 'Unable to publish product.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminPageLoader title="Loading products" subtitle="Preparing product workflows and live inventory." />;
  }

  if (loadError) {
    return <AdminPageError title="Products unavailable" message={loadError} />;
  }

  const mediaCounts = getMediaCounts(form.mediaList);

  return (
    <section className="space-y-6">
      {toast ? (
        <div className="fixed right-4 top-24 z-40 rounded-[1rem] border border-[var(--admin-accent-tint-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--admin-accent-text)] shadow-[0_18px_34px_rgba(26,18,11,0.12)]">
          {toast.message}
        </div>
      ) : null}

      <AdminPageHeader
        eyebrow="Products"
        title="Guided product workflow"
        description="Build products step by step, upload Cloudinary media, and publish with fewer misses."
        actions={[
          <button key="new" type="button" onClick={() => { routeInitRef.current = ''; startTransition(() => navigate('/admin/products/new')); }} className="admin-primary-button">
            <PackagePlus className="h-4 w-4" />
            Add Product
          </button>,
          <Link key="orders" to="/admin/orders" className="admin-ghost-button">
            <ChevronsRight className="h-4 w-4" />
            Manage Orders
          </Link>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <button type="button" onClick={() => { routeInitRef.current = ''; navigate('/admin/products/new'); }} className="admin-list-row flex items-center justify-between gap-3 text-left">
          <span><span className="text-sm font-semibold text-[var(--ink)]">Add Product</span><span className="mt-1 block text-sm text-[var(--ink-soft)]">Start a fresh 5-step wizard</span></span>
          <PackagePlus className="h-5 w-5 text-[var(--admin-accent-text)]" />
        </button>
        <button type="button" onClick={() => {
          const target = workflowTargets.stock;
          if (target) navigate(`/admin/products/${target.id}/edit?focus=inventory&workflow=stock`);
          else {
            const next = new URLSearchParams(searchParams);
            next.set('workflow', 'stock');
            setSearchParams(next);
            queueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }} className="admin-list-row flex items-center justify-between gap-3 text-left">
          <span><span className="text-sm font-semibold text-[var(--ink)]">Fix Stock Issues</span><span className="mt-1 block text-sm text-[var(--ink-soft)]">Open inventory fixes fast</span></span>
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </button>
        <button type="button" onClick={() => {
          const target = workflowTargets.media;
          if (target) navigate(`/admin/products/${target.id}/edit?focus=media&workflow=media`);
          else {
            const next = new URLSearchParams(searchParams);
            next.set('workflow', 'media');
            setSearchParams(next);
            queueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }} className="admin-list-row flex items-center justify-between gap-3 text-left">
          <span><span className="text-sm font-semibold text-[var(--ink)]">Upload Missing Media</span><span className="mt-1 block text-sm text-[var(--ink-soft)]">Jump straight to gallery fixes</span></span>
          <ImageIcon className="h-5 w-5 text-[var(--admin-accent-text)]" />
        </button>
      </div>

      {pageError ? <AdminNotice tone="danger">{pageError}</AdminNotice> : null}

      <AdminPanel eyebrow={isCreateRoute || !productId ? 'New workflow' : 'Editing product'} title={isCreateRoute || !productId ? 'Add product' : `Edit ${activeProduct?.name || 'product'}`} description={draftStatus || 'Progress saves automatically while you work.'}>
        <ProductWorkflowWizard
          wizardRef={wizardRef}
          editorRef={editorRef}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          form={form}
          fieldErrors={fieldErrors}
          sectionOptions={sectionOptions}
          mediaPreviews={mediaPreviews}
          activeMediaPreview={activeMediaPreview}
          mediaCounts={mediaCounts}
          canPublish={canPublish}
          saving={saving}
          validationErrors={validationErrors}
          maxMediaSizeMb={MAX_MEDIA_FILE_SIZE_MB}
          onFieldChange={handleFieldChange}
          onStepNavigation={handleStepNavigation}
          onApplyEditorCommand={(command) => {
            if (typeof document.execCommand === 'function') {
              editorRef.current?.focus();
              document.execCommand(command, false);
              handleFieldChange('fullDescription', editorRef.current?.innerHTML || '<p></p>');
            }
          }}
          onEditorInput={() => handleFieldChange('fullDescription', editorRef.current?.innerHTML || '<p></p>')}
          onGenerateSku={() => handleFieldChange('sku', createSkuCandidate(form.name, form.brand))}
          onMediaUpload={handleMediaUpload}
          onSelectMedia={(previewId) => setActiveMediaId(previewId)}
          onRemoveMedia={(previewId) => {
            applyMediaPreviews(
              mediaPreviewsRef.current.filter((item) => item.id !== previewId),
            );
          }}
          onReorderMedia={handleReorderMedia}
          onPublish={publishProduct}
          isCreateMode={isCreateRoute || !productId}
        />
      </AdminPanel>

      <AdminPanel eyebrow="Workflow queue" title={queueFilter === 'ALL' ? 'All Products' : queueFilter === 'STOCK' ? 'Stock Issues' : 'Missing Media'} description="Open a product directly into the exact step that needs action.">
        <ProductWorkflowQueue
          queueRef={queueRef}
          search={search}
          setSearch={setSearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          queueFilter={queueFilter}
          setQueueFilter={setQueueFilter}
          filteredProducts={filteredProducts}
          getProductStatus={getStatus}
          onFixProduct={(product, focus) => navigate(`/admin/products/${product.id}/edit?focus=${focus}`)}
          confirmDeleteId={confirmDeleteId}
          setConfirmDeleteId={setConfirmDeleteId}
          onDeleteProduct={async (id) => {
            try {
              await api.delete(`/admin/products/${id}`);
              invalidateCatalogCache();
              await loadData();
              setConfirmDeleteId(null);
              showToast('Product removed successfully');
              if (String(productId) === String(id)) {
                routeInitRef.current = '';
                navigate('/admin/products');
              }
            } catch (error) {
              setPageError(apiErrorMessage(error, 'Unable to delete product.'));
            }
          }}
        />
      </AdminPanel>
    </section>
  );
};

export default AdminProductsPage;
