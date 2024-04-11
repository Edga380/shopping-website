-- Create Users table if not exists with unique username constraint
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
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
