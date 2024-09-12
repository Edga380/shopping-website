import DisplayResetPasswordForm from "../../../../components/customer/resetPassword/DisplayResetPasswordForm";

export default async function ResetPassword() {
  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
          Reset password
        </div>
        <DisplayResetPasswordForm />
      </div>
    </div>
  );
}
