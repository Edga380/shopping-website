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

  return submissionsData.map((submission, index) => {
    const newDate = new Date();
    const currentDate = new Date(submission.created_at);

    const newDay = newDate.getDay();
    const currentDay = currentDate.getDay();

    const isToday = newDay === currentDay;

    return (
      <div
        key={index}
        className="grid grid-cols-[1fr_1fr_1fr_1fr_3fr_0.4fr_0.4fr] mt-2 px-2 relative bg-color-pallet-02 text-text-color-dark-green rounded-lg border-2 border-color-pallet-03"
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
    );
  });
}
