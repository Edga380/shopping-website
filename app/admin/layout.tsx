import {
  AdminNav,
  AdminNavLink,
  AdminNavSubLink,
} from "../../components/admin/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <AdminNav>
        <AdminNavLink name="Dashboard" href="/admin"></AdminNavLink>
        <AdminNavLink name="Products" href="/admin/products">
          <AdminNavSubLink href="/admin/products/addProduct">
            Add product
          </AdminNavSubLink>
          <AdminNavSubLink href="/admin/products/addCategory">
            Categories
          </AdminNavSubLink>
          <AdminNavSubLink href="/admin/products/addColor">
            Colors
          </AdminNavSubLink>
          <AdminNavSubLink href="/admin/products/addSize">
            Sizes
          </AdminNavSubLink>
        </AdminNavLink>
        <AdminNavLink name="Customers" href="/admin/users"></AdminNavLink>
        <AdminNavLink name="Sales" href="/admin/orders"></AdminNavLink>
        <AdminNavLink name="Slideshow" href="/admin/slideshow"></AdminNavLink>
        <AdminNavLink
          name="ContactUsSubmissions"
          href="/admin/contactUsSubmissions"
        ></AdminNavLink>
        <AdminNavLink name="NewsLetter" href="/admin/newsLetter"></AdminNavLink>
      </AdminNav>
      <div></div>
      <div>{children}</div>
    </div>
  );
}
