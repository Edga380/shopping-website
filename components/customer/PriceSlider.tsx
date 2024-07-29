"use client";

import { Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";

type PriceSliderProps = {
  value: [number, number];
  onChange: (newRange: [number, number]) => void;
  maxPrice: number;
};

export default function PriceSlider({
  value,
  onChange,
  maxPrice,
}: PriceSliderProps) {
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 200]);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderValue([newValue[0], newValue[1]]);
      onChange([newValue[0], newValue[1]]);
    }
  };

  return (
    <div className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 px-6 py-2 rounded self-center flex">
      <Slider
        label="Price Range"
        step={5}
        maxValue={maxPrice}
        minValue={0}
        value={sliderValue}
        onChange={handleChange}
        showSteps={false}
        showTooltip={true}
        showOutline={false}
        disableThumbScale={true}
        formatOptions={{ style: "currency", currency: "GBP" }}
        tooltipValueFormatOptions={{
          style: "currency",
          currency: "GBP",
          maximumFractionDigits: 0,
        }}
        classNames={{
          base: "max-w-md",
          filler: "bg-color-pallet-04",
          labelWrapper: "mb-2",
          label: "font-large text-text-color-dark-green text-large",
          value: "font-large text-text-color-dark-green text-large",
          thumb: [
            "transition-size",
            "bg-color-pallet-04",
            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
          ],
        }}
        tooltipProps={{
          offset: 10,
          placement: "bottom",
          classNames: {
            base: ["before:bg-color-pallet-04"],
            content: [
              "py-2 shadow-xl",
              "text-text-color-dark-green bg-color-pallet-04",
            ],
          },
        }}
      />
    </div>
  );
}
