import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
          Login
        </div>
        <form action="" className="flex flex-col justify-center items-center">
          <input
            type="email"
            placeholder="Email"
            className="w-96 h-10 mt-4 p-2 rounded-md"
          ></input>
          <input
            type="password"
            placeholder="Password"
            className="w-96 h-10 mt-4 p-2 rounded-md"
          ></input>
          <Link
            href={"/profile/recoverPassword"}
            className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 self-start"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            className="bg-color-pallet-03 py-2 px-6 mt-8 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Sign in
          </button>
        </form>
        <Link
          href={"/profile/register"}
          className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 mb-32"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
