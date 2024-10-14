import { PageHeader } from "../../../../components/admin/PageHeader";
import DisplayColors from "../../../../components/admin/product/color/DisplayColors";

export default function addColor() {
  return (
    <>
      <div className="bg-color-pallet-02 p-2">
        <PageHeader>Product colors</PageHeader>
      </div>
      <DisplayColors />
    </>
  );
}
