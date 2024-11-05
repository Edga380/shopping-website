import { PageHeader } from "../../../components/admin/PageHeader";
import DisplayArchivedNewsLetters from "../../../components/admin/newsLetter/DisplayArchivedNewsLetters";
import getNewsLetters from "../../../database/models/newsLetter/getNewsLetters";

export default async function Newsletter() {
  const fetchNewsLetters = await getNewsLetters();
  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Newsletter</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayArchivedNewsLetters fetchNewsLetters={fetchNewsLetters} />
      </div>
    </>
  );
}
