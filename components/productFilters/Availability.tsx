"use client";

import DropDownMenu from "../DropDownMenuOption";
import { DropDownMenuOption } from "../DropDownMenuOption";

type AvailabilityFilterProps = {
  availableFilter: () => void;
  unAvailableFilter: () => void;
};

export default function AvailabilityFilter({
  availableFilter,
  unAvailableFilter,
}: AvailabilityFilterProps) {
  return (
    <DropDownMenu name="Availability">
      <DropDownMenuOption
        name="In stock"
        absolute={false}
        isInput={true}
        onClick={availableFilter}
      ></DropDownMenuOption>
      <DropDownMenuOption
        name="Out of stock"
        absolute={false}
        isInput={true}
        onClick={unAvailableFilter}
      ></DropDownMenuOption>
    </DropDownMenu>
  );
}
