import BestSellers from "../../components/customer/BestSellers";
import Newest from "../../components/customer/Newest";
import SlideShow from "../../components/slideShow/HomePageSlideShow";
import { getSlideShowImages } from "../../database/models/slideShow/getSlideShowImages";

export default async function HomePage() {
  const slideShowImages = await getSlideShowImages();
  return (
    <>
      <div className="mx-10">
        <SlideShow slideShowImages={slideShowImages}></SlideShow>
      </div>
      <div className="my-10">
        <Newest></Newest>
      </div>
      <div className="my-10">
        <BestSellers></BestSellers>
      </div>
    </>
  );
}
