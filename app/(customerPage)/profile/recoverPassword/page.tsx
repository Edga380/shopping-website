import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
          Recover password
        </div>
        <div className="text-text-color-dark-green font-semibold text-medium mt-2">
          Input your email:
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
        <Link
          href={"/profile/login"}
          className="bg-color-pallet-03 py-2 px-6 mt-4 mb-32 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
