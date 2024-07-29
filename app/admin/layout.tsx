import { AdminNav, AdminNavLink } from "../../components/admin/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center">
      <AdminNav>
        <AdminNavLink href="/admin">Dashboard</AdminNavLink>
        <AdminNavLink href="/admin/products">Products</AdminNavLink>
        <AdminNavLink href="/admin/users">Customers</AdminNavLink>
        <AdminNavLink href="/admin/orders">Sales</AdminNavLink>
        <AdminNavLink href="/admin/slideshow">Slideshow</AdminNavLink>
      </AdminNav>
      <div className="w-4/5">{children}</div>
    </div>
  );
}
