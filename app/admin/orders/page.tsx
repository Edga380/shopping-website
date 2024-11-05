import DisplayOrders from "../../../components/admin/orders/DisplayOrders";
import { PageHeader } from "../../../components/admin/PageHeader";

export default async function Orders() {
  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Orders</PageHeader>
      </div>
      <div className="p-2 mb-28">
        <DisplayOrders />
      </div>
    </>
  );
}
