CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    tailor_id BIGINT REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address_id BIGINT NOT NULL REFERENCES addresses(id),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    style_id BIGINT NOT NULL REFERENCES styles(id),
    fabric_id BIGINT NOT NULL REFERENCES fabrics(id),
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    customizations TEXT
);
