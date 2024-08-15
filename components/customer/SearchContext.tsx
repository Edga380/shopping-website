"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type SearchContextProps = {
  searchInput: string | null;
  setSearchInput: React.Dispatch<React.SetStateAction<string | null>>;
};

type SearchProviderProps = {
  children: ReactNode;
};

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchInput, setSearchInput] = useState<string | null>(null);

  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used wthin a SearchProvider");
  }
  return context;
};
