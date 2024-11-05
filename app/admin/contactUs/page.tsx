import DisplayContactUsSubmissions from "../../../components/admin/contact/DisplayContactUsSubmissions";
import getSubmissions from "../../../database/models/contact/getSubmissions";
import { PageHeader } from "../../../components/admin/PageHeader";

export default async function ContactUsSubmissions() {
  const submissionsData = await getSubmissions();

  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Contact Us</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayContactUsSubmissions submissionsData={submissionsData} />
      </div>
    </>
  );
}
