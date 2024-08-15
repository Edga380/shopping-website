"use client";

import ProductCard from "./ProductCard";
import { UpdatedProduct } from "../../types/databaseTypes";
import DropDownMenu from "../DropDownMenuOption";
import { DropDownMenuOption } from "../DropDownMenuOption";
import { useEffect, useState, useMemo } from "react";
import PriceSlider from "./PriceSlider";
import AvailabilityFilter from "../productFilters/Availability";
import { useSearch } from "./SearchContext";

type DisplayProductsProps = {
  products: UpdatedProduct[];
};

export default function DisplayProducts({ products }: DisplayProductsProps) {
  const { searchInput, setSearchInput } = useSearch();
  const [storedProducts, setStoredProducts] =
    useState<UpdatedProduct[]>(products);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterByCategories, setFilterByCategories] = useState<string[] | null>(
    null
  );
  const [genders, setGenders] = useState<string[]>([]);
  const [filterByGenders, setFilterByGenders] = useState<string[] | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [filterByColors, setFilterByColors] = useState<string[] | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [filterBySizes, setFilterBySizes] = useState<string[] | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<{
    available: boolean;
    unAvailable: boolean;
  }>({
    available: true,
    unAvailable: true,
  });
  const [sortByPrice, setSortByPrice] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [maxPrice, setMaxPrice] = useState<number>(200);

  useEffect(() => {
    if (products) {
      const prices = products.map((product) => product.priceInPennies / 100);
      const storeMaxPrice = Math.max(...prices);
      const maxPrice = storeMaxPrice + 5;
      setMaxPrice(maxPrice);
      setPriceRange([0, maxPrice]);

      const uniqueCategories = products.reduce<string[]>(
        (categories, product) => {
          const normalizedCategory = product.category.toLowerCase();
          if (
            !categories.some(
              (category) => category.toLowerCase() === normalizedCategory
            )
          ) {
            categories.push(
              normalizedCategory.charAt(0).toLocaleUpperCase() +
                normalizedCategory.slice(1)
            );
          }
          const sortedAlphabeticalOrder = categories.sort();
          return sortedAlphabeticalOrder;
        },
        []
      );
      setCategories(uniqueCategories);

      const uniqueGenders = products.reduce<string[]>((genders, product) => {
        const normalizedGender = product.gender.toLowerCase();
        if (
          !genders.some((gender) => gender.toLowerCase() === normalizedGender)
        ) {
          genders.push(
            normalizedGender.charAt(0).toLocaleUpperCase() +
              normalizedGender.slice(1)
          );
        }
        return genders;
      }, []);
      setGenders(uniqueGenders);

      const uniqueColors = products.reduce<string[]>((colors, product) => {
        product.colors.forEach((productColor) => {
          const normalizedColor = productColor.toLowerCase();
          if (
            !colors.some((color) => color.toLowerCase() === normalizedColor)
          ) {
            colors.push(
              normalizedColor.charAt(0).toLocaleUpperCase() +
                normalizedColor.slice(1)
            );
          }
        });
        return colors;
      }, []);
      setColors(uniqueColors);

      const uniqueSizes = products.reduce<string[]>((sizes, product) => {
        product.sizes.forEach((productSize) => {
          const normalizedSize = productSize.toLowerCase();
          if (!sizes.some((size) => size.toLowerCase() === normalizedSize)) {
            sizes.push(normalizedSize.toUpperCase());
          }
        });
        return sizes;
      }, []);
      setSizes(uniqueSizes);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchInput) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (availabilityFilter.available && !availabilityFilter.unAvailable) {
      result = result.filter((product) => product.stock === 0);
    } else if (
      !availabilityFilter.available &&
      availabilityFilter.unAvailable
    ) {
      result = result.filter((product) => product.stock > 0);
    }

    result = result.filter(
      (product) =>
        product.priceInPennies / 100 >= priceRange[0] &&
        product.priceInPennies / 100 <= priceRange[1]
    );

    if (filterByCategories) {
      result = result.filter((product) => {
        return filterByCategories.some((filterByCategory) => {
          if (filterByCategory === product.category) {
            return true;
          }
          return false;
        });
      });
    }

    if (filterByGenders) {
      result = result.filter((product) => {
        return filterByGenders.some((filterByGender) => {
          const normalizedProductGender = product.gender.toLowerCase();
          if (filterByGender === normalizedProductGender) {
            return true;
          }
          return false;
        });
      });
    }

    if (filterByColors) {
      result = result.filter((product) => {
        return filterByColors.some((filterByColor) => {
          const normalizedProductColor = product.colors.map((color) =>
            color.toLowerCase()
          );
          if (normalizedProductColor.includes(filterByColor)) {
            return true;
          }
          return false;
        });
      });
    }

    if (filterBySizes) {
      result = result.filter((product) => {
        return filterBySizes.some((filterBySize) => {
          const normalizedProductSize = product.sizes.map((size) =>
            size.toLowerCase()
          );
          if (normalizedProductSize.includes(filterBySize)) {
            return true;
          }
          return false;
        });
      });
    }

    if (sortByPrice) {
      result = result.sort((a, b) =>
        sortByPrice === "lowHigh"
          ? a.priceInPennies - b.priceInPennies
          : b.priceInPennies - a.priceInPennies
      );
    }

    return result;
  }, [
    products,
    searchInput,
    availabilityFilter,
    priceRange,
    sortByPrice,
    filterByCategories,
    filterByGenders,
    filterByColors,
    filterBySizes,
  ]);

  useEffect(() => {
    setLoading(true);
    setStoredProducts(filteredProducts);
    setLoading(false);
  }, [filteredProducts]);

  const handleAvailabilityFilterChange = (
    filter: keyof typeof availabilityFilter
  ) => {
    setAvailabilityFilter((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleSortByPrice = (sortBy: string) => {
    setSortByPrice(sortBy);
  };

  const handleFilterByCategory = (filterBy: string) => {
    setFilterByCategories((prevCategories) => {
      const normalizedFilterBy = filterBy.toLowerCase();
      if (prevCategories) {
        if (prevCategories.includes(normalizedFilterBy)) {
          const updatedCategories = prevCategories.filter(
            (category) => category !== normalizedFilterBy
          );
          return updatedCategories.length > 0 ? updatedCategories : null;
        } else {
          return [...prevCategories, normalizedFilterBy];
        }
      } else {
        return [normalizedFilterBy];
      }
    });
  };

  const handleFilterByGender = (filterBy: string) => {
    setFilterByGenders((prevGender) => {
      const normalizedFilterBy = filterBy.toLowerCase();
      if (prevGender) {
        if (prevGender.includes(normalizedFilterBy)) {
          const updatedGenders = prevGender.filter(
            (gender) => gender !== normalizedFilterBy
          );
          return updatedGenders.length > 0 ? updatedGenders : null;
        } else {
          return [...prevGender, normalizedFilterBy];
        }
      } else {
        return [normalizedFilterBy];
      }
    });
  };

  const handleFilterByColor = (filterBy: string) => {
    setFilterByColors((prevColor) => {
      const normalizedFilterBy = filterBy.toLowerCase();
      if (prevColor) {
        if (prevColor.includes(normalizedFilterBy)) {
          const updatedColors = prevColor.filter(
            (color) => color !== normalizedFilterBy
          );
          return updatedColors.length > 0 ? updatedColors : null;
        } else {
          return [...prevColor, normalizedFilterBy];
        }
      } else {
        return [normalizedFilterBy];
      }
    });
  };

  const handleFilterBySize = (filterBy: string) => {
    setFilterBySizes((prevSize) => {
      const normalizedFilterBy = filterBy.toLowerCase();
      if (prevSize) {
        if (prevSize.includes(normalizedFilterBy)) {
          const updatedSizes = prevSize.filter(
            (size) => size !== normalizedFilterBy
          );
          return updatedSizes.length > 0 ? updatedSizes : null;
        } else {
          return [...prevSize, normalizedFilterBy];
        }
      } else {
        return [normalizedFilterBy];
      }
    });
  };

  const handleClearSearchInput = () => {
    setSearchInput(null);
  };

  return (
    <div className="flex my-10">
      <div className="bg-color-pallet-01 w-[600px] rounded-s-large p-4">
        <h2 className="text-3xl text-text-color-dark-green py-2">Filters:</h2>
        <AvailabilityFilter
          availableFilter={() => handleAvailabilityFilterChange("available")}
          unAvailableFilter={() =>
            handleAvailabilityFilterChange("unAvailable")
          }
          products={products}
          storedProducts={storedProducts}
        />
        <DropDownMenu name="Price">
          <PriceSlider
            value={priceRange}
            onChange={handlePriceChange}
            maxPrice={maxPrice}
          />
        </DropDownMenu>
        <DropDownMenu name="Category">
          {categories.map((category) => (
            <DropDownMenuOption
              key={category}
              name={category}
              absolute={false}
              isInput={true}
              totalAmount={
                products.filter(
                  (product) => product.category === category.toLocaleLowerCase()
                ).length
              }
              filteredAmount={
                storedProducts.filter(
                  (product) => product.category === category.toLocaleLowerCase()
                ).length
              }
              onClick={() => handleFilterByCategory(category)}
            />
          ))}
        </DropDownMenu>
        <DropDownMenu name="Gender">
          {genders.map((gender) => (
            <DropDownMenuOption
              key={gender}
              name={gender}
              absolute={false}
              isInput={true}
              totalAmount={
                products.filter(
                  (product) => product.gender === gender.toLowerCase()
                ).length
              }
              filteredAmount={
                storedProducts.filter(
                  (product) => product.gender === gender.toLowerCase()
                ).length
              }
              onClick={() => handleFilterByGender(gender)}
            />
          ))}
        </DropDownMenu>
        <DropDownMenu name="Color">
          {colors.map((color) => (
            <DropDownMenuOption
              key={color}
              name={color}
              absolute={false}
              isInput={true}
              iscolor={true}
              totalAmount={
                products.filter((product) =>
                  product.colors.some((productColor) => productColor === color)
                ).length
              }
              filteredAmount={
                storedProducts.filter((product) =>
                  product.colors.some((productColor) => productColor === color)
                ).length
              }
              onClick={() => handleFilterByColor(color)}
            />
          ))}
        </DropDownMenu>
        <DropDownMenu name="Size">
          {sizes.map((size) => (
            <DropDownMenuOption
              key={size}
              name={size}
              absolute={false}
              isInput={true}
              totalAmount={
                products.filter((product) =>
                  product.sizes.some((productSize) => productSize === size)
                ).length
              }
              filteredAmount={
                storedProducts.filter((product) =>
                  product.sizes.some((productSize) => productSize === size)
                ).length
              }
              onClick={() => handleFilterBySize(size)}
            />
          ))}
        </DropDownMenu>
      </div>
      <div className="bg-color-pallet-04 w-[100%] rounded-large">
        <div className="flex flex-row p-2">
          {searchInput && (
            <div className="mx-2 text-text-color-dark-green font-bold">
              <button onClick={handleClearSearchInput}>
                <div className="h-4 w-4 mr-3 relative transition-transform duration-300 transform hover:scale-110">
                  <div className="absolute h-4 w-[0.1rem] bg-text-color-dark-green rounded rotate-45 left-4"></div>
                  <div className="absolute h-4 w-[0.1rem] bg-text-color-dark-green rounded -rotate-45 left-4"></div>
                </div>
              </button>
              Search: {searchInput}
            </div>
          )}
          <div className="flex flex-row ml-auto">
            <div className="mx-2 text-text-color-dark-green font-bold">
              <DropDownMenu name="Sort">
                <div className="absolute z-10">
                  <DropDownMenuOption
                    name="Price low/high"
                    absolute={false}
                    isInput={false}
                    onClick={() => handleSortByPrice("lowHigh")}
                  ></DropDownMenuOption>
                  <DropDownMenuOption
                    name="Price high/low"
                    absolute={false}
                    isInput={false}
                    onClick={() => handleSortByPrice("highLow")}
                  ></DropDownMenuOption>
                </div>
              </DropDownMenu>
            </div>
            <div className="mx-2 text-text-color-dark-green font-bold">
              Products: {storedProducts.length}
            </div>
          </div>
        </div>
        {storedProducts.length > 0 && !loading ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-3">
            {storedProducts.map((product, index) => (
              <ProductCard
                key={product.name + index}
                product={product}
              ></ProductCard>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-44 text-2xl text-text-color-dark-green font-semibold">
            {loading
              ? "Loading..."
              : "No products found. Try changing filters."}
          </div>
        )}
      </div>
    </div>
  );
}
