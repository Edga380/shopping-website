import DisplayProduct from "../../../../../components/customer/DisplayProduct";
import getProduct from "../../../../../database/models/product/getProduct";
import authUser from "../../../../../database/models/user/authUser";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await authUser();
  const fetchedProduct = await getProduct(id);
  return (
    <div className="bg-color-pallet-02 my-4 p-4 rounded-xl">
      <DisplayProduct product={fetchedProduct} userData={user} />
    </div>
  );
}
