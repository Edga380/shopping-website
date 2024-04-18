-- Create Produtcs table if not exists with unique Product constraint
CREATE TABLE IF NOT EXISTS Products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priceInPennies INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  isAvailable TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Images table to store image paths associated with products
CREATE TABLE IF NOT EXISTS ProductImages (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  path TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);