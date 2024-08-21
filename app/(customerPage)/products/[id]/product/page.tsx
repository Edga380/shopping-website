import DisplayProduct from "../../../../../components/customer/DisplayProduct";
import { getProduct } from "../../../../../database/models/product/getProduct";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const fetchedProduct = await getProduct(id);
  return (
    <div className="bg-color-pallet-02 my-4 p-4 rounded-xl">
      <DisplayProduct product={fetchedProduct} />
    </div>
  );
}
