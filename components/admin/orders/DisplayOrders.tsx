"use client";

export default function DisplayOrders() {
  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
        <div>Total: 0</div>
        <div>Number</div>
        <div>User</div>
        <div>Date</div>
      </div>
      <div className="relative grid grid-cols-[1fr_2fr_2fr_1fr] items-center mt-4 px-2 py-1 bg-color-pallet-02 text-text-color-dark-green shadow-md">
        <div>No orders</div>
        <div>No orders</div>
        <div>No orders</div>
        <div>No orders</div>
      </div>
    </>
  );
}
