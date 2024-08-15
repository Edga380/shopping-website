import NavBar from "../../components/customer/NavBar";
import Footer from "../../components/customer/Footer";
import { SearchProvider } from "../../components/customer/SearchContext";

export default function CustomerPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SearchProvider>
        <NavBar />
        <div className="max-w-[1800px] flex flex-col m-auto mt-14">
          {children}
        </div>
        <Footer />
      </SearchProvider>
    </div>
  );
}
