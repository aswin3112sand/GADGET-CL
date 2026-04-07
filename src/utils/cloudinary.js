const CLOUDINARY_HOST = 'res.cloudinary.com';

export const isCloudinaryUrl = (value) => {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    return new URL(value).hostname.includes(CLOUDINARY_HOST);
  } catch {
    return false;
  }
};

export const createCloudinaryTransformedUrl = (url, transformation) => {
  if (!isCloudinaryUrl(url) || !transformation) {
    return url;
  }

  return url.replace('/upload/', `/upload/${transformation}/`);
};
