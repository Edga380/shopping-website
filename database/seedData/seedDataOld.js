const Database = require("better-sqlite3");
const { join } = require("path");
const fs = require("fs");
require("dotenv").config();

function initializeDatabase(databaseName, dbSchema) {
  const dbName = databaseName;
  if (!dbName) {
    throw new Error("dbName if not defined.");
  }

  const dbFilePath = join(process.cwd(), "database", dbName);
  const schemaPath = join(process.cwd(), "database", dbSchema);

  const db = new Database(dbFilePath);

  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);

  console.log("Seed database initialized.");
  return db;
}

const mainDatabase = initializeDatabase(
  process.env.MAIN_DATABASE,
  "database.sql"
);

const products = [
  {
    name: "Product 1",
    description: "Description for Product 1",
    category: "jumper",
    priceInPennies: 9999,
    stock: 10,
    sold: 2,
    gender: "unisex",
    colors: ["Red"],
    sizes: ["S", "M", "L", "XL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 2",
    description: "Description for Product 2",
    category: "tshirt",
    priceInPennies: 19999,
    stock: 20,
    sold: 4,
    gender: "male",
    colors: ["Blue"],
    sizes: ["M", "L", "XL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 3",
    description: "Description for Product 3",
    category: "socks",
    priceInPennies: 29999,
    stock: 30,
    sold: 6,
    gender: "female",
    colors: ["Green"],
    sizes: ["L", "XL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 4",
    description: "Description for Product 4",
    category: "pants",
    priceInPennies: 39999,
    stock: 40,
    sold: 8,
    gender: "male",
    colors: ["Red"],
    sizes: ["S", "M"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 5",
    description: "Description for Product 5",
    category: "jumper",
    priceInPennies: 49999,
    stock: 50,
    sold: 10,
    gender: "female",
    colors: ["Red"],
    sizes: ["M", "L"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 6",
    description: "Description for Product 6",
    category: "tshirt",
    priceInPennies: 59999,
    stock: 60,
    sold: 12,
    gender: "unisex",
    colors: ["Black"],
    sizes: ["S"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 7",
    description: "Description for Product 7",
    category: "jumper",
    priceInPennies: 69999,
    stock: 70,
    sold: 14,
    gender: "unisex",
    colors: ["Red"],
    sizes: ["L"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 8",
    description: "Description for Product 8",
    category: "tshirt",
    priceInPennies: 79999,
    stock: 45,
    sold: 34,
    gender: "male",
    colors: ["Blue"],
    sizes: ["L", "XL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 9",
    description: "Description for Product 9",
    category: "socks",
    priceInPennies: 89999,
    stock: 67,
    sold: 12,
    gender: "female",
    colors: ["Green"],
    sizes: ["XXL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 10",
    description: "Description for Product 10",
    category: "pants",
    priceInPennies: 99999,
    stock: 23,
    sold: 67,
    gender: "male",
    colors: ["Grey"],
    sizes: ["XL"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 11",
    description: "Description for Product 11",
    category: "jumper",
    priceInPennies: 199999,
    stock: 90,
    sold: 43,
    gender: "female",
    colors: ["Purple"],
    sizes: ["S", "M"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
  {
    name: "Product 12",
    description: "Description for Product 12",
    category: "tshirt",
    priceInPennies: 299999,
    stock: 230,
    sold: 18,
    gender: "unisex",
    colors: ["Multi"],
    sizes: ["XS", "S"],
    isAvailable: "true",
    images: ["image_not_found.svg"],
  },
];

const insertProductQuery = `INSERT INTO Products (name, description, category, priceInPennies, stock, sold, gender, isAvailable) 
VALUES (@name, @description, @category, @priceInPennies, @stock, @sold, @gender, @isAvailable)`;

const insertProductSizeQuery = `INSERT INTO ProductSize (size) VALUES (?)`;
const insertProductColorQuery = `INSERT INTO ProductColor (color) VALUES (?)`;

const insertProductSizesQueary = `INSERT INTO ProductSizes (product_id, size_id) VALUES (?, ?)`;
const insertProductColorsQueary = `INSERT INTO ProductColors (product_id, color_id) VALUES (?, ?)`;

const insertProductStmt = mainDatabase.prepare(insertProductQuery);
const insertProductSizeStmt = mainDatabase.prepare(insertProductSizeQuery);
const insertProductSizesStmt = mainDatabase.prepare(insertProductSizesQueary);
const insertProductColorStmt = mainDatabase.prepare(insertProductColorQuery);
const insertProductColorsStmt = mainDatabase.prepare(insertProductColorsQueary);

const insertProducts = mainDatabase.transaction((products) => {
  const sizeMap = new Map();
  const colorMap = new Map();

  const uniqueSizes = new Set();
  const uniqueColors = new Set();
  for (const product of products) {
    product.sizes.forEach((size) => {
      uniqueSizes.add(size);
    });
    product.colors.forEach((color) => {
      uniqueColors.add(color);
    });
  }

  for (const size of uniqueSizes) {
    const info = insertProductSizeStmt.run(size);
    sizeMap.set(size, info.lastInsertRowid);
  }

  for (const color of uniqueColors) {
    const info = insertProductColorStmt.run(color);
    colorMap.set(color, info.lastInsertRowid);
  }

  for (const product of products) {
    try {
      const info = insertProductStmt.run(product);
      const productId = info.lastInsertRowid;

      for (const size of product.sizes) {
        const sizeId = sizeMap.get(size);
        insertProductSizesStmt.run(productId, sizeId);
      }

      for (const color of product.colors) {
        const colorId = colorMap.get(color);
        insertProductColorsStmt.run(productId, colorId);
      }

      for (const image of product.images) {
        mainDatabase
          .prepare(
            `
              INSERT 
              INTO ProductImages (product_id, path) 
              VALUES (?, ?)
              `
          )
          .run(productId, image);
      }
    } catch (error) {
      console.error(`Error inserting product ${product.name}:`, error.message);
    }
  }

  mainDatabase
    .prepare(
      `
    INSERT 
    INTO SlideshowImages (image_spot, path) 
    VALUES (?, ?)
    `
    )
    .run(1, "AciuAtvirute.png");
});

insertProducts(products);

console.log("Database seeded succesfully.");
