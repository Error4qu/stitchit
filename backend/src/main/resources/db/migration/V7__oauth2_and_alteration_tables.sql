-- Add OAuth2 fields to users table
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_account_id VARCHAR(255);

-- Alteration categories
CREATE TABLE alteration_categories (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    sort_order INTEGER
);

-- Alteration services (individual service offerings per category)
CREATE TABLE alteration_services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    base_price NUMERIC(10, 2) NOT NULL,
    estimated_days INTEGER,
    category_id BIGINT NOT NULL REFERENCES alteration_categories(id),
    icon VARCHAR(50)
);

-- Alteration orders
CREATE TABLE alteration_orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    tailor_id BIGINT REFERENCES users(id),
    address_id BIGINT NOT NULL REFERENCES addresses(id),
    scheduled_date DATE NOT NULL,
    scheduled_slot VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'BOOKED',
    tailor_notes TEXT,
    special_instructions TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alteration order items
CREATE TABLE alteration_order_items (
    id BIGSERIAL PRIMARY KEY,
    alteration_order_id BIGINT NOT NULL REFERENCES alteration_orders(id) ON DELETE CASCADE,
    alteration_service_id BIGINT NOT NULL REFERENCES alteration_services(id),
    garment_description VARCHAR(500),
    customer_notes VARCHAR(500),
    price NUMERIC(10, 2) NOT NULL
);

-- Before/after photo collections
CREATE TABLE alteration_order_before_photos (
    order_id BIGINT NOT NULL REFERENCES alteration_orders(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL
);

CREATE TABLE alteration_order_after_photos (
    order_id BIGINT NOT NULL REFERENCES alteration_orders(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL
);

CREATE INDEX idx_alteration_orders_customer ON alteration_orders(customer_id);
CREATE INDEX idx_alteration_orders_tailor ON alteration_orders(tailor_id);
CREATE INDEX idx_alteration_orders_status ON alteration_orders(status);
CREATE INDEX idx_alteration_services_category ON alteration_services(category_id);
