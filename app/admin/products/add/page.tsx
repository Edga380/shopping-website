import { PageHeader } from "../../../../components/admin/PageHeader";
import AddProductFrom from "../../../../components/admin/AddProductForm";

export default function AdminAddProductPage() {
  return (
    <>
      <div className="w-2/4 mx-auto">
        <PageHeader>Add Product</PageHeader>
        <AddProductFrom />
      </div>
    </>
  );
}
