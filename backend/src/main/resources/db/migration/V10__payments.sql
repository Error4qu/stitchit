-- Payment tracking for alteration orders
ALTER TABLE alteration_orders
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID';

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    alteration_order_id BIGINT NOT NULL REFERENCES alteration_orders(id),
    provider VARCHAR(20) NOT NULL,
    provider_order_id VARCHAR(100) NOT NULL,
    provider_payment_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(alteration_order_id);
CREATE UNIQUE INDEX idx_payments_provider_order ON payments(provider_order_id);
CREATE INDEX idx_alteration_orders_payment_status ON alteration_orders(payment_status);
