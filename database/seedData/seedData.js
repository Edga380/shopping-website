const Database = require("better-sqlite3");
const { join } = require("path");
const fs = require("fs");
require("dotenv").config();

function initializeDatabase(databaseName, databaseSchemaName) {
  if (!databaseName || !databaseSchemaName) {
    throw new Error(
      `${!databaseName ? "DatabaseName" : "DatabaseSchemaName"} not defined.`
    );
  }

  const databaseFilePath = join(process.cwd(), "database", databaseName);
  const databaseSchemaPath = join(
    process.cwd(),
    "database",
    databaseSchemaName
  );

  const database = new Database(databaseFilePath);

  const schema = fs.readFileSync(databaseSchemaPath, "utf-8");
  database.exec(schema);

  console.log("Seed database initialized.");

  return database;
}

const database = initializeDatabase(
  process.env.MAIN_DATABASE,
  process.env.MAIN_SCHEMA
);

function getProductsData() {
  const productsJsonFilePath = join(
    process.cwd(),
    "database",
    "seedData",
    "products.json"
  );

  const productsJsonFileData = fs.readFileSync(productsJsonFilePath, "utf-8");

  const productsData = JSON.parse(productsJsonFileData);

  console.log("Product data retrieved.");

  return productsData;
}

const seedDataTransaction = database.transaction(async () => {
  const productsData = await getProductsData();

  const sizeMap = new Map();
  const colorMap = new Map();

  const uniqueSizes = new Set();
  const uniqueColors = new Set();

  for (const product of productsData) {
    product.sizes.forEach((size) => {
      uniqueSizes.add(size);
    });
    product.colors.forEach((color) => {
      uniqueColors.add(color);
    });
  }

  for (const size of uniqueSizes) {
    const result = database
      .prepare(
        `
      INSERT 
      INTO ProductSize
        (size) 
      VALUES (?)
      `
      )
      .run(size);

    sizeMap.set(size, result.lastInsertRowid);
  }

  for (const color of uniqueColors) {
    const result = database
      .prepare(
        `
      INSERT 
      INTO ProductColor
        (color) 
      VALUES (?)
      `
      )
      .run(color);

    colorMap.set(color, result.lastInsertRowid);
  }

  for (const product of productsData) {
    const result = database
      .prepare(
        `
      INSERT
      INTO Products
        (name, description, category, priceInPennies, stock, sold, gender, isAvailable)
      VALUES
        (@name, @description, @category, @priceInPennies, @stock, @sold, @gender, @isAvailable)
      `
      )
      .run(product);

    const productId = result.lastInsertRowid;

    for (const size of product.sizes) {
      const sizeId = sizeMap.get(size);

      database
        .prepare(
          `
        INSERT
        INTO ProductSizes
          (product_id, size_id)
        VALUES
          (?, ?)
        `
        )
        .run(productId, sizeId);
    }

    for (const color of product.colors) {
      const colorId = colorMap.get(color);

      database
        .prepare(
          `
        INSERT
        INTO ProductColors
          (product_id, color_id)
        VALUES
          (?, ?)

        `
        )
        .run(productId, colorId);
    }

    for (const image of product.images) {
      database
        .prepare(
          `
        INSERT
        INTO ProductImages
          (product_id, path)
        VALUES
          (?, ?)
        `
        )
        .run(productId, image);
    }
  }

  console.log("Seed data added to database successfully.");
});

seedDataTransaction();
