import ProductCard from "./ProductCard";
import { getBestSellerProducts } from "../../database/models/product/getBestSellerProducts";

export default function BestSellers() {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Best Sellers
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <FetchProducts />
      </div>
    </>
  );
}

async function FetchProducts() {
  const products = await getBestSellerProducts();
  return products.map((product: any) => (
    <ProductCard
      key={product.product_id}
      src={`/products/${product.images[0]}`}
      name={product.name}
      price={product.priceInPennies / 100}
      productLink={`/products/${product.product_id}/product`}
    ></ProductCard>
  ));
}
