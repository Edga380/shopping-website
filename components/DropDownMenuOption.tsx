"use client";

import { useState, ReactNode } from "react";

type DropDownMenuProps = {
  name: string;
  children: ReactNode;
};

export default function DropDownMenu({ name, children }: DropDownMenuProps) {
  const [displayDropdownMenu, setDisplayDropdownMenu] = useState(false);
  return (
    <div>
      <div>
        <button
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 px-6 rounded hover:bg-color-pallet-04 self-center flex"
          onClick={() => setDisplayDropdownMenu(!displayDropdownMenu)}
        >
          <span>{name}</span>
          <div className="ml-2">
            {displayDropdownMenu ? <p>&darr;</p> : <p>&uarr;</p>}
          </div>
        </button>
      </div>
      {displayDropdownMenu && children}
    </div>
  );
}

type DropDownMenuOptionProps = {
  name: string;
  absolute?: boolean;
  bgColor?: boolean;
  isInput: boolean;
  iscolor?: boolean;
  totalAmount?: number;
  filteredAmount?: number;
  onClick?: () => void;
};

export function DropDownMenuOption({
  name,
  absolute = true,
  bgColor = true,
  isInput = false,
  iscolor = false,
  totalAmount,
  filteredAmount,
  onClick,
}: DropDownMenuOptionProps) {
  return (
    <div
      className={`${absolute && "absolute"} ${
        bgColor && "bg-color-pallet-03 text-lg"
      } flex flex-row items-center w-56 font-bold text-text-color-dark-green my-1 rounded self-center z-10`}
    >
      {isInput ? (
        <>
          <input className="ml-2" type="checkbox" onChange={onClick}></input>
          {!iscolor ? (
            <div className="flex items-center text-base font-semibold text-text-color-dark-green self-center ml-2">
              {name}
              {filteredAmount !== undefined && filteredAmount > 0 ? (
                <div className="ml-2 text-sm">{`(${filteredAmount}/`}</div>
              ) : (
                <div className="ml-2 text-sm">{`(0/`}</div>
              )}
              {totalAmount !== undefined && totalAmount > 0 ? (
                <div className="text-sm">{`${totalAmount})`}</div>
              ) : (
                <div className="text-sm">{`0)`}</div>
              )}
            </div>
          ) : (
            <div className="flex items-center text-base font-semibold text-text-color-dark-green self-center ml-2">
              <div
                className="h-8 w-8 m-2 rounded"
                style={{
                  background: `${
                    name === "Multi"
                      ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                      : name
                  }`,
                }}
              ></div>
              {name}
              {filteredAmount !== undefined && filteredAmount > 0 ? (
                <div className="ml-2 text-sm">{`(${filteredAmount}/`}</div>
              ) : (
                <div className="ml-2 text-sm">{`(0/`}</div>
              )}
              {totalAmount !== undefined && totalAmount > 0 ? (
                <div className="text-sm">{`${totalAmount})`}</div>
              ) : (
                <div className="text-sm">{`0)`}</div>
              )}
            </div>
          )}
        </>
      ) : (
        <button
          onClick={onClick}
          className="text-base font-semibold text-text-color-dark-green self-center ml-2 hover:underline"
        >
          {name}
        </button>
      )}
    </div>
  );
}
