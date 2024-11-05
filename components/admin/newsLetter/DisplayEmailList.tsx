"use client";

import { NewsLetterEmailsData } from "../../../types/databaseTypes";
import removeEmail from "../../../database/models/newsLetter/removeEmail";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DisplayEmailList({
  emailsData,
}: {
  emailsData: NewsLetterEmailsData[] | undefined;
}) {
  const router = useRouter();
  const [messageData, setMessageData] = useState<{
    success: boolean;
    message: string;
    color: string;
  }>({ success: false, message: "", color: "" });
  const [confirmRemoveIsActive, setConfirmRemoveIsActive] = useState<
    number | null
  >(null);

  const handleRemoveEmail = async (id: number) => {
    const resposne = await removeEmail(id);

    if (resposne.success) {
      setMessageData({
        success: resposne.success,
        message: resposne.message,
        color: resposne.color,
      });
    } else {
      setMessageData({
        success: resposne.success,
        message: resposne.message,
        color: resposne.color,
      });
    }
  };
  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
        <div>Total: {emailsData?.length}</div>
        <div>Subscribe date/time</div>
        <div>Email</div>
        <div className="m-auto">Remove Email</div>
      </div>
      {emailsData &&
        emailsData.map((email, index) => (
          <div
            key={email.news_letter_subscription_id}
            className="relative grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-4 px-2 py-1 bg-color-pallet-02 text-text-color-dark-green shadow-md"
          >
            <div>{index}</div>
            <div>{email.created_at}</div>
            <div>{email.news_letter_subscription_email}</div>
            <button
              onClick={() =>
                setConfirmRemoveIsActive(
                  index === confirmRemoveIsActive ? null : index
                )
              }
              className="bg-red-500 py-1 px-4 my-1 mx-auto rounded-md hover:bg-red-700 shadow-md text-text-color-dark-green font-semibold text-medium"
            >
              Remove
            </button>

            {confirmRemoveIsActive === index && (
              <div className="fixed left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center">
                <div className="bg-color-pallet-02 w-96 h-44 rounded-lg relative flex flex-col justify-center items-center">
                  <div
                    className="font-semibold text-lg text-center"
                    style={{ color: messageData.color }}
                  >
                    {messageData.message}
                  </div>
                  <div className="font-semibold text-lg text-center">
                    Are you sure you want to remove:
                  </div>
                  <div className="font-bold text-xl text-center">
                    &quot;{email.news_letter_subscription_email}&quot;
                  </div>
                  <div className="pt-6 flex justify-center space-x-4">
                    <button
                      className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6"
                      onClick={() =>
                        handleRemoveEmail(email.news_letter_subscription_id)
                      }
                    >
                      Confirm
                    </button>
                    <button
                      className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6"
                      onClick={() => {
                        setConfirmRemoveIsActive(
                          index === confirmRemoveIsActive ? null : index
                        );
                        router.refresh();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  );
}
