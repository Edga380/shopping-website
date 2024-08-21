"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchProducts from "./SearchProducts";
import { UpdatedProduct } from "../../types/databaseTypes";
import { getAvailableProducts } from "../../database/models/product/getAvailableProducts";
import { useSearch } from "./SearchContext";

export default function NavBar() {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [products, setProducts] = useState<UpdatedProduct[]>([]);
  const { searchInput, setSearchInput } = useSearch();

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < lastScrollY || window.scrollY < 50) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleClearSearchInput = () => {
    setSearchInput(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    const fetchAvailableProductsData = async () => {
      const productsData = await getAvailableProducts();
      if (!productsData) return;
      setProducts(productsData);
    };
    if (products.length === 0) {
      fetchAvailableProductsData();
    }
  }, [searchBarVisible]);

  return (
    <>
      <nav
        className="bg-color-pallet-02 fixed top-0 left-0 right-0 flex justify-between items-center h-16 transition-transform duration-300 z-30"
        style={{
          transform: showNav ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <Link href={"/"}>
          <Image
            src="/dodo_ir_sese_sm_text_logo.svg"
            width={100}
            height={60}
            alt="Brand logo"
            className="transition-transform duration-300 transform hover:scale-110 mx-6"
          ></Image>
        </Link>
        <div className="justify-center">
          <Link
            href={"/"}
            className={`text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04 ${
              pathname === "/" && "underline"
            }`}
          >
            Home
          </Link>
          <Link
            href={"/products"}
            className={`text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04 ${
              pathname === "/products" && "underline"
            }`}
          >
            Products
          </Link>
        </div>
        <div className="flex justify-center">
          <button onClick={toggleSearchBar}>
            <Image
              src="/search_img.svg"
              width={30}
              height={30}
              alt="Search icon"
              className="mr-5 transition-transform duration-300 transform hover:scale-110"
            />
          </button>
          <Link className="mr-5" href={"/"}>
            <Image
              src="/user_img.svg"
              width={30}
              height={30}
              alt="User profile icon"
              className="transition-transform duration-300 transform hover:scale-110"
            ></Image>
          </Link>
          <Link className="mr-5" href={"/"}>
            <Image
              src="/cart_img.svg"
              width={30}
              height={30}
              alt="Cart icon"
              className="transition-transform duration-300 transform hover:scale-110"
            ></Image>
          </Link>
        </div>
      </nav>
      <div
        className={`fixed h-full w-full bg-[rgba(0,0,0,0.6)] z-20 transition-opacity duration-300
        ${searchBarVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <SearchProducts
          products={products}
          searchInput={searchInput}
          toggleSearchBar={toggleSearchBar}
          handleClearSearchInput={handleClearSearchInput}
        />
      </div>
      <div
        className={`bg-color-pallet-02 fixed top-0 left-0 right-0 h-20 flex items-center justify-center z-30 transition-transform duration-300
            ${
              searchBarVisible
                ? "transform translate-y-0"
                : "transform -translate-y-full"
            }`}
      >
        <button onClick={toggleSearchBar}>
          <div className="h-8 w-8 mr-3 relative transition-transform duration-300 transform hover:scale-110">
            <div className="absolute h-8 w-[0.1rem] bg-text-color-dark-green rounded rotate-45 left-4"></div>
            <div className="absolute h-8 w-[0.1rem] bg-text-color-dark-green rounded -rotate-45 left-4"></div>
          </div>
        </button>
        <input
          type="text"
          className="w-1/3 h-10 p-2 rounded border border-text-color-dark-green"
          placeholder="Search..."
          value={searchInput ? searchInput : ""}
          onChange={handleSearchInput}
        />
        <Link href={"/products"} onClick={toggleSearchBar}>
          <Image
            src="/search_img.svg"
            width={30}
            height={30}
            alt="Search icon"
            className="ml-3 transition-transform duration-300 transform hover:scale-110"
          />
        </Link>
      </div>
    </>
  );
}
