import NavBar from "@/components/NavBar";
import { NavLink, NavLinkLogo, NavLinkImageButton } from "@/components/NavBar";

export default function CustomerPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
      <div className="w-4/5">{children}</div>
    </>
  );
}
