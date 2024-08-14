import NavBar from "../../components/customer/NavBar";
import Footer from "../../components/customer/Footer";

export default function CustomerPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      <div className="max-w-[1800px] flex flex-col m-auto mt-14">
        {children}
      </div>
      <Footer />
    </div>
  );
}
