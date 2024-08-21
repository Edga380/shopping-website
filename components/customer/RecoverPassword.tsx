"use client";

type RecoverPasswordProps = {
  handleRecoverIsActive: () => void;
};

export default function RecoverPassword({
  handleRecoverIsActive,
}: RecoverPasswordProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
        Recover password
      </div>
      <form action="" className="flex flex-col justify-center items-center">
        <input
          type="email"
          placeholder="Email"
          className="w-96 h-10 mt-4 p-2 rounded-md"
        ></input>
        <button
          type="submit"
          className="bg-color-pallet-03 py-2 px-6 mt-8 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Submit
        </button>
      </form>
      <button
        onClick={handleRecoverIsActive}
        className="bg-color-pallet-03 py-2 px-6 mt-4 mb-32 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
      >
        Cancel
      </button>
    </div>
  );
}
