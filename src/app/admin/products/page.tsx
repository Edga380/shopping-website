import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { formatCurrency } from "@/utils/formatters";
import { RetrieveAllProductData } from "../../../../database/db";
import AdminProductDropdownMenu from "./_components/ProductDropdownMenu";

export const fetchCache = "force-no-store";

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
              {(product as any).isAvailable === "true" ? (
                <div className="bg-green-600 rounded-full w-4 h-4"></div>
              ) : (
                <div className="bg-red-600 rounded-full w-4 h-4"></div>
              )}
            </div>
            <div className="px-2 self-center">
              {(product as any).created_at.slice(0, 10)}
            </div>
            <AdminProductDropdownMenu
              productId={(product as any).product_id}
              isAvailable={(product as any).isAvailable}
            ></AdminProductDropdownMenu>
          </div>
        ))}
      </div>
    </>
  );
}
