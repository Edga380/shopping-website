import { PageHeader } from "../../../../components/admin/PageHeader";
import DisplaySizes from "../../../../components/admin/product/size/DisplaySizes";
import getCategories from "../../../../database/models/product/getCategories";

export default async function addSize() {
  const productCategories = await getCategories();

  return (
    <>
      <div className="bg-color-pallet-02 p-2">
        <PageHeader>Product sizes</PageHeader>
      </div>
      <DisplaySizes productCategories={productCategories} />
    </>
  );
}
