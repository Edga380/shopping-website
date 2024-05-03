import { PageHeader } from "../../_components/PageHeader";
import AdminProductFrom from "../_components/ProductForm";

export default function AdminNewProductPage() {
  return (
    <>
      <div className="w-2/4 mx-auto">
        <PageHeader>Add Product</PageHeader>
        <AdminProductFrom></AdminProductFrom>
      </div>
    </>
  );
}
