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

const productsToAdd = getProductsData();

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

const categoriesToAdd = [
  "Dresses",
  "Hats",
  "Hoodies",
  "Jumpers",
  "Shoes",
  "Skirts",
  "Socks",
  "T-shirt",
  "Trousers",
  "Underwear",
];

categoriesToAdd.forEach((category) => {
  database
    .prepare(
      `
        INSERT
        INTO ProductCategory
            (category)
        VALUES
            (?)
        `
    )
    .run(category);
});

const colorsToAdd = [
  "Aqua",
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Navy",
  "Pink",
  "Red",
  "Violet",
  "White",
  "Yellow",
];

colorsToAdd.forEach((color) => {
  database
    .prepare(
      `
        INSERT
        INTO ProductColor
            (color)
        VALUES 
            (?)
        `
    )
    .run(color);
});

const sizesToAdd = [
  { size: "XS", category: "Dresses" },
  { size: "S", category: "Dresses" },
  { size: "M", category: "Dresses" },
  { size: "L", category: "Dresses" },
  { size: "XL", category: "Dresses" },
  { size: "XS", category: "Hats" },
  { size: "S", category: "Hats" },
  { size: "M", category: "Hats" },
  { size: "L", category: "Hats" },
  { size: "XL", category: "Hats" },
  { size: "XS", category: "Hoodies" },
  { size: "S", category: "Hoodies" },
  { size: "M", category: "Hoodies" },
  { size: "L", category: "Hoodies" },
  { size: "XL", category: "Hoodies" },
  { size: "XS", category: "Jumpers" },
  { size: "S", category: "Jumpers" },
  { size: "M", category: "Jumpers" },
  { size: "L", category: "Jumpers" },
  { size: "XL", category: "Jumpers" },
  { size: "UK4", category: "Shoes" },
  { size: "UK5", category: "Shoes" },
  { size: "UK6", category: "Shoes" },
  { size: "UK7", category: "Shoes" },
  { size: "UK8", category: "Shoes" },
  { size: "UK9", category: "Shoes" },
  { size: "UK10", category: "Shoes" },
  { size: "UK11", category: "Shoes" },
  { size: "XS", category: "Skirts" },
  { size: "S", category: "Skirts" },
  { size: "M", category: "Skirts" },
  { size: "L", category: "Skirts" },
  { size: "XL", category: "Skirts" },
  { size: "UK4-UK6", category: "Socks" },
  { size: "UK6-UK8", category: "Socks" },
  { size: "UK8-UK10", category: "Socks" },
  { size: "UK10-UK12", category: "Socks" },
  { size: "XS", category: "T-shirt" },
  { size: "S", category: "T-shirt" },
  { size: "M", category: "T-shirt" },
  { size: "L", category: "T-shirt" },
  { size: "XL", category: "T-shirt" },
  { size: "W28L28", category: "Trousers" },
  { size: "W30L30", category: "Trousers" },
  { size: "W32L32", category: "Trousers" },
  { size: "W34L34", category: "Trousers" },
  { size: "XS", category: "Underwear" },
  { size: "S", category: "Underwear" },
  { size: "M", category: "Underwear" },
  { size: "L", category: "Underwear" },
  { size: "XL", category: "Underwear" },
];

sizesToAdd.forEach(({ size, category }) => {
  const result = database
    .prepare(
      `
        INSERT
        INTO ProductSize
          (size)
        VALUES
          (?)
        ON CONFLICT (size) DO NOTHING;
        `
    )
    .run(size);

  if (result.changes === 0) {
    const { product_size_id } = database
      .prepare(
        `
          SELECT product_size_id 
          FROM ProductSize 
          WHERE size = ?
          `
      )
      .get(size);

    insertProductCategorySize(product_size_id, category);
  } else {
    insertProductCategorySize(result.lastInsertRowid, category);
  }
});

function insertProductCategorySize(sizeId, category) {
  database
    .prepare(
      `
      INSERT
      INTO ProductCategorySize
        (category_id, size_id)
      SELECT product_category_id, ?
      FROM ProductCategory
      WHERE category = ?
      `
    )
    .run(sizeId, category);
}

productsToAdd.forEach((productToAdd) => {
  const {
    name,
    description,
    category,
    basePriceInPennies,
    gender,
    selectedInventoryData,
    isAvailable,
  } = productToAdd;

  const groupedInventoryDataByColor = selectedInventoryData.reduce(
    (acc, parseSelectedSizeStock) => {
      let existingColor = acc.find(
        (colorObject) => colorObject.color === parseSelectedSizeStock.color
      );

      if (existingColor) {
        existingColor.inventoryData.push({
          size: parseSelectedSizeStock.size,
          stock: parseSelectedSizeStock.stock,
          sold: parseSelectedSizeStock.sold,
          discount: parseSelectedSizeStock.discount,
        });
      } else {
        acc.push({
          color: parseSelectedSizeStock.color,
          inventoryData: [
            {
              size: parseSelectedSizeStock.size,
              stock: parseSelectedSizeStock.stock,
              sold: parseSelectedSizeStock.sold,
              discount: parseSelectedSizeStock.discount,
            },
          ],
        });
      }

      return acc;
    },
    []
  );

  const insertProduct = database.transaction(() => {
    const productResult = database
      .prepare(
        `
            INSERT
            INTO Product
              (name, description, category, base_price_in_pennies, gender, is_available)
            VALUES
              (?, ?, ?, ?, ?, ?)
            `
      )
      .run(
        name,
        description,
        category,
        basePriceInPennies,
        gender,
        isAvailable
      );

    return productResult.lastInsertRowid;
  });

  const selectColorInsertVariation = database.transaction(
    (groupedInventoryDataByColor) => {
      const productId = insertProduct();

      groupedInventoryDataByColor.forEach(({ color, inventoryData }) => {
        const { product_color_id } = database
          .prepare(
            `
                SELECT product_color_id
                FROM ProductColor
                WHERE color = ?
                `
          )
          .get(color);
        const productVariationId = database
          .prepare(
            `
                INSERT
                INTO ProductVariation 
                  (product_id, color_id)
                VALUES 
                  (?, ?)
                `
          )
          .run(productId, product_color_id);

        inventoryData.forEach(({ size, stock, sold, discount }) => {
          const { product_size_id } = database
            .prepare(
              `
                  SELECT product_size_id
                  FROM ProductSize
                  WHERE size = ?
                  `
            )
            .get(size);
          database
            .prepare(
              `
                  INSERT
                  INTO ProductVariationSizeInventory 
                    (product_variation_id, size_id, stock, sold, discount)
                  VALUES 
                    (?, ?, ?, ?, ?)
                  `
            )
            .run(
              productVariationId.lastInsertRowid,
              product_size_id,
              stock,
              sold,
              discount
            );
        });
      });
    }
  );

  try {
    selectColorInsertVariation(groupedInventoryDataByColor);
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
});
