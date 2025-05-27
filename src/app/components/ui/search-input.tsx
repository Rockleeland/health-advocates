import * as React from "react";
import * as Label from "@radix-ui/react-label";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
}: SearchInputProps) {
  return (
    <div className="space-y-2">
      <Label.Root className="text-sm font-medium text-gray-700">
        {label}
      </Label.Root>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
