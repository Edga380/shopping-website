import SlideShow from "@/components/SlideShow";
export default function Home() {
  return (
    <>
      <header className="flex justify-center">
        <SlideShow></SlideShow>
      </header>
      <section>Favorites</section>
      <section>Best sellers</section>
      <footer>Footer</footer>
    </>
  );
}
