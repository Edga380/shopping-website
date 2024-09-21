import Link from "next/link";
import { PageHeader } from "../../../../components/admin/PageHeader";
import getNewsLetterEmails from "../../../../database/models/user/getNewsLetterEmails";
import DisplayEmailList from "../../../../components/admin/newsLetter/DisplayEmailList";

export default async function RemoveEmail() {
  const emailsData = await getNewsLetterEmails();
  return (
    <>
      <div className="w-3/4 mx-auto">
        <PageHeader>Send NewsLetter</PageHeader>
        <>
          <div className="mt-2 mb-20 p-2 bg-color-pallet-01 text-text-color-dark-green rounded-lg border-2 border-color-pallet-04">
            <Link href="/admin/newsLetter">Back</Link>
            <DisplayEmailList emailsData={emailsData} />
          </div>
        </>
      </div>
    </>
  );
}
