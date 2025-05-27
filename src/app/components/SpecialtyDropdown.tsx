"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { Tags } from "lucide-react";
import { Advocate } from "@/app/types";

interface SpecialtyDropdownProps {
  allSpecialties: string[];
  selectedSpecialties: string[];
  onSpecialtyChange: (values: string[]) => void;
}

export function SpecialtyDropdown({
  allSpecialties,
  selectedSpecialties,
  onSpecialtyChange,
}: SpecialtyDropdownProps) {
  const [specialtyOptions, setSpecialtyOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!allSpecialties || allSpecialties.length === 0) {
      setSpecialtyOptions([]);
      return;
    }
    setSpecialtyOptions(
      allSpecialties.map((specialty) => ({
        label: specialty,
        value: specialty,
      }))
    );
  }, [allSpecialties]);

  const handleSpecialtyChange = (values: string[]) => {
    onSpecialtyChange(values);
  };

  return (
    <Multiselect
      options={specialtyOptions}
      selectedValues={selectedSpecialties}
      onChange={handleSpecialtyChange}
      title="Specialties"
      titleIcon={<Tags className="w-4 h-4" />}
    />
  );
}
