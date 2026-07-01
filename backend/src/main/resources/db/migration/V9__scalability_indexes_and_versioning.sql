-- Optimistic locking for concurrent status updates (tailor + admin editing same order)
ALTER TABLE alteration_orders ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- Indexes missing from V7 that back the hot query paths
CREATE INDEX IF NOT EXISTS idx_alteration_orders_created_at ON alteration_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alteration_orders_scheduled_date ON alteration_orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_alteration_order_items_order ON alteration_order_items(alteration_order_id);
CREATE INDEX IF NOT EXISTS idx_before_photos_order ON alteration_order_before_photos(order_id);
CREATE INDEX IF NOT EXISTS idx_after_photos_order ON alteration_order_after_photos(order_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
