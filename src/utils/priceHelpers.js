export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const calcDiscount = (original, offer) =>
  Math.round(((original - offer) / original) * 100);

export const calcSavings = (original, offer) => original - offer;
