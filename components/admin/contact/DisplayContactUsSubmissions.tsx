"use client";

import { useRef, useState, useEffect } from "react";
import { ContactUsSubmissions } from "../../../types/databaseTypes";
import updateReplied from "../../../database/models/contact/updateReplied";
import { useRouter } from "next/navigation";

export default function DisplayContactUsSubmissions({
  submissionsData,
}: {
  submissionsData: ContactUsSubmissions[];
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean[]>(
    new Array(submissionsData.length).fill(false)
  );
  const [mounted, setMounted] = useState<boolean>(false);

  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

  const toggleIsExpanded = (index: number) => {
    setIsExpanded((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };

  const toggleReplied = async (id: string, checked: boolean) => {
    await updateReplied(id, checked);
    router.refresh();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return submissionsData.length > 0 ? (
    submissionsData.map((submission, index) => {
      const newDate = new Date();
      const currentDate = new Date(submission.created_at);

      const newDay = newDate.getDay();
      const currentDay = currentDate.getDay();

      const isToday = newDay === currentDay;

      return (
        <>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_3fr_0.5fr_0.4fr] items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
            <div>Date/time submitted</div>
            <div>Full name</div>
            <div className="mx-auto">Email</div>
            <div className="mx-auto">Subject</div>
            <div className="mx-auto">Message</div>
            <div className="mx-auto">Total: {submissionsData.length}</div>
            <div className="mx-auto">Replied?</div>
          </div>
          <div
            key={index}
            className="relative grid grid-cols-[1fr_1fr_1fr_1fr_3fr_0.5fr_0.4fr] items-center mt-4 p-2 bg-color-pallet-02 text-text-color-dark-green shadow-md"
          >
            {isToday && (
              <div className="absolute -top-4 font-semibold text-red-600">
                New today
              </div>
            )}
            <div className="px-2">{submission.created_at}</div>
            <div className="px-2">{submission.full_name}</div>
            <div className="px-2">{submission.email}</div>
            <div className="px-2">{submission.subject}</div>
            <div
              ref={(element) => {
                contentsRef.current[index] = element;
              }}
              className="px-2 overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isExpanded[index]
                  ? `${contentsRef.current[index]?.scrollHeight}px`
                  : "1.5rem",
              }}
            >
              {submission.message}
            </div>
            {mounted && contentsRef.current[index]!.scrollHeight > 30 ? (
              <button
                className="h-[1.5rem] w-[3rem] bg-color-pallet-03 m-1 rounded-md hover:bg-color-pallet-04"
                onClick={() => toggleIsExpanded(index)}
              >
                {isExpanded[index] ? "\u2191" : "\u2193"}
              </button>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
            <input
              type="checkbox"
              className="h-6 w-6 m-auto"
              checked={submission.replied === "true" ? true : false}
              onChange={(event) =>
                toggleReplied(submission.contact_form_id, event.target.checked)
              }
            />
          </div>
        </>
      );
    })
  ) : (
    <div className="text-2xl text-center font-bold text-text-color-dark-green p-6">
      No Contact us submittions yet.
    </div>
  );
}
