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
        <div className="flex-col">
          <div className="text-text-color-dark-green text-2xl text-center mt-4">
            User profile not found.
          </div>
          <div className="mt-6 mb-6 flex justify-center">
            <div className="m-6">
              <Link
                href={"/profile/login"}
                className="bg-color-pallet-03 py-2 px-6 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                Login
              </Link>
            </div>
            <div className="m-6">
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
