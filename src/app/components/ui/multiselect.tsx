"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, Tag, ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface MultiselectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  title?: string;
  titleIcon?: React.ReactNode;
}

const COLOR_PALETTE = [
  "#f87171", // red
  "#60a5fa", // blue
  "#a3a3a3", // gray
  "#fbbf24", // yellow
  "#34d399", // green
  "#f472b6", // pink
  "#818cf8", // indigo
];

export function Multiselect({
  options,
  selectedValues,
  onChange,
  title = "Tag",
  titleIcon,
}: MultiselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
    setSearchTerm("");
  };

  const clearAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSearchTerm("");
    onChange([]);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer transition select-none
          bg-green-900 hover:bg-green-800 text-white shadow-sm relative`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {titleIcon ? titleIcon : <Tag className="w-4 h-4" />}
        <span>{title}</span>
        {selectedValues.length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-green-900 text-xs font-bold border-2 border-green-900">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div
          className="absolute z-20 w-72 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-0 animate-fade-in"
          style={{ minWidth: 260 }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-medium text-base">{title}</span>
            <button
              onClick={clearAll}
              className="text-blue-600 text-sm hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="p-2 border-b">
            <input
              type="text"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Search ${title}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-4 text-gray-400 text-sm">
                No options found
              </div>
            )}
            {filteredOptions.map((option, idx) => (
              <div
                key={option.value}
                className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                  selectedValues.includes(option.value)
                    ? "bg-purple-50"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <span
                  className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                  style={{
                    background: COLOR_PALETTE[idx % COLOR_PALETTE.length],
                  }}
                />
                <span className="text-sm">{option.label}</span>
                {selectedValues.includes(option.value) && (
                  <Check className="ml-auto text-green-900 w-4 h-4 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
