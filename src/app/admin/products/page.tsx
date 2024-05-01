import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { formatCurrency } from "@/utils/formatters";
import { RetrieveAllProductData } from "../../../../database/db";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Admin products</PageHeader>
        <button className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04">
          <Link href="/admin/products/new">Add Product</Link>
        </button>
      </div>
      <div>
        <DisplayProducts></DisplayProducts>
      </div>
    </>
  );
}

async function DisplayProducts() {
  const productData = await RetrieveAllProductData();
  return (
    <>
      <div>
        <div className="grid grid-cols-8 px-2 bg-color-pallet-03 text-text-color-dark-green rounded-lg border-2 border-color-pallet-04">
          <div className="px-2 self-center">Name</div>
          <div className="px-2 self-center">Description</div>
          <div className="px-2 self-center">Category</div>
          <div className="px-2 self-center">Price</div>
          <div className="px-2 self-center">Stock</div>
          <div className="px-2 self-center">Available</div>
          <div className="px-2 self-center">Date added</div>
        </div>
        {productData.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-8 mt-2 px-2 bg-color-pallet-02 text-text-color-dark-green rounded-lg border-2 border-color-pallet-03"
          >
            <div className="px-2 self-center">{(product as any).name}</div>
            <div className="px-2 self-center">
              {(product as any).description}
            </div>
            <div className="px-2 self-center">{(product as any).category}</div>
            <div className="px-2 self-center">
              {formatCurrency(Number((product as any).priceInPennies))}
            </div>
            <div className="px-2 self-center">{(product as any).stock}</div>
            <div className="px-2 self-center">
              {(product as any).isAvailable === "true" ? "Yes" : "No"}
            </div>
            <div className="px-2 self-center">
              {(product as any).created_at.slice(0, 10)}
            </div>
            <button className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 rounded hover:bg-color-pallet-04 self-center">
              <Link
                href={`/admin/products/${(product as any).product_id}/edit`}
              >
                Edit
              </Link>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
