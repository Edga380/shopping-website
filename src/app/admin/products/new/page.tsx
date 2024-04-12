import { PageHeader } from "../../_components/PageHeader";
import AdminProductFrom from "../_components/ProductForm";

export default function AdminNewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <AdminProductFrom></AdminProductFrom>
    </>
  );
}
