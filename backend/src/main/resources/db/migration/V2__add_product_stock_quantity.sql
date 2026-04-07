ALTER TABLE products
    ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 12 CHECK (stock_quantity >= 0);
