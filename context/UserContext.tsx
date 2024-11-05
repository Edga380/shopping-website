"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type UserContextProps = {
  userData: {
    user_id: number;
    username: string;
    email: string;
    created_at: string;
  } | null;
  setUserData: React.Dispatch<
    React.SetStateAction<{
      user_id: number;
      username: string;
      email: string;
      created_at: string;
    } | null>
  >;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<{
    user_id: number;
    username: string;
    email: string;
    created_at: string;
  } | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used wthin a UserProvider");
  }
  return context;
};
