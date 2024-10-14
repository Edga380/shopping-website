import { PageHeader } from "../../../../components/admin/PageHeader";
import DisplayCategories from "../../../../components/admin/product/category/DisplayCategories";

export default async function addCategory() {
  return (
    <>
      <div className="bg-color-pallet-02 p-2">
        <PageHeader>Product categories</PageHeader>
      </div>
      <DisplayCategories />
    </>
  );
}
