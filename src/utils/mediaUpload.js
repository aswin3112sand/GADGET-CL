import api from '../lib/api';

export const MAX_MEDIA_FILE_SIZE_MB = 200;
export const MAX_MEDIA_FILE_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_SIZE_MB = MAX_MEDIA_FILE_SIZE_MB;
export const MAX_VIDEO_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_BYTES;

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

export const compressImageFile = async (file, {
  maxDimension = 1800,
  quality = 0.82,
} = {}) => {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const nextName = file.name.replace(/\.[^.]+$/, '') || 'gadget69-image';
    return new File([blob], `${nextName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const uploadAdminMedia = async ({ file, onProgress }) => {
  const payload = new FormData();
  payload.append('file', file);

  const { data } = await api.post('/admin/upload', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });

  const secureUrl = data?.secureUrl || data?.url || '';
  const type = data?.type || (typeof data?.mediaType === 'string' ? data.mediaType.toLowerCase() : '');

  return {
    ...data,
    secureUrl,
    url: secureUrl,
    type,
  };
};
