"use client";

import ProductCard from "./ProductCard";
import { UpdatedProduct } from "../../types/databaseTypes";
import DropDownMenu from "../DropDownMenuOption";
import { DropDownMenuOption } from "../DropDownMenuOption";
import { useEffect, useState, useMemo } from "react";
import PriceSlider from "./PriceSlider";
import AvailabilityFilter from "../productFilters/Availability";
import { useSearch } from "../../context/SearchContext";

export default function DisplayProducts({
  products,
}: {
  products: UpdatedProduct[];
}) {
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
      const prices = products.map(
        (product) => product.base_price_in_pennies / 100
      );
      const storeMaxPrice = Math.max(...prices);
      const maxPrice = storeMaxPrice + 5;
      setMaxPrice(maxPrice);
      setPriceRange([0, maxPrice]);

      const uniqueCategories = products.reduce<string[]>(
        (categories, product) => {
          if (!categories.includes(product.category)) {
            categories.push(product.category);
          }
          return categories.sort();
        },
        []
      );
      setCategories(uniqueCategories);

      const uniqueGenders = products.reduce<string[]>((genders, product) => {
        if (!genders.includes(product.gender)) {
          genders.push(product.gender);
        }
        return genders;
      }, []);
      setGenders(uniqueGenders);

      const uniqueColors = products.reduce<string[]>((colors, product) => {
        product.product_variations.forEach((product_variation) => {
          if (!colors.includes(product_variation.color)) {
            colors.push(product_variation.color);
          }
        });
        return colors;
      }, []);
      setColors(uniqueColors);

      const uniqueSizes = products.reduce<string[]>((sizes, product) => {
        product.product_variations.forEach((product_variation) =>
          product_variation.product_size_inventory.forEach(
            (product_size_inventory_data) => {
              if (!sizes.includes(product_size_inventory_data.size)) {
                sizes.push(product_size_inventory_data.size);
              }
            }
          )
        );
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
      result = result.filter((product) =>
        product.product_variations.some((product_variation) =>
          product_variation.product_size_inventory.some(
            (product_size_inventory_data) =>
              Number(product_size_inventory_data.stock) === 0
          )
        )
      );
    } else if (
      !availabilityFilter.available &&
      availabilityFilter.unAvailable
    ) {
      result = result.filter((product) =>
        product.product_variations.some((product_variation) =>
          product_variation.product_size_inventory.some(
            (product_size_inventory_data) =>
              Number(product_size_inventory_data.stock) > 0
          )
        )
      );
    }

    result = result.filter(
      (product) =>
        product.base_price_in_pennies / 100 >= priceRange[0] &&
        product.base_price_in_pennies / 100 <= priceRange[1]
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
          const normalizedProductGender = product.gender;
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
          const normalizedProductColor = product.product_variations.map(
            (product_variations) => product_variations.color
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
          const normalizedProductSize = product.product_variations.flatMap(
            (product_variation) =>
              product_variation.product_size_inventory.flatMap(
                (product_size_inventory_data) =>
                  product_size_inventory_data.size
              )
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
          ? a.base_price_in_pennies - b.base_price_in_pennies
          : b.base_price_in_pennies - a.base_price_in_pennies
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
      if (prevCategories) {
        if (prevCategories.includes(filterBy)) {
          const updatedCategories = prevCategories.filter(
            (category) => category !== filterBy
          );
          return updatedCategories.length > 0 ? updatedCategories : null;
        } else {
          return [...prevCategories, filterBy];
        }
      } else {
        return [filterBy];
      }
    });
  };

  const handleFilterByGender = (filterBy: string) => {
    setFilterByGenders((prevGender) => {
      if (prevGender) {
        if (prevGender.includes(filterBy)) {
          const updatedGenders = prevGender.filter(
            (gender) => gender !== filterBy
          );
          return updatedGenders.length > 0 ? updatedGenders : null;
        } else {
          return [...prevGender, filterBy];
        }
      } else {
        return [filterBy];
      }
    });
  };

  const handleFilterByColor = (filterBy: string) => {
    setFilterByColors((prevColor) => {
      if (prevColor) {
        if (prevColor.includes(filterBy)) {
          const updatedColors = prevColor.filter((color) => color !== filterBy);
          return updatedColors.length > 0 ? updatedColors : null;
        } else {
          return [...prevColor, filterBy];
        }
      } else {
        return [filterBy];
      }
    });
  };

  const handleFilterBySize = (filterBy: string) => {
    setFilterBySizes((prevSize) => {
      if (prevSize) {
        if (prevSize.includes(filterBy)) {
          const updatedSizes = prevSize.filter((size) => size !== filterBy);
          return updatedSizes.length > 0 ? updatedSizes : null;
        } else {
          return [...prevSize, filterBy];
        }
      } else {
        return [filterBy];
      }
    });
  };

  const handleClearSearchInput = () => {
    setSearchInput(null);
  };

  return (
    <div className="flex my-10">
      <div className="bg-color-pallet-01 w-[24rem] rounded-s-large p-4">
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
                products.filter((product) => product.category === category)
                  .length
              }
              filteredAmount={
                storedProducts.filter(
                  (product) => product.category === category
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
                products.filter((product) => product.gender === gender).length
              }
              filteredAmount={
                storedProducts.filter((product) => product.gender === gender)
                  .length
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
                  product.product_variations.some(
                    (product_variation) => product_variation.color === color
                  )
                ).length
              }
              filteredAmount={
                storedProducts.filter((product) =>
                  product.product_variations.some(
                    (product_variation) => product_variation.color === color
                  )
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
                  product.product_variations.some((product_variation) =>
                    product_variation.product_size_inventory.some(
                      (product_size_inventory_data) =>
                        product_size_inventory_data.size === size
                    )
                  )
                ).length
              }
              filteredAmount={
                storedProducts.filter((product) =>
                  product.product_variations.some((product_variation) =>
                    product_variation.product_size_inventory.some(
                      (product_size_inventory_data) =>
                        product_size_inventory_data.size === size
                    )
                  )
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
            <div className="bg-color-pallet-01 mx-2 text-text-color-dark-green font-bold rounded p-2">
              <button onClick={handleClearSearchInput}>
                <div className="h-4 w-4 mr-3 relative transition-transform duration-300 transform hover:scale-110">
                  <div className="absolute h-4 w-[0.1rem] bg-text-color-dark-green rounded rotate-45 left-4"></div>
                  <div className="absolute h-4 w-[0.1rem] bg-text-color-dark-green rounded -rotate-45 left-4"></div>
                </div>
              </button>
              {searchInput}
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
