"use client";

import { useState, useEffect } from "react";
import { Multiselect, Option } from "./ui/multiselect";
import { InferSelectModel } from "drizzle-orm";
import { advocates } from "@/db/schema";
import { Book } from "lucide-react";
import { Advocate } from "@/app/types";

interface DegreeDropdownProps {
  advocates: Advocate[];
  selectedDegrees: string[];
  onDegreeChange: (values: string[]) => void;
}

export function DegreeDropdown({
  advocates,
  selectedDegrees,
  onDegreeChange,
}: DegreeDropdownProps) {
  const [degreeOptions, setDegreeOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!advocates || advocates.length === 0) {
      setDegreeOptions([]);
      return;
    }
    const uniqueDegrees = Array.from(
      new Set(advocates.map((advocate) => advocate.degree))
    ) as string[];
    setDegreeOptions(
      uniqueDegrees.map((degree) => ({
        label: degree,
        value: degree,
      }))
    );
  }, [advocates]);

  const handleDegreeChange = (values: string[]) => {
    onDegreeChange(values);
  };

  return (
    <Multiselect
      options={degreeOptions}
      selectedValues={selectedDegrees}
      onChange={handleDegreeChange}
      title="Degree"
      titleIcon={<Book className="w-4 h-4" />}
    />
  );
}
