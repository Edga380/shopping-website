import { PageHeader } from "../../../../components/admin/PageHeader";
import getNewsLetterEmails from "../../../../database/models/user/getNewsLetterEmails";
import DisplayEmailList from "../../../../components/admin/newsLetter/DisplayEmailList";

export default async function EmailList() {
  const emailsData = await getNewsLetterEmails();
  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Email List</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayEmailList emailsData={emailsData} />
      </div>
    </>
  );
}
