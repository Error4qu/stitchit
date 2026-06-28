CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fabric_id BIGINT NOT NULL REFERENCES fabrics(id),
    style_id BIGINT NOT NULL REFERENCES styles(id),
    quantity INT NOT NULL,
    customizations TEXT
);
