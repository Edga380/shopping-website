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
          products.filter((product) => product.isAvailable === "true").length
        }
        filteredAmount={
          storedProducts.filter((product) => product.isAvailable === "true")
            .length
        }
      ></DropDownMenuOption>
      <DropDownMenuOption
        name="Out of stock"
        absolute={false}
        isInput={true}
        onClick={unAvailableFilter}
        totalAmount={
          products.filter((product) => product.isAvailable === "false").length
        }
        filteredAmount={
          storedProducts.filter((product) => product.isAvailable === "false")
            .length
        }
      ></DropDownMenuOption>
    </DropDownMenu>
  );
}
