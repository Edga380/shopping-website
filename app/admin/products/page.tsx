import { PageHeader } from "../../../components/admin/PageHeader";
import { getAllProducts } from "../../../database/models/product/getAllProduct";
import DisplayProducts from "../../../components/admin/DisplayProducts";

export const fetchCache = "force-no-store";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Products</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayProducts products={products}></DisplayProducts>
      </div>
    </>
  );
}
