export const getNumericStock = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.trunc(numeric));
};

export const isOutOfStock = (value) => getNumericStock(value) === 0;

export const isLowStock = (value) => {
  const stock = getNumericStock(value);
  return stock !== null && stock > 0 && stock <= 5;
};

export const getStockLabel = (value) => {
  const stock = getNumericStock(value);
  if (stock === null) {
    return 'Availability verified at checkout';
  }
  if (stock === 0) {
    return 'Out of stock';
  }
  if (stock <= 5) {
    return `Only ${stock} left`;
  }
  return `${stock} in stock`;
};

export const clampQuantityToStock = (quantity, stockValue) => {
  const stock = getNumericStock(stockValue);
  if (stock === null) {
    return Math.max(1, quantity);
  }
  if (stock === 0) {
    return 0;
  }
  return Math.max(1, Math.min(quantity, stock));
};
