"use client";

import { useUser } from "../../context/UserContext";
import { UserData } from "../../types/databaseTypes";
import logoutUser from "../../database/models/user/logoutUser";
import { useEffect } from "react";
import Link from "next/link";

export default function DisplayUserProfile({ user }: { user: UserData }) {
  const { userData, setUserData } = useUser();

  useEffect(() => {
    setUserData(user);
  }, [user, setUserData]);

  const handleLogoutUser = async () => {
    const response = await logoutUser(user.user_id);

    if (response.success) {
      setUserData(null);
    }
  };
  return (
    userData && (
      <>
        <div
          key={userData.user_id}
          className="bg-color-pallet-03 text-text-color-dark-green text-2xl text-center font-semibold p-2 rounded-l-2xl w-96"
        >
          <div className="bg-color-pallet-03 p-2 font-bold text-text-color-dark-green">
            Hello {userData.username}!
          </div>
          <div className="p-2 font-bold text-text-color-dark-green text-medium">
            Joined {userData.created_at.slice(0, 10)}
          </div>
          <button
            className="bg-color-pallet-02 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md m-2 hover:bg-color-pallet-04"
            type="button"
            onClick={() => handleLogoutUser()}
          >
            Logout
          </button>
        </div>
        <div className="flex-col w-full">
          <div className="bg-color-pallet-03 text-text-color-dark-green text-2xl text-center font-semibold p-2 rounded-se-2xl">
            Order history
          </div>
          <div className="text-text-color-dark-green text-2xl text-center mt-4">
            No orders
          </div>
          <div className="mt-2 mb-6 flex flex-col justify-center">
            <div className="my-6 mx-auto">
              <Link
                href={"/products"}
                className="bg-color-pallet-03 py-2 px-6 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  );
}
