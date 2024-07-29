import NavBar from "../../components/customer/NavBar";
import {
  NavLink,
  NavLinkLogo,
  NavLinkImageButton,
} from "../../components/customer/NavBar";
import Footer from "../../components/customer/Footer";

export default function CustomerPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar>
        <NavLinkLogo href={"/"}></NavLinkLogo>
        <div className="justify-center">
          <NavLink href={"/"}>Home</NavLink>
          <NavLink href={"/products"}>Products</NavLink>
        </div>
        <div className="justify-center flex">
          <NavLinkImageButton
            href={"/"}
            imagePath="/search_img.svg"
            width={30}
            height={30}
            alt="Search icon"
          ></NavLinkImageButton>
          <NavLinkImageButton
            href={"/"}
            imagePath="/user_img.svg"
            width={30}
            height={30}
            alt="User profile icon"
          ></NavLinkImageButton>
          <NavLinkImageButton
            href={"/"}
            imagePath="/cart_img.svg"
            width={30}
            height={30}
            alt="Cart icon"
          ></NavLinkImageButton>
        </div>
      </NavBar>
      <div className="max-w-[1800px] flex flex-col m-auto">{children}</div>
      <Footer></Footer>
    </div>
  );
}
