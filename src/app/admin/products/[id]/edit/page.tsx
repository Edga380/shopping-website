import { PageHeader } from "../../../_components/PageHeader";
import AdminProductFrom from "../../_components/ProductForm";
import { RetrieveProductData } from "../../../../../../database/db";

export default async function AdminEditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await RetrieveProductData(id);
  return (
    <>
      <div className="w-2/4 mx-auto">
        <PageHeader>Edit Product</PageHeader>
        <AdminProductFrom product={product}></AdminProductFrom>
      </div>
    </>
  );
}
