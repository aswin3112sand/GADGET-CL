CREATE TABLE product_media (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    url VARCHAR(1024) NOT NULL,
    type VARCHAR(10) NOT NULL,
    position INTEGER NOT NULL
);

CREATE INDEX idx_product_media_product_id ON product_media (product_id);
CREATE UNIQUE INDEX uq_product_media_product_position ON product_media (product_id, position);
