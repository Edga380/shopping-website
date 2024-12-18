"use server";

import Link from "next/link";
import authUser from "../../../database/models/user/authUser";
import DisplayUserProfile from "../../../components/customer/DisplayUserProfile";

export default async function Profile() {
  const user = await authUser();

  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      {user ? (
        <DisplayUserProfile user={user} />
      ) : (
        <div className="flex-col w-full">
          <div className="bg-color-pallet-03 text-text-color-dark-green text-2xl text-center font-semibold p-2 rounded-t-2xl">
            Profile
          </div>
          <div className="text-text-color-dark-green text-2xl text-center mt-4">
            User not found
          </div>
          <div className="mt-2 mb-6 flex flex-col justify-center">
            <div className="my-6 mx-auto">
              <Link
                href={"/profile/login"}
                className="bg-color-pallet-03 py-2 px-6 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                Login
              </Link>
            </div>
            <div className="text-text-color-dark-green text-2xl text-center mt-4">
              Or
            </div>
            <div className="my-6 mx-auto">
              <Link
                href={"/profile/register"}
                className="bg-color-pallet-03 py-2 px-6 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
