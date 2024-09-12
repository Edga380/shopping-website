import Link from "next/link";
import DisplayRecoverPasswordForm from "../../../../components/customer/recoverPassword/DisplayRecoverPasswordForm";

export default function RecoverPassword() {
  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
          Recover password
        </div>
        <DisplayRecoverPasswordForm />
        <Link
          href={"/profile/login"}
          className="bg-color-pallet-03 py-2 px-6 mt-4 mb-32 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
