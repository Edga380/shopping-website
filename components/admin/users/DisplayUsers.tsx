"use client";

import { UserData } from "../../../types/databaseTypes";

export default function DisplayUsers({ usersData }: { usersData: UserData[] }) {
  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
        <div>Total: {usersData?.length}</div>
        <div>Username</div>
        <div>Email</div>
        <div>Joined</div>
      </div>
      {usersData &&
        usersData.map((userData) => (
          <div
            key={userData.user_id}
            className="relative grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-4 px-2 py-1 bg-color-pallet-02 text-text-color-dark-green shadow-md"
          >
            <div>{userData.user_id}</div>
            <div>{userData.username}</div>
            <div>{userData.email}</div>
            <div>{userData.created_at}</div>
          </div>
        ))}
    </>
  );
}
