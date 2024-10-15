import { PageHeader } from "../../../components/admin/PageHeader";
import AdminSlideShow from "../../../components/slideShow/AdminSlideShow";

export default async function AdminSlideshow() {
  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Main Slideshow</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <AdminSlideShow />
      </div>
    </>
  );
}
