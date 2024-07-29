import DisplayProducts from "../../../components/customer/DisplayProducts";
import { getAvailableProducts } from "../../../database/models/product/getAvailableProducts";

export default async function ProductsPage() {
  const products = await getAvailableProducts();

  return <DisplayProducts products={products}></DisplayProducts>;
}
