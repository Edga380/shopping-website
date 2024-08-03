import { getNewestProducts } from "../../database/models/product/getNewestProducts";
import ProductCard from "./ProductCard";

export default function Newest() {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Newest
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <FetchProducts />
      </div>
    </>
  );
}

async function FetchProducts() {
  const products = await getNewestProducts();
  return products.map((product) => (
    <ProductCard key={product.product_id} product={product}></ProductCard>
  ));
}
