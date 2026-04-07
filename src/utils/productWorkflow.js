import {
  getMediaCounts,
  MEDIA_IMAGE,
  normalizeProductMediaList,
} from './productMedia';

export const PRODUCT_STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'media', label: 'Media Upload' },
  { id: 'description', label: 'Description' },
  { id: 'review', label: 'Review & Publish' },
];

export const PRODUCT_FILTERS = [
  { value: 'ALL', label: 'All Products' },
  { value: 'STOCK', label: 'Stock Issues' },
  { value: 'MEDIA', label: 'Missing Media' },
];

export const TOOLBAR_ACTIONS = [
  { label: 'Bold', command: 'bold' },
  { label: 'Italic', command: 'italic' },
  { label: 'List', command: 'insertUnorderedList' },
];

export const createEmptyProductForm = () => ({
  name: '',
  brand: 'Gadget69',
  description: '',
  fullDescription: '<p></p>',
  price: '',
  discountPercentage: '0',
  stockQuantity: '',
  sectionId: '',
  sku: '',
  lowStockAlertEnabled: true,
  mediaList: [],
});

export const createPreviewId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `preview-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const stripHtml = (value) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const createSkuCandidate = (name, brand) => {
  const compact = [brand, name]
    .filter(Boolean)
    .join('-')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toUpperCase()
    .slice(0, 14);

  const suffix = Date.now().toString().slice(-4);
  return compact ? `G69-${compact}-${suffix}` : `G69-ITEM-${suffix}`;
};

export const createMediaPreviewItems = (mediaList = []) => normalizeProductMediaList({ mediaList }).map((item, index) => ({
  id: item.id ?? createPreviewId(),
  url: item.url,
  type: item.type,
  previewUrl: item.url,
  progress: 100,
  status: 'done',
  name: item.type === MEDIA_IMAGE ? `Image ${index + 1}` : `Video ${index + 1}`,
  isObjectUrl: false,
  position: index,
}));

export const getStepIndexByFocus = (focus) => {
  if (focus === 'inventory' || focus === 'stock') return 1;
  if (focus === 'media') return 2;
  if (focus === 'description') return 3;
  if (focus === 'review') return 4;
  return 0;
};

export const getProductStatus = (product, { isLowStock, isOutOfStock }) => {
  const mediaCounts = getMediaCounts(normalizeProductMediaList(product));

  if (isOutOfStock(product.stockQuantity)) {
    return { label: 'Out of stock', tone: 'danger', focus: 'inventory' };
  }

  if (isLowStock(product.stockQuantity)) {
    return { label: 'Low stock', tone: 'warning', focus: 'inventory' };
  }

  if (mediaCounts.images === 0) {
    return { label: 'Missing media', tone: 'info', focus: 'media' };
  }

  return { label: 'Healthy', tone: 'success', focus: 'review' };
};

export const productToForm = (product) => ({
  name: product.name || '',
  brand: product.brand || 'Gadget69',
  description: product.description || '',
  fullDescription: product.fullDescription || product.description || '<p></p>',
  price: product.price != null ? String(product.price) : '',
  discountPercentage: String(product.discountPercentage ?? 0),
  stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : '',
  sectionId: product.sectionId != null ? String(product.sectionId) : '',
  sku: product.sku || createSkuCandidate(product.name, product.brand),
  lowStockAlertEnabled: product.lowStockAlertEnabled ?? true,
  mediaList: normalizeProductMediaList(product),
});

export const mergeDraftIntoForm = (baseForm, draft) => ({
  ...baseForm,
  ...draft,
  mediaList: normalizeProductMediaList(Array.isArray(draft?.mediaList)
    ? { mediaList: draft.mediaList }
    : {
      imageUrls: draft?.imageUrls ?? baseForm.imageUrls,
      imageUrl: draft?.imageUrl ?? baseForm.imageUrl,
      videoUrl: draft?.videoUrl ?? baseForm.videoUrl,
      mediaList: baseForm.mediaList,
    }),
  lowStockAlertEnabled: typeof draft?.lowStockAlertEnabled === 'boolean'
    ? draft.lowStockAlertEnabled
    : baseForm.lowStockAlertEnabled,
});

export const stepFieldMap = {
  basic: ['name', 'brand', 'sectionId', 'price', 'discountPercentage'],
  inventory: ['stockQuantity', 'sku'],
  media: ['mediaList'],
  description: ['description', 'fullDescription'],
  review: [],
};

export const getProductValidationErrors = (form) => {
  const errors = {};
  const mediaCounts = getMediaCounts(form.mediaList);

  if (!form.name.trim()) errors.name = 'Required';
  if (!form.brand.trim()) errors.brand = 'Required';
  if (!form.sectionId) errors.sectionId = 'Choose a category';
  if (!form.price || Number(form.price) <= 0) errors.price = 'Enter a valid price';
  if (form.discountPercentage === '' || Number(form.discountPercentage) < 0 || Number(form.discountPercentage) > 95) {
    errors.discountPercentage = 'Use 0 to 95';
  }
  if (form.stockQuantity === '' || Number(form.stockQuantity) < 0) errors.stockQuantity = 'Enter stock';
  if (!form.sku.trim()) errors.sku = 'SKU required';
  if (mediaCounts.images === 0) errors.mediaList = 'Add at least one image';
  if (!form.description.trim()) errors.description = 'Add a short description';
  if (!stripHtml(form.fullDescription || '')) errors.fullDescription = 'Add a full description';

  return errors;
};

export const filterErrorsForStep = (errors, stepId) => Object.fromEntries(
  Object.entries(errors).filter(([key]) => stepFieldMap[stepId].includes(key)),
);
