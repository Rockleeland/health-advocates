"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { InferSelectModel } from "drizzle-orm";
import { advocates } from "@/db/schema";
import { Tag } from "lucide-react";
import { Advocate } from "@/app/types";

interface SpecialtyDropdownProps {
  advocates: Advocate[];
  selectedSpecialties: string[];
  onSpecialtyChange: (values: string[]) => void;
}

export function SpecialtyDropdown({
  advocates,
  selectedSpecialties,
  onSpecialtyChange,
}: SpecialtyDropdownProps) {
  const [specialtyOptions, setSpecialtyOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!advocates || advocates.length === 0) {
      setSpecialtyOptions([]);
      return;
    }
    const uniqueSpecialties = Array.from(
      new Set(advocates.flatMap((advocate) => advocate.payload))
    ) as string[];
    setSpecialtyOptions(
      uniqueSpecialties.map((specialty) => ({
        label: specialty,
        value: specialty,
      }))
    );
  }, [advocates]);

  const handleSpecialtyChange = (values: string[]) => {
    onSpecialtyChange(values);
  };

  return (
    <Multiselect
      options={specialtyOptions}
      selectedValues={selectedSpecialties}
      onChange={handleSpecialtyChange}
      title="Specialties"
      titleIcon={<Tag className="w-4 h-4" />}
    />
  );
}
