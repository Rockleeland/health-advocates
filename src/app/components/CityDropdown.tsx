"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { MapPin } from "lucide-react";
import { Advocate } from "@/app/types";

interface CityDropdownProps {
  allCities: string[];
  selectedCities: string[];
  onCityChange: (values: string[]) => void;
}

export function CityDropdown({
  allCities,
  selectedCities,
  onCityChange,
}: CityDropdownProps) {
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!allCities || allCities.length === 0) {
      setCityOptions([]);
      return;
    }
    setCityOptions(
      allCities.map((city) => ({
        label: city,
        value: city,
      }))
    );
  }, [allCities]);

  const handleCityChange = (values: string[]) => {
    onCityChange(values);
  };

  return (
    <Multiselect
      options={cityOptions}
      selectedValues={selectedCities}
      onChange={handleCityChange}
      title="City"
      titleIcon={<MapPin className="w-4 h-4" />}
    />
  );
}
