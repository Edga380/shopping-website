"use client";

import Image from "next/image";
import { getNewsLetterSections } from "../../../types/databaseTypes";
import { useState } from "react";
import deleteNewsLetter from "../../../database/models/newsLetter/deleteNewsLetter";
import DeleteModal from "../../DeleteModal";
import { useRouter } from "next/navigation";

export default function DisplayArchivedNewsLetters({
  fetchNewsLetters,
}: {
  fetchNewsLetters: getNewsLetterSections[];
}) {
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<
    number | undefined
  >(undefined);
  const router = useRouter();

  const handleDeleteNewsLetter = async (id: number) => {
    try {
      await deleteNewsLetter(id);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {fetchNewsLetters.length > 0 ? (
          fetchNewsLetters
            .sort((a, b) => a.created_at.localeCompare(b.created_at))
            .map((newsLetter) => (
              <div
                key={newsLetter.id}
                className="bg-color-pallet-02 shadow-md max-w-[60rem] text-2xl text-center m-2"
              >
                <div className="flex flex-col mx-auto">
                  <div className="bg-color-pallet-04 relative text-2xl text-center font-bold text-text-color-dark-green p-6">
                    <span className="text-2xl">&#x25C0;</span> [{" "}
                    {newsLetter.subject} ]{" "}
                    <span className="text-2xl">&#x25B6;</span>
                  </div>
                  <div className="max-w-[600px] mx-auto bg-white border-1 border-solid border-gray-400 mb-6 max-h-[30rem] overflow-y-scroll">
                    <Image
                      src="/notFoundImages/slideshow_not_found.svg"
                      width={200}
                      height={100}
                      alt="image not found"
                      className="w-full rounded-none"
                    />
                    {newsLetter.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {section.section.map(
                          (sectionData, sectionDataIndex) => (
                            <div key={sectionDataIndex}>
                              <Image
                                src={`/notFoundImages/${sectionData.image_path}`}
                                width={200}
                                height={100}
                                alt="image not found"
                                className="w-full rounded-none"
                              />
                              <div className="p-5">
                                {sectionData.title && (
                                  <h2 className="text-gray-700 text-center font-semibold text-xl">
                                    {sectionData.title}
                                  </h2>
                                )}

                                {sectionData.message && (
                                  <p className="text-gray-600 leading-6 text-medium text-center">
                                    {sectionData.message}
                                  </p>
                                )}

                                {sectionData.button_name && (
                                  <p className="pt-5 text-center">
                                    <a
                                      href={sectionData.button_link}
                                      className="inline-block bg-color-pallet-03 text-white px-5 py-3 no-underline rounded-md font-medium"
                                    >
                                      {sectionData.button_link
                                        ? sectionData.button_link
                                        : "Input button name"}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                    <div className="text-center p-3 text-sm text-gray-400">
                      <p>
                        You are receiving this email because you subscribed to
                        our newsletter.
                      </p>
                      <p>
                        If you no longer wish to receive these emails, you can{" "}
                        <a className="text-blue-500 no-underline">
                          unsubscribe here
                        </a>
                        .
                      </p>
                      <p>
                        &copy; {new Date().getFullYear()} DoDo ir SeSe. All
                        rights reserved.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsActiveDeleteModal(newsLetter.id)}
                    className="bg-red-500 flex self-center py-2 px-6 mt-4 mb-6 hover:bg-red-700 shadow-md text-text-color-dark-green font-semibold text-xl rounded"
                  >
                    Delete
                  </button>
                </div>
                <DeleteModal
                  currentId={isActiveDeleteModal}
                  elementId={newsLetter.id}
                  message={"NewsLetter"}
                  name={newsLetter.subject}
                  handleDelete={handleDeleteNewsLetter}
                  setDeleteModal={setIsActiveDeleteModal}
                />
              </div>
            ))
        ) : (
          <div className="text-2xl text-center font-bold text-text-color-dark-green p-6">
            No NewsLetters yet.
          </div>
        )}
      </div>
    </>
  );
}
