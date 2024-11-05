import { PageHeader } from "../../../../components/admin/PageHeader";
import NewsLetterForm from "../../../../components/admin/newsLetter/NewsLetterForm";
import getNewsLetterEmails from "../../../../database/models/user/getNewsLetterEmails";

export default async function CreateNewsLetter() {
  const emailsData = await getNewsLetterEmails();

  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Create Newsletter</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <NewsLetterForm emailsData={emailsData} />
      </div>
    </>
  );
}
