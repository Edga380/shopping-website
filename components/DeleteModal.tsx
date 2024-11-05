"use client";

import { SetStateAction } from "react";

type DeleteModal = {
  currentId: number | undefined;
  elementId: number;
  message: string;
  name: string;
  handleDelete: (index: number) => Promise<void>;
  setDeleteModal: (value: SetStateAction<number | undefined>) => void;
};

export default function DeleteModal({
  currentId,
  elementId,
  message,
  name,
  handleDelete,
  setDeleteModal,
}: DeleteModal) {
  return (
    currentId === elementId && (
      <div className="fixed left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center z-10">
        <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
          <div className="font-semibold text-lg">
            Are you sure you want to delete
          </div>
          <div className="font-bold text-xl">
            <span className="font-semibold text-lg">{message}:</span> {name}
          </div>
          <div className="pt-6 flex justify-center space-x-4">
            <button
              className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
              onClick={() => handleDelete(elementId)}
            >
              Confirm
            </button>
            <button
              className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6 shadow-md"
              onClick={() => setDeleteModal(undefined)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}
