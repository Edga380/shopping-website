import { PageHeader } from "../../../components/admin/PageHeader";
import NewsLetterForm from "../../../components/admin/newsLetter/NewsLetterForm";
import getNewsLetterEmails from "../../../database/models/user/getNewsLetterEmails";

export default async function ContactUsSubmissions() {
  const emailsData = await getNewsLetterEmails();
  return (
    <>
      <div className="w-3/4 mx-auto">
        <PageHeader>Send NewsLetter</PageHeader>
        <>
          <div className="mt-2 mb-20 p-2 bg-color-pallet-01 text-text-color-dark-green rounded-lg border-2 border-color-pallet-04">
            <NewsLetterForm emailsData={emailsData} />
          </div>
        </>
      </div>
    </>
  );
}
