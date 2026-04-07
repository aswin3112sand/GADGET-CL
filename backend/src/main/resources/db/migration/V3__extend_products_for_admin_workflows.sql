ALTER TABLE products
    ADD COLUMN brand VARCHAR(160) NOT NULL DEFAULT 'Gadget69';

ALTER TABLE products
    ADD COLUMN discount_percentage INTEGER NOT NULL DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 95);

ALTER TABLE products
    ADD COLUMN sku VARCHAR(120);

ALTER TABLE products
    ADD COLUMN low_stock_alert_enabled BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE products
    ADD COLUMN full_description TEXT NOT NULL DEFAULT '';

ALTER TABLE products
    ADD COLUMN image_urls TEXT NOT NULL DEFAULT '[]';

UPDATE products
SET full_description = description
WHERE full_description = '';

UPDATE products
SET image_urls = CASE
    WHEN image_url IS NOT NULL AND TRIM(image_url) <> '' THEN '["' || image_url || '"]'
    ELSE '[]'
END;

UPDATE products
SET sku = 'G69-' || id
WHERE sku IS NULL OR TRIM(sku) = '';
