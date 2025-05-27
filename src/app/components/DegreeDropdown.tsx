"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { GraduationCap } from "lucide-react";
import { Advocate } from "@/app/types";

interface DegreeDropdownProps {
  allDegrees: string[];
  selectedDegrees: string[];
  onDegreeChange: (values: string[]) => void;
}

export function DegreeDropdown({
  allDegrees,
  selectedDegrees,
  onDegreeChange,
}: DegreeDropdownProps) {
  const [degreeOptions, setDegreeOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!allDegrees || allDegrees.length === 0) {
      setDegreeOptions([]);
      return;
    }
    setDegreeOptions(
      allDegrees.map((degree) => ({
        label: degree,
        value: degree,
      }))
    );
  }, [allDegrees]);

  const handleDegreeChange = (values: string[]) => {
    onDegreeChange(values);
  };

  return (
    <Multiselect
      options={degreeOptions}
      selectedValues={selectedDegrees}
      onChange={handleDegreeChange}
      title="Degree"
      titleIcon={<GraduationCap className="w-4 h-4" />}
    />
  );
}
