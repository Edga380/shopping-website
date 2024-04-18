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

  console.log("Database initialized.");
  return db;
}

const usersDb = initializeDatabase(
  process.env.USERS_DATABASE,
  "createUserDb.sql"
);
const productsDb = initializeDatabase(
  process.env.PRODUCTS_DATABASE,
  "products.sql"
);

async function addProductDb(
  name,
  description,
  category,
  priceInPennies,
  units,
  available,
  images
) {
  const statement = productsDb.prepare(
    "INSERT INTO Products (name, description, category, priceInPennies, stock, isAvailable) VALUES (?, ?, ?, ?, ?, ?)"
  );
  try {
    const result = statement.run(
      name,
      description,
      category,
      priceInPennies,
      units,
      available
    );
    console.log("Product added successfully: ", result);
    await addProductDbImages(result.lastInsertRowid, category, images);
    return true;
  } catch (error) {
    console.error("Failed to add product: ", error);
    return false;
  }
}

async function addProductDbImages(productId, category, images) {
  try {
    await Promise.all(
      images.map(async (image) => {
        const imagePath = `/products/${category}/${image.name}`;
        const statement = productsDb.prepare(
          "INSERT INTO ProductImages (product_id, path) VALUES (?, ?)"
        );
        const result = statement.run(productId, imagePath);
        console.log("Product <Images> added successfully: ", result);
      })
    );
    return true;
  } catch (error) {
    console.error("Failed to add product <Images>: ", error);
    return false;
  }
}

module.exports = { usersDb, productsDb, addProductDB: addProductDb };
