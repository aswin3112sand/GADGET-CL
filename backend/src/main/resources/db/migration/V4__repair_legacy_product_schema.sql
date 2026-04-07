ALTER TABLE products
    ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 12;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS sku VARCHAR(120);

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS brand VARCHAR(160) NOT NULL DEFAULT 'Gadget69';

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS discount_percentage INTEGER NOT NULL DEFAULT 0;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS low_stock_alert_enabled BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS full_description TEXT NOT NULL DEFAULT '';

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS image_urls TEXT NOT NULL DEFAULT '[]';

ALTER TABLE products
    ALTER COLUMN stock_quantity SET DEFAULT 12;

ALTER TABLE products
    ALTER COLUMN brand SET DEFAULT 'Gadget69';

ALTER TABLE products
    ALTER COLUMN discount_percentage SET DEFAULT 0;

ALTER TABLE products
    ALTER COLUMN low_stock_alert_enabled SET DEFAULT TRUE;

ALTER TABLE products
    ALTER COLUMN full_description SET DEFAULT '';

ALTER TABLE products
    ALTER COLUMN image_urls SET DEFAULT '[]';

UPDATE products
SET stock_quantity = 12
WHERE stock_quantity IS NULL;

UPDATE products
SET brand = 'Gadget69'
WHERE brand IS NULL OR TRIM(brand) = '';

UPDATE products
SET discount_percentage = 0
WHERE discount_percentage IS NULL;

UPDATE products
SET low_stock_alert_enabled = TRUE
WHERE low_stock_alert_enabled IS NULL;

UPDATE products
SET full_description = description
WHERE full_description IS NULL OR TRIM(full_description) = '';

UPDATE products
SET image_urls = CASE
    WHEN image_url IS NOT NULL AND TRIM(image_url) <> '' THEN '["' || image_url || '"]'
    ELSE '[]'
END
WHERE image_urls IS NULL OR TRIM(image_urls) = '' OR image_urls = '[]';

UPDATE products
SET sku = 'G69-' || id
WHERE sku IS NULL OR TRIM(sku) = '';

ALTER TABLE products
    ALTER COLUMN stock_quantity SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN brand SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN discount_percentage SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN low_stock_alert_enabled SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN full_description SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN image_urls SET NOT NULL;
