import { PageHeader } from "../../components/admin/PageHeader";
import getSubmissions from "../../database/models/contact/getSubmissions";
import getNewsLetters from "../../database/models/newsLetter/getNewsLetters";
import { getAllProducts } from "../../database/models/product/getAllProducts";
import getCategories from "../../database/models/product/getCategories";
import getColors from "../../database/models/product/getColors";
import getSizes from "../../database/models/product/getSizes";
import getNewsLetterEmails from "../../database/models/user/getNewsLetterEmails";
import getUsers from "../../database/models/user/getUsers";
import {
  ContactUsSubmissions,
  getNewsLetterSections,
  getProductCategories,
  getProductColors,
  getProductSizes,
  NewsLetterEmailsData,
  UpdatedProduct,
  UserData,
} from "../../types/databaseTypes";

export default async function AdminDashboard() {
  const fetchProducts = await getAllProducts();
  const fetchUsers = await getUsers();
  const fetchCategories = await getCategories();
  const fetchColors = await getColors();
  const fetchSizes = await getSizes();
  const fetchContactUs = await getSubmissions();
  const fetchNewsletters = await getNewsLetters();
  const fetchNewsletterEmails = await getNewsLetterEmails();

  return (
    <>
      <div className="flex bg-color-pallet-02 p-2">
        <PageHeader>Dashboard</PageHeader>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Orders"
          subtitle="Total"
          data={""}
        ></DashboardCard>
        <DashboardCard
          title="Users"
          subtitle="Total"
          data={fetchUsers}
        ></DashboardCard>
        <DashboardCard
          title="Contact us submittions"
          subtitle="Total"
          data={fetchContactUs}
        ></DashboardCard>
        <DashboardCard
          title="Newsletters subscribers"
          subtitle="Total"
          data={fetchNewsletterEmails}
        ></DashboardCard>
        <DashboardCard
          title="Sent Newsletters"
          subtitle="Total"
          data={fetchNewsletters}
        ></DashboardCard>
        <DashboardCard
          title="Products"
          subtitle="Total"
          data={fetchProducts}
        ></DashboardCard>
        <DashboardCard
          title="Categories"
          subtitle="Total"
          data={fetchCategories}
        ></DashboardCard>
        <DashboardCard
          title="Colors"
          subtitle="Total"
          data={fetchColors}
        ></DashboardCard>
        <DashboardCard
          title="Sizes"
          subtitle="Total"
          data={fetchSizes}
        ></DashboardCard>
      </div>
    </>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  data:
    | string
    | UpdatedProduct[]
    | UserData[]
    | getProductCategories[]
    | getProductColors[]
    | getProductSizes[]
    | ContactUsSubmissions[]
    | getNewsLetterSections[]
    | NewsLetterEmailsData[];
};

function DashboardCard({ title, subtitle, data }: DashboardCardProps) {
  return (
    <div className="flex flex-wrap justify-center text-text-color-dark-green">
      <div className="bg-color-pallet-02 shadow-md w-96 pb-6 mx-2 text-2xl text-center m-2">
        <div className="bg-color-pallet-03 p-2 font-bold">{title}</div>
        <div className="flex flex-col justify-center mt-6">
          <div>{subtitle}</div>
        </div>
        <div className="flex flex-col justify-center mt-6">
          <div>{data.length}</div>
        </div>
      </div>
    </div>
  );
}
