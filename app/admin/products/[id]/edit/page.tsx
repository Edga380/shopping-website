import EditProductFrom from "../../../../../components/admin/EditProductForm";
import { getProduct } from "../../../../../database/models/product/getProduct";
import { PageHeader } from "../../../../../components/admin/PageHeader";

export default async function AdminEditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);
  return (
    <>
      <div className="w-2/4 mx-auto">
        <PageHeader>Edit Product</PageHeader>
        <EditProductFrom product={product}></EditProductFrom>
      </div>
    </>
  );
}
