"use client";

import { useUser } from "../../context/UserContext";
import { UserData } from "../../types/databaseTypes";
import logoutUser from "../../database/models/user/logoutUser";
import { useEffect } from "react";

type userProps = {
  user: UserData;
};

export default function DisplayUserProfile({ user }: userProps) {
  const { userData, setUserData } = useUser();

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleLogoutUser = async () => {
    const response = await logoutUser(user.user_id);

    if (response.success) {
      setUserData(null);
    }
  };
  return (
    userData && (
      <div className="flex flex-col">
        <div>{userData.user_id}</div>
        <div>{userData.username}</div>
        <button onClick={() => handleLogoutUser()}>Logout</button>
      </div>
    )
  );
}
