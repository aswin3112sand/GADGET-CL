export const MEDIA_IMAGE = 'image';
export const MEDIA_VIDEO = 'video';

export const normalizeMediaType = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === MEDIA_IMAGE || normalized === MEDIA_VIDEO) {
    return normalized;
  }

  if (normalized === 'image_url') {
    return MEDIA_IMAGE;
  }

  return null;
};

export const normalizeProductMediaList = (source = {}) => {
  const hasMediaList = Array.isArray(source?.mediaList);
  const candidates = hasMediaList
    ? source.mediaList
    : [
      ...(Array.isArray(source?.imageUrls) ? source.imageUrls.map((url) => ({ url, type: MEDIA_IMAGE })) : []),
      ...(source?.imageUrl ? [{ url: source.imageUrl, type: MEDIA_IMAGE }] : []),
      ...(source?.videoUrl ? [{ url: source.videoUrl, type: MEDIA_VIDEO }] : []),
    ];

  const seen = new Set();

  return candidates
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `legacy-${index}`,
          url: item.trim(),
          type: MEDIA_IMAGE,
          position: index,
        };
      }

      const url = typeof item?.url === 'string' ? item.url.trim() : '';
      const type = normalizeMediaType(item?.type ?? item?.mediaType);

      return {
        id: item?.id ?? `media-${index}`,
        url,
        type,
        position: Number.isInteger(item?.position) ? item.position : index,
      };
    })
    .filter((item) => item.url && item.type)
    .filter((item) => {
      const key = `${item.type}:${item.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((item, index) => ({
      ...item,
      position: index,
    }));
};

export const getPrimaryImageUrl = (mediaList, fallback = '') => (
  normalizeProductMediaList({ mediaList }).find((item) => item.type === MEDIA_IMAGE)?.url || fallback
);

export const getFirstVideoUrl = (mediaList) => (
  normalizeProductMediaList({ mediaList }).find((item) => item.type === MEDIA_VIDEO)?.url || ''
);

export const getMediaCounts = (mediaList) => normalizeProductMediaList({ mediaList }).reduce((counts, item) => {
  if (item.type === MEDIA_IMAGE) counts.images += 1;
  if (item.type === MEDIA_VIDEO) counts.videos += 1;
  return counts;
}, { images: 0, videos: 0 });

export const getMediaTypeFromContentType = (contentType = '') => {
  if (contentType.startsWith('image/')) {
    return MEDIA_IMAGE;
  }
  if (contentType.startsWith('video/')) {
    return MEDIA_VIDEO;
  }
  return null;
};

export const createLegacyMediaPayload = (mediaList) => {
  const normalizedMediaList = normalizeProductMediaList({ mediaList });
  const imageUrls = normalizedMediaList
    .filter((item) => item.type === MEDIA_IMAGE)
    .map((item) => item.url);
  const videoUrl = normalizedMediaList.find((item) => item.type === MEDIA_VIDEO)?.url || '';

  return {
    mediaList: normalizedMediaList.map((item) => ({
      url: item.url,
      type: item.type,
    })),
    imageUrls,
    imageUrl: imageUrls[0] || '',
    videoUrl,
  };
};
