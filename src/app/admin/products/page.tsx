import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Admin products</PageHeader>
        <button className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04">
          <Link href="/admin/products/new">Add Product</Link>
        </button>
      </div>
    </>
  );
}

function ContentTable() {
  return;
}
