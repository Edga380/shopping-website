import DisplayContactUsSubmissions from "../../../components/customer/contact/DisplayContactUsSubmissions";
import getSubmissions from "../../../database/models/contact/getSubmissions";

export default async function ContactUsSubmissions() {
  const submissionsData = await getSubmissions();

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_3fr_0.5fr_0.4fr] mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green rounded-lg border-2 border-color-pallet-04 text-lg">
        <div className="px-2">Date/time submitted</div>
        <div className="px-2">Full name</div>
        <div className="px-2">Email</div>
        <div className="px-2">Subject</div>
        <div className="px-2">Message</div>
        <div className="px-2">Total: {submissionsData.length}</div>
        <div className="px-2">Replied?</div>
      </div>
      <DisplayContactUsSubmissions submissionsData={submissionsData} />
    </>
  );
}
