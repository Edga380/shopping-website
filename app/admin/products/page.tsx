import Link from "next/link";
import { PageHeader } from "../../../components/admin/PageHeader";
import { getAllProducts } from "../../../database/models/product/getAllProduct";
import DisplayProducts from "../../../components/admin/DisplayProducts";

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
      <div className="mb-28">
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
          <DisplayProducts products={products}></DisplayProducts>
        </div>
      </div>
    </>
  );
}
