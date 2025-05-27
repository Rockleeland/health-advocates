"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { InferSelectModel } from "drizzle-orm";
import { advocates } from "@/db/schema";
import { MapPin } from "lucide-react";

type Advocate = InferSelectModel<typeof advocates> & {
  city: string;
  specialties: string[];
  degree: string;
  yearsOfExperience: number;
  phoneNumber: string;
};

interface CityDropdownProps {
  advocates: Advocate[];
  selectedCities: string[];
  onCityChange: (values: string[]) => void;
}

export function CityDropdown({
  advocates,
  selectedCities,
  onCityChange,
}: CityDropdownProps) {
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!advocates || advocates.length === 0) {
      setCityOptions([]);
      return;
    }
    const uniqueCities = Array.from(
      new Set(advocates.map((advocate) => advocate.city))
    ) as string[];
    setCityOptions(
      uniqueCities.map((city) => ({
        label: city,
        value: city,
      }))
    );
  }, [advocates]);

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
