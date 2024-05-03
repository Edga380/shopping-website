import { AdminNav, AdminNavLink } from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNav>
        <AdminNavLink href="/admin">Dashboard</AdminNavLink>
        <AdminNavLink href="/admin/products">Products</AdminNavLink>
        <AdminNavLink href="/admin/users">Customers</AdminNavLink>
        <AdminNavLink href="/admin/orders">Sales</AdminNavLink>
      </AdminNav>
      <div className="w-4/5">{children}</div>
    </>
  );
}
