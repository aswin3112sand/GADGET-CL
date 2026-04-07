import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  Film,
  GripVertical,
  Image as ImageIcon,
  Italic,
  List,
  LoaderCircle,
  Pencil,
  PlayCircle,
  Trash2,
  Upload,
  WandSparkles,
} from 'lucide-react';
import {
  PRODUCT_STEPS,
  TOOLBAR_ACTIONS,
  filterErrorsForStep,
} from '../../utils/productWorkflow';
import { formatPrice } from '../../utils/priceHelpers';
import { MEDIA_IMAGE } from '../../utils/productMedia';

const TOOLBAR_ICONS = {
  bold: Bold,
  italic: Italic,
  insertUnorderedList: List,
};

const ProductWorkflowWizard = ({
  wizardRef,
  editorRef,
  currentStep,
  setCurrentStep,
  form,
  fieldErrors,
  sectionOptions,
  mediaPreviews,
  activeMediaPreview,
  mediaCounts,
  canPublish,
  saving,
  validationErrors,
  maxMediaSizeMb,
  onFieldChange,
  onStepNavigation,
  onApplyEditorCommand,
  onEditorInput,
  onGenerateSku,
  onMediaUpload,
  onSelectMedia,
  onRemoveMedia,
  onReorderMedia,
  onPublish,
  isCreateMode,
}) => {
  const currentStepId = PRODUCT_STEPS[currentStep].id;
  const fieldClassName = (field) => `admin-dark-field ${fieldErrors[field] ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`;

  return (
    <div ref={wizardRef} className="space-y-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {PRODUCT_STEPS.map((step, index) => {
            const stepErrors = filterErrorsForStep(validationErrors, step.id);
            const isComplete = index !== currentStep && Object.keys(stepErrors).length === 0;
            const isActive = index === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]'
                    : isComplete
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[rgba(26,18,11,0.05)] text-[var(--ink-muted)]'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isComplete ? 'bg-emerald-600 text-white' : 'bg-white/80'
                  }`}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                {step.label}
              </button>
            );
          })}
        </div>

        <div className="h-2 rounded-full bg-[rgba(26,18,11,0.06)]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--admin-accent) 0%, var(--admin-accent-strong) 100%)' }}
            animate={{ width: `${((currentStep + 1) / PRODUCT_STEPS.length) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {currentStepId === 'basic' ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Product Name</span>
                <input value={form.name} onChange={(event) => onFieldChange('name', event.target.value)} className={fieldClassName('name')} placeholder="Nova Studio Pro" />
                {fieldErrors.name ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.name}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Category</span>
                <select value={form.sectionId} onChange={(event) => onFieldChange('sectionId', event.target.value)} className={fieldClassName('sectionId')}>
                  <option value="">Choose category</option>
                  {sectionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                {fieldErrors.sectionId ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.sectionId}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Brand</span>
                <input value={form.brand} onChange={(event) => onFieldChange('brand', event.target.value)} className={fieldClassName('brand')} placeholder="Gadget69" />
                {fieldErrors.brand ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.brand}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Price</span>
                <input type="number" min="1" step="0.01" value={form.price} onChange={(event) => onFieldChange('price', event.target.value)} className={fieldClassName('price')} placeholder="49999" />
                {fieldErrors.price ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.price}</p> : null}
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Discount</span>
                <input type="number" min="0" max="95" step="1" value={form.discountPercentage} onChange={(event) => onFieldChange('discountPercentage', event.target.value)} className={fieldClassName('discountPercentage')} placeholder="10" />
                {fieldErrors.discountPercentage ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.discountPercentage}</p> : null}
              </label>
            </div>
          ) : null}

          {currentStepId === 'inventory' ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Stock Count</span>
                <input type="number" min="0" step="1" value={form.stockQuantity} onChange={(event) => onFieldChange('stockQuantity', event.target.value)} className={fieldClassName('stockQuantity')} placeholder="12" />
                {fieldErrors.stockQuantity ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.stockQuantity}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">SKU</span>
                <div className="flex gap-2">
                  <input value={form.sku} onChange={(event) => onFieldChange('sku', event.target.value.toUpperCase())} className={fieldClassName('sku')} placeholder="G69-NOVA-1042" />
                  <button type="button" onClick={onGenerateSku} className="admin-ghost-button">Auto</button>
                </div>
                {fieldErrors.sku ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.sku}</p> : null}
              </label>

              <label className="admin-list-row md:col-span-2">
                <span className="flex items-center justify-between gap-4">
                  <span>
                    <span className="text-sm font-semibold text-[var(--ink)]">Low Stock Alert</span>
                    <span className="mt-1 block text-sm text-[var(--ink-soft)]">Flag this product when inventory reaches 5 units or fewer.</span>
                  </span>
                  <span className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.lowStockAlertEnabled ? 'bg-[var(--admin-accent)]' : 'bg-[rgba(26,18,11,0.16)]'}`}>
                    <input type="checkbox" checked={form.lowStockAlertEnabled} onChange={(event) => onFieldChange('lowStockAlertEnabled', event.target.checked)} className="sr-only" />
                    <span className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.lowStockAlertEnabled ? 'translate-x-5' : ''}`} />
                  </span>
                </span>
              </label>
            </div>
          ) : null}

          {currentStepId === 'media' ? (
            <div className="space-y-5">
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  onMediaUpload(event.dataTransfer.files);
                }}
                className={`rounded-[1.25rem] border border-dashed px-5 py-6 text-center ${fieldErrors.mediaList ? 'border-rose-300 bg-rose-50/70' : 'border-[var(--admin-accent-tint-strong)] bg-[var(--admin-accent-tint)]/40'}`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--admin-accent-text)] shadow-[0_10px_24px_rgba(26,18,11,0.05)]">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[var(--ink)]">Upload Gallery Media</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">Drop multiple images or videos, then drag to reorder the final gallery.</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Up to {maxMediaSizeMb} MB per file</p>
                <label className="admin-primary-button mt-4 inline-flex cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Choose Media
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      onMediaUpload(event.target.files);
                      event.target.value = '';
                    }}
                  />
                </label>
                {fieldErrors.mediaList ? <p className="mt-3 text-xs text-rose-600">{fieldErrors.mediaList}</p> : null}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(26,18,11,0.08)] bg-[#0e0d0c] text-white shadow-[0_20px_44px_rgba(12,10,9,0.3)]">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[#8ef0be]">Gallery focus</p>
                      <p className="mt-1 text-sm text-white/70">Preview the selected media item before publishing.</p>
                    </div>
                    <div className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                      {mediaCounts.images} images • {mediaCounts.videos} videos
                    </div>
                  </div>

                  {activeMediaPreview ? (
                    <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_top,rgba(142,240,190,0.16),transparent_28%),linear-gradient(180deg,#121111_0%,#090909_100%)]">
                      {activeMediaPreview.type === MEDIA_IMAGE ? (
                        <img
                          src={activeMediaPreview.previewUrl}
                          alt={activeMediaPreview.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={activeMediaPreview.previewUrl}
                          controls
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                        {activeMediaPreview.type}
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center px-8 text-center text-sm text-white/60">
                      Upload media to build the premium mixed gallery.
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {mediaPreviews.length > 0 ? mediaPreviews.map((item, index) => (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', String(index));
                        event.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const fromIndex = Number(event.dataTransfer.getData('text/plain'));
                        onReorderMedia(fromIndex, index);
                      }}
                      onClick={() => onSelectMedia(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelectMedia(item.id);
                        }
                      }}
                      className={`w-full overflow-hidden rounded-[1.15rem] border text-left transition-all duration-300 ${
                        activeMediaPreview?.id === item.id
                          ? 'border-[#8ef0be]/60 bg-[#0c1310] shadow-[0_16px_34px_rgba(31,191,129,0.12)]'
                          : 'border-[rgba(26,18,11,0.07)] bg-white/88 shadow-[0_12px_26px_rgba(26,18,11,0.04)]'
                      }`}
                    >
                      <div className="flex gap-4 p-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-[rgba(26,18,11,0.08)]">
                          {item.type === MEDIA_IMAGE ? (
                            <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <>
                              <video src={item.previewUrl} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/28">
                                <PlayCircle className="h-7 w-7 text-white" />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[var(--ink)]">{item.name}</p>
                              <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                                {item.type === MEDIA_IMAGE ? <ImageIcon className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
                                {item.type}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="rounded-full border border-[rgba(26,18,11,0.08)] bg-white/80 p-1.5 text-[var(--ink-muted)]">
                                <GripVertical className="h-4 w-4" />
                              </span>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onRemoveMedia(item.id);
                                }}
                                className="rounded-full border border-[rgba(26,18,11,0.08)] bg-white/80 p-1.5 text-[var(--ink-muted)] transition-colors hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-[rgba(26,18,11,0.06)]">
                            <div className={`h-full rounded-full ${item.status === 'error' ? 'bg-rose-500' : 'bg-[var(--admin-accent)]'}`} style={{ width: `${item.progress}%` }} />
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-[var(--ink-soft)]">
                            {item.status === 'uploading' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
                            {item.status === 'done' ? 'Ready' : item.status === 'error' ? 'Upload failed - remove or retry.' : 'Uploading...'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[1.15rem] border border-dashed border-[rgba(26,18,11,0.08)] bg-white/76 px-5 py-8 text-center text-sm text-[var(--ink-soft)]">
                      Your mixed gallery order appears here after upload.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {currentStepId === 'description' ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--ink-soft)]">Short Description</span>
                <textarea value={form.description} onChange={(event) => onFieldChange('description', event.target.value)} rows={3} className={fieldClassName('description')} placeholder="A concise summary for product cards and admin views." />
                {fieldErrors.description ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.description}</p> : null}
              </label>

              <div className="rounded-[1.25rem] border border-[rgba(26,18,11,0.07)] bg-white/86 p-4 shadow-[0_12px_26px_rgba(26,18,11,0.04)]">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {TOOLBAR_ACTIONS.map(({ label, command }) => {
                    const Icon = TOOLBAR_ICONS[command];
                    return (
                      <button key={label} type="button" title={label} onClick={() => onApplyEditorCommand(command)} className="admin-ghost-button">
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={onEditorInput} className={`min-h-[14rem] rounded-[1rem] border bg-white px-4 py-4 outline-none ${fieldErrors.fullDescription ? 'border-rose-300' : 'border-[rgba(26,18,11,0.08)]'}`} />
                {fieldErrors.fullDescription ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.fullDescription}</p> : null}
              </div>
            </div>
          ) : null}

          {currentStepId === 'review' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                {
                  title: 'Basic Info',
                  step: 0,
                  lines: [
                    form.name || 'Untitled product',
                    `${form.brand || 'Brand'} | ${sectionOptions.find((option) => option.value === form.sectionId)?.label || 'No category'}`,
                    `${formatPrice(Number(form.price || 0))} | ${Number(form.discountPercentage || 0)}% discount`,
                  ],
                },
                { title: 'Inventory', step: 1, lines: [`${form.stockQuantity || 0} units`, `SKU: ${form.sku || 'Pending'}`, form.lowStockAlertEnabled ? 'Low stock alerts enabled' : 'Low stock alerts disabled'] },
                { title: 'Media', step: 2, lines: [`${mediaCounts.images} images uploaded`, `${mediaCounts.videos} videos attached`, `${mediaPreviews.length} total gallery items` ] },
                { title: 'Description', step: 3, lines: [form.description || 'No short description yet'] },
              ].map((section) => (
                <div key={section.title} className="admin-list-row">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{section.title}</p>
                      <div className="mt-2 space-y-1 text-sm text-[var(--ink-soft)]">
                        {section.lines.map((line) => <p key={line} className="line-clamp-2">{line}</p>)}
                      </div>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(section.step)} className="admin-ghost-button">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
              {activeMediaPreview ? (
                <div className="overflow-hidden rounded-[1.15rem] border border-[rgba(26,18,11,0.07)] bg-white/88 shadow-[0_12px_26px_rgba(26,18,11,0.04)] lg:col-span-2">
                  {activeMediaPreview.type === MEDIA_IMAGE ? (
                    <img src={activeMediaPreview.previewUrl} alt={form.name || 'Product preview'} className="h-72 w-full object-cover" />
                  ) : (
                    <video src={activeMediaPreview.previewUrl} controls className="h-72 w-full object-cover" />
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-3 border-t border-[rgba(26,18,11,0.06)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {isCreateMode ? 'New product flow' : 'Edit workflow'} | Step {currentStep + 1} of {PRODUCT_STEPS.length}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => onStepNavigation('back')} disabled={currentStep === 0} className="admin-ghost-button">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {currentStep < PRODUCT_STEPS.length - 1 ? (
            <button type="button" onClick={() => onStepNavigation('next')} className="admin-primary-button">
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" disabled={!canPublish} onClick={onPublish} className="admin-primary-button">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductWorkflowWizard;
