import EditProductFrom from "../../../../../components/admin/product/EditProductForm";
import getProduct from "../../../../../database/models/product/getProduct";
import { PageHeader } from "../../../../../components/admin/PageHeader";

export default async function AdminEditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);
  return (
    <>
      <div className="bg-color-pallet-02 p-2">
        <PageHeader>Edit product</PageHeader>
      </div>
      <EditProductFrom product={product}></EditProductFrom>
    </>
  );
}
