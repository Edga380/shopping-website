import { PageHeader } from "../../../components/admin/PageHeader";
import DisplayUsers from "../../../components/admin/users/DisplayUsers";
import getUsers from "../../../database/models/user/getUsers";

export default async function Users() {
  const fetchedUsersData = await getUsers();

  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Users</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayUsers usersData={fetchedUsersData} />
      </div>
    </>
  );
}
