-- Seed alteration categories
INSERT INTO alteration_categories (type, display_name, icon, description, sort_order) VALUES
('PANT',        'Pants & Trousers',  '👖', 'Waist, length, thigh, and ankle alterations for all pant types', 1),
('SHIRT',       'Shirts & Tops',     '👔', 'Collar, sleeve, chest, and button repairs for shirts', 2),
('KURTA',       'Kurta & Salwar',    '🥻', 'Length, fitting, and embroidery repairs for ethnic wear', 3),
('JACKET',      'Jackets & Blazers', '🧥', 'Shoulder, sleeve, and lining alterations for formal outerwear', 4),
('SAREE_BLOUSE','Saree Blouse',      '👗', 'Back, sleeve, and neckline alterations for blouses', 5),
('SUIT',        'Suits',             '🤵', 'Complete suit alterations including jacket and trousers', 6),
('DRESS',       'Dresses & Frocks',  '👗', 'Hemline, waist, and strap adjustments for all dress types', 7),
('OTHER',       'Other Garments',    '🧵', 'Repairs and alterations for any other clothing item', 8);

-- PANT services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Waist In / Out', 'Tighten or loosen waistband by up to 2 inches', 199.00, 2,
       id, '📏' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Length Shortening', 'Shorten pant length and rehemm cleanly', 149.00, 1,
       id, '✂️' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Length Lengthening', 'Extend pant length using extra fabric from hem', 179.00, 2,
       id, '📐' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Thigh Fitting', 'Take in or let out thigh area for better fit', 249.00, 2,
       id, '🔧' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Ankle Tapering', 'Taper ankle opening to modern slim or regular fit', 199.00, 2,
       id, '👟' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Zipper Replacement', 'Replace broken or worn zipper with quality replacement', 299.00, 2,
       id, '🔗' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Pocket Repair', 'Repair torn pocket lining or pocket opening', 149.00, 1,
       id, '🛠️' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Crotch Repair', 'Reinforce or re-stitch crotch seam for durability', 349.00, 3,
       id, '🔨' FROM alteration_categories WHERE type = 'PANT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Belt Loop Repair', 'Reattach or replace missing belt loops', 99.00, 1,
       id, '🔩' FROM alteration_categories WHERE type = 'PANT';

-- SHIRT services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Collar Reshaping', 'Restructure collar for better shape and fit', 199.00, 2,
       id, '👔' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Sleeve Shortening', 'Shorten sleeves and reattach cuffs professionally', 199.00, 2,
       id, '✂️' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Sleeve Lengthening', 'Extend sleeves using extra fabric from cuffs', 249.00, 2,
       id, '📐' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Chest Fitting', 'Take in chest and side seams for slimmer fit', 299.00, 3,
       id, '📏' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Back Darting', 'Add darts to back for structured, tailored silhouette', 349.00, 3,
       id, '🧵' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Button Replacement', 'Replace all buttons with matching or upgraded set', 149.00, 1,
       id, '🔘' FROM alteration_categories WHERE type = 'SHIRT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Cuff Repair', 'Repair or replace worn shirt cuffs', 199.00, 2,
       id, '🛠️' FROM alteration_categories WHERE type = 'SHIRT';

-- KURTA services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Length Shortening', 'Shorten kurta length and finish hem neatly', 149.00, 1,
       id, '✂️' FROM alteration_categories WHERE type = 'KURTA';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Side Fitting', 'Take in sides for a more fitted silhouette', 249.00, 2,
       id, '📏' FROM alteration_categories WHERE type = 'KURTA';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Sleeve Adjustment', 'Shorten or lengthen kurta sleeves', 179.00, 2,
       id, '🧵' FROM alteration_categories WHERE type = 'KURTA';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Neckline Repair', 'Repair or reinforce neckline stitching', 149.00, 1,
       id, '🔧' FROM alteration_categories WHERE type = 'KURTA';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Placket Repair', 'Fix button placket or add hidden buttons', 199.00, 2,
       id, '🔩' FROM alteration_categories WHERE type = 'KURTA';

-- JACKET services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Shoulder Adjustment', 'Adjust shoulder width for proper fit', 499.00, 4,
       id, '🧥' FROM alteration_categories WHERE type = 'JACKET';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Sleeve Shortening', 'Shorten jacket sleeves while preserving button detail', 349.00, 3,
       id, '✂️' FROM alteration_categories WHERE type = 'JACKET';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Body Fitting', 'Take in jacket body for a slimmer, modern silhouette', 599.00, 4,
       id, '📏' FROM alteration_categories WHERE type = 'JACKET';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Lining Replacement', 'Replace torn or worn interior lining completely', 799.00, 5,
       id, '🛠️' FROM alteration_categories WHERE type = 'JACKET';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Zipper Replacement', 'Replace jacket zipper with heavy-duty quality zipper', 399.00, 3,
       id, '🔗' FROM alteration_categories WHERE type = 'JACKET';

-- SAREE_BLOUSE services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Back Deepening', 'Deepen back neckline for style preference', 249.00, 2,
       id, '✂️' FROM alteration_categories WHERE type = 'SAREE_BLOUSE';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Sleeve Shortening', 'Shorten blouse sleeves to preferred length', 149.00, 1,
       id, '📐' FROM alteration_categories WHERE type = 'SAREE_BLOUSE';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Side Fitting', 'Take in sides for snug, comfortable fit', 199.00, 2,
       id, '📏' FROM alteration_categories WHERE type = 'SAREE_BLOUSE';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Hook & Eye Repair', 'Replace or add hooks and eyes on blouse closure', 99.00, 1,
       id, '🔩' FROM alteration_categories WHERE type = 'SAREE_BLOUSE';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Neckline Reshaping', 'Alter neckline shape (round to V-neck or square)', 299.00, 3,
       id, '🧵' FROM alteration_categories WHERE type = 'SAREE_BLOUSE';

-- SUIT services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Jacket + Trouser Bundle', 'Full suit alteration: jacket body, sleeves, and trouser waist', 1299.00, 7,
       id, '🤵' FROM alteration_categories WHERE type = 'SUIT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Jacket Only', 'Jacket body fitting and sleeve shortening', 799.00, 5,
       id, '🧥' FROM alteration_categories WHERE type = 'SUIT';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Trouser Waist + Length', 'Trouser waist adjustment and length shortening', 349.00, 3,
       id, '👖' FROM alteration_categories WHERE type = 'SUIT';

-- DRESS services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Hemline Shortening', 'Shorten dress length and finish hem cleanly', 199.00, 2,
       id, '✂️' FROM alteration_categories WHERE type = 'DRESS';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Waist Taking In', 'Take in waist for a more fitted look', 299.00, 3,
       id, '📏' FROM alteration_categories WHERE type = 'DRESS';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Strap Repair / Replacement', 'Fix or replace broken dress straps', 149.00, 1,
       id, '🔧' FROM alteration_categories WHERE type = 'DRESS';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Zipper Replacement', 'Replace dress zipper with invisible or regular zip', 299.00, 2,
       id, '🔗' FROM alteration_categories WHERE type = 'DRESS';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Lining Addition', 'Add lining to unlined or sheer dress fabric', 499.00, 4,
       id, '🧵' FROM alteration_categories WHERE type = 'DRESS';

-- OTHER services
INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'General Seam Repair', 'Re-stitch any split or frayed seam', 149.00, 1,
       id, '🛠️' FROM alteration_categories WHERE type = 'OTHER';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'General Length Alteration', 'Shorten or lengthen any garment type', 199.00, 2,
       id, '✂️' FROM alteration_categories WHERE type = 'OTHER';

INSERT INTO alteration_services (name, description, base_price, estimated_days, category_id, icon)
SELECT 'Custom Alteration', 'Describe your specific alteration need — we will assess on visit', 299.00, 3,
       id, '🎯' FROM alteration_categories WHERE type = 'OTHER';
