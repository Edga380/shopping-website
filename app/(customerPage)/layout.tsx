import NavBar from "../../components/customer/NavBar";
import Footer from "../../components/customer/Footer";
import { SearchProvider } from "../../context/SearchContext";
import { UserProvider } from "../../context/UserContext";

export default function CustomerPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SearchProvider>
        <UserProvider>
          <NavBar />
          <div className="max-w-[1800px] flex flex-col m-auto mt-14">
            {children}
          </div>
          <Footer />
        </UserProvider>
      </SearchProvider>
    </div>
  );
}
