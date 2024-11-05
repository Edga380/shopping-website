"use client";

import DropDownMenu from "../DropDownMenuOption";
import { DropDownMenuOption } from "../DropDownMenuOption";
import { UpdatedProduct } from "../../types/databaseTypes";

type AvailabilityFilterProps = {
  availableFilter: () => void;
  unAvailableFilter: () => void;
  products: UpdatedProduct[];
  storedProducts: UpdatedProduct[];
};

export default function AvailabilityFilter({
  availableFilter,
  unAvailableFilter,
  products,
  storedProducts,
}: AvailabilityFilterProps) {
  return (
    <DropDownMenu name="Availability">
      <DropDownMenuOption
        name="In stock"
        absolute={false}
        isInput={true}
        onClick={availableFilter}
        totalAmount={
          products.reduce<string[]>((stock, product) => {
            product.product_variations.forEach((product_variation) => {
              if (
                product_variation.product_size_inventory.every(
                  (product_size_inventory_data) =>
                    Number(product_size_inventory_data.stock) > 0
                )
              ) {
                stock.push(product_variation.color);
              }
            });
            return stock;
          }, []).length
        }
        filteredAmount={
          storedProducts.reduce<string[]>((stock, storedProduct) => {
            storedProduct.product_variations.forEach((product_variation) => {
              if (
                product_variation.product_size_inventory.every(
                  (product_size_inventory_data) =>
                    Number(product_size_inventory_data.stock) > 0
                )
              ) {
                stock.push(product_variation.color);
              }
            });
            return stock;
          }, []).length
        }
      ></DropDownMenuOption>
      <DropDownMenuOption
        name="Out of stock"
        absolute={false}
        isInput={true}
        onClick={unAvailableFilter}
        totalAmount={
          products.reduce<string[]>((stock, product) => {
            product.product_variations.forEach((product_variation) => {
              if (
                product_variation.product_size_inventory.some(
                  (product_size_inventory_data) =>
                    Number(product_size_inventory_data.stock) === 0
                )
              ) {
                stock.push(product_variation.color);
              }
            });
            return stock;
          }, []).length
        }
        filteredAmount={
          storedProducts.reduce<string[]>((stock, storedProduct) => {
            storedProduct.product_variations.forEach((product_variation) => {
              if (
                product_variation.product_size_inventory.some(
                  (product_size_inventory_data) =>
                    Number(product_size_inventory_data.stock) === 0
                )
              ) {
                stock.push(product_variation.color);
              }
            });
            return stock;
          }, []).length
        }
      ></DropDownMenuOption>
    </DropDownMenu>
  );
}
