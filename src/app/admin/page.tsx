import { usersDb, productsDb } from "../../../database/db";

function getUserData() {}

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle="Description"
        body="Text"
      ></DashboardCard>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <div className="bg-color-pallet-02 text-text-color-dark-green rounded-lg border-2 border-color-pallet-03">
      <div className="p-2">{title}</div>
      <div className="border-t-2 border-color-pallet-03 p-2">{subtitle}</div>
      <div className="border-t-2 border-color-pallet-03 p-2">
        <p>{body}</p>
      </div>
    </div>
  );
}
