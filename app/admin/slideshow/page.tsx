import { PageHeader } from "../../../components/admin/PageHeader";
import AdminSlideShow from "../../../components/slideShow/AdminSlideShow";

export default async function AdminSlideshow() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Adjust slideshow</PageHeader>
      </div>
      <AdminSlideShow />
    </>
  );
}
