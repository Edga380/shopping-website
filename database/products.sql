-- Create Produtcs table if not exists with unique Product constraint
CREATE TABLE IF NOT EXISTS Products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  priceInCents TEXT UNIQUE NOT NULL,
  stock INTEGER NOT NULL,
  isAvailable INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);