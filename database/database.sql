-- Create Users table if not exists with unique username constraint
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    session_cookie_id TEXT UNIQUE,
    auth_cookie_id TEXT UNIQUE,
    auth_cookie_created_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Cart table if not exists
CREATE TABLE IF NOT EXISTS Cart (
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_user_id INTEGER,
    product_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_user_id) REFERENCES Users(user_id)
);

-- Create Produtcs table if not exists with unique Product constraint
CREATE TABLE IF NOT EXISTS Products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priceInPennies INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  sold INTEGER,
  gender TEXT NOT NULL,
  isAvailable TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Product size table to store product size associated with Product sizes
CREATE TABLE IF NOT EXISTS ProductSize (
  productSize_id INTEGER PRIMARY KEY AUTOINCREMENT,
  size TEXT NOT NULL
);

-- Create Product sizes table to store product size associated with products
CREATE TABLE IF NOT EXISTS ProductSizes (
  product_id INTEGER,
  size_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES Products (product_id),
  FOREIGN KEY (size_id) REFERENCES ProductSize (productSize_id),
  PRIMARY KEY (product_id, size_id)
);

-- Create Product color table to store product color associated with Product colors
CREATE TABLE IF NOT EXISTS ProductColor (
  productColor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  color TEXT NOT NULL
);

-- Create Product colors table to store product color associated with products
CREATE TABLE IF NOT EXISTS ProductColors (
  product_id INTEGER,
  color_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES Products (product_id),
  FOREIGN KEY (color_id) REFERENCES ProductColor (productColor_id),
  PRIMARY KEY (product_id, color_id)
);

-- Create Images table to store image paths associated with products
CREATE TABLE IF NOT EXISTS ProductImages (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  path TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create Slideshow Images table to store image paths
CREATE TABLE IF NOT EXISTS SlideshowImages (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_spot INTEGER,
  path TEXT NOT NULL
);

-- Create Contact us table to store contact us messages
CREATE TABLE IF NOT EXISTS ContactUsSubmissions (
  contact_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  replied TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);