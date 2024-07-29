import Link from "next/link";
import { PageHeader } from "../../../components/admin/PageHeader";
import { formatCurrency } from "../../../utils/formatters";
import ProductDropdownMenu from "../../../components/admin/ProductDropDownMenu";

import { getAllProducts } from "../../../database/models/product/getAllProduct";

export const fetchCache = "force-no-store";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Admin products</PageHeader>
        <button className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04">
          <Link href="/admin/products/add">Add Product</Link>
        </button>
      </div>
      <div>
        <div>
          <div className="grid grid-cols-9 px-2 bg-color-pallet-03 text-text-color-dark-green rounded-lg border-2 border-color-pallet-04">
            <div className="px-2 self-center">Name</div>
            <div className="px-2 self-center">Description</div>
            <div className="px-2 self-center">Category</div>
            <div className="px-2 self-center">Price</div>
            <div className="px-2 self-center">Stock</div>
            <div className="px-2 self-center">sold</div>
            <div className="px-2 self-center">Available</div>
            <div className="px-2 self-center">Date added</div>
          </div>
          {products.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-9 mt-2 px-2 bg-color-pallet-02 text-text-color-dark-green rounded-lg border-2 border-color-pallet-03"
            >
              <div className="px-2 self-center">{product.name}</div>
              <div className="px-2 self-center">{product.description}</div>
              <div className="px-2 self-center">{product.category}</div>
              <div className="px-2 self-center">
                {formatCurrency(Number(product.priceInPennies))}
              </div>
              <div className="px-2 self-center">{product.stock}</div>
              <div className="px-2 self-center">{product.sold}</div>
              <div className="px-2 self-center">
                {product.isAvailable === "true" ? (
                  <div className="bg-green-600 rounded-full w-4 h-4"></div>
                ) : (
                  <div className="bg-red-600 rounded-full w-4 h-4"></div>
                )}
              </div>
              <div className="px-2 self-center">
                {product.created_at.slice(0, 10)}
              </div>
              <ProductDropdownMenu
                productId={product.product_id}
                isAvailable={product.isAvailable}
                productImages={product.images}
              ></ProductDropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
