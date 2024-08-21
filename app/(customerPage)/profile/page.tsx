import Login from "../../../components/customer/Login";

export default function Profile() {
  const user = "user";

  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl">
      {!user ? (
        <div className="flex">
          <div>navigation</div>
          <div>Information</div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
