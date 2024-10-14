-- Users table
CREATE TABLE IF NOT EXISTS Users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  session_cookie_id TEXT UNIQUE,
  auth_cookie_id TEXT UNIQUE,
  auth_cookie_created_at TEXT,
  resetPasswordToken TEXT,
  resetPasswordExpires TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS Cart (
  cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_user_id INTEGER,
  product_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_user_id) REFERENCES Users(user_id)
);

-- Product table
CREATE TABLE IF NOT EXISTS Product (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price_in_pennies INTEGER NOT NULL,
  gender TEXT NOT NULL,
  is_available TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product variation
CREATE TABLE IF NOT EXISTS ProductVariation (
  product_variation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  color_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES Product (product_id) ON DELETE CASCADE,
  FOREIGN KEY (color_id) REFERENCES ProductColor (product_color_id)
);

-- Product size and stock
CREATE TABLE IF NOT EXISTS ProductVariationSizeInventory (
  product_variation_id INTEGER,
  size_id INTEGER,
  stock INTEGER,
  sold INTEGER,
  discount INTEGER,
  FOREIGN KEY (product_variation_id) REFERENCES ProductVariation (product_variation_id) ON DELETE CASCADE,
  FOREIGN KEY (size_id) REFERENCES ProductSize (product_size_id),
  UNIQUE (product_variation_id, size_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_variation_size
ON ProductVariationSizeInventory (product_variation_id, size_id);

-- Product images
CREATE TABLE IF NOT EXISTS ProductImages (
  product_variation_id INTEGER,
  path TEXT,
  FOREIGN KEY (product_variation_id) REFERENCES ProductVariation (product_variation_id) ON DELETE CASCADE
);

-- Product category
CREATE TABLE IF NOT EXISTS ProductCategory (
  product_category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL UNIQUE
);

-- Product category
CREATE TABLE IF NOT EXISTS ProductCategorySize (
  category_id INTEGER,
  size_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES ProductCategory (product_category_id) ON DELETE CASCADE
);

-- Product size
CREATE TABLE IF NOT EXISTS ProductSize (
  product_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
  size TEXT NOT NULL UNIQUE
);

-- Product color
CREATE TABLE IF NOT EXISTS ProductColor (
  product_color_id INTEGER PRIMARY KEY AUTOINCREMENT,
  color TEXT NOT NULL UNIQUE
);

-- Slideshow Images table
CREATE TABLE IF NOT EXISTS SlideshowImages (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_spot INTEGER,
  path TEXT NOT NULL
);

-- Contact us table
CREATE TABLE IF NOT EXISTS ContactUsSubmissions (
  contact_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  replied TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subscription emails table
CREATE TABLE IF NOT EXISTS NewsLetterSubscriptionEmails (
  news_letter_subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_letter_subscription_email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NewsLetters table
CREATE TABLE IF NOT EXISTS NewsLetters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NewsLetterSections table
CREATE TABLE IF NOT EXISTS NewsLetterSections (
  news_letter_id INTEGER,
  image_url TEXT,
  title TEXT,
  message TEXT,
  button_link TEXT,
  button_name TEXT
);