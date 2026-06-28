CREATE TABLE tailor_visits (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    tailor_id BIGINT NOT NULL REFERENCES users(id),
    scheduled_date TIMESTAMP NOT NULL,
    actual_visit_date TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    notes TEXT
);

CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    submitted_by BIGINT NOT NULL REFERENCES users(id),
    garment_type VARCHAR(100) NOT NULL,
    measurements TEXT NOT NULL,
    photos TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
