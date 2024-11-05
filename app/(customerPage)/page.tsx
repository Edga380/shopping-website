import BestSellers from "../../components/customer/BestSellers";
import Newest from "../../components/customer/Newest";
import SlideShow from "../../components/slideShow/HomePageSlideShow";
import { getBestSellerProducts } from "../../database/models/product/getBestSellerProducts";
import { getNewestProducts } from "../../database/models/product/getNewestProducts";
import { getSlideShowImages } from "../../database/models/slideShow/getSlideShowImages";

export default async function HomePage() {
  const fetchSlideShowImages = await getSlideShowImages();
  const fetchNewestProducts = await getNewestProducts();
  const fetchBestSellersProducts = await getBestSellerProducts();
  return (
    <>
      <div className="mx-10">
        <SlideShow slideShowImages={fetchSlideShowImages}></SlideShow>
      </div>
      <div className="my-10">
        <Newest newestProducts={fetchNewestProducts}></Newest>
      </div>
      <div className="my-10">
        <BestSellers
          bestSellersProducts={fetchBestSellersProducts}
        ></BestSellers>
      </div>
    </>
  );
}
