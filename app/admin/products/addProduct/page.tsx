import { PageHeader } from "../../../../components/admin/PageHeader";
import AddProductFrom from "../../../../components/admin/product/AddProductForm";

export default function AdminAddProductPage() {
  return (
    <>
      <div className="bg-color-pallet-02 p-2">
        <PageHeader>Add product</PageHeader>
      </div>
      <AddProductFrom />
    </>
  );
}
