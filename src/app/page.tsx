"use client";

import { useEffect, useState } from "react";
import { Table } from "./components/ui/table";
import { SearchInput } from "./components/ui/search-input";
import { SpecialtyDropdown } from "./components/SpecialtyDropdown";
import { CityDropdown } from "./components/CityDropdown";
import { DegreeDropdown } from "./components/DegreeDropdown";
import { Advocate, SortConfig } from "./types";
import { TABLE_HEADERS, HEADER_TO_PROPERTY_MAP } from "./constants";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: "asc",
  });

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const filtered = advocates.filter((advocate) => {
      const matchesSearch =
        searchTerm === "" ||
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some((s: string) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        String(advocate.yearsOfExperience).includes(searchTerm);

      const matchesSpecialties =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.every((specialty) =>
          advocate.specialties.includes(specialty)
        );

      const matchesCities =
        selectedCities.length === 0 ||
        selectedCities.every((city) => advocate.city === city);

      const matchesDegrees =
        selectedDegrees.length === 0 ||
        selectedDegrees.every((degree) => advocate.degree === degree);

      return (
        matchesSearch && matchesSpecialties && matchesCities && matchesDegrees
      );
    });

    if (sortConfig.column) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[sortConfig.column as keyof Advocate] as
          | string
          | number;
        let bValue: string | number = b[sortConfig.column as keyof Advocate] as
          | string
          | number;

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredAdvocates(filtered);
  }, [
    advocates,
    searchTerm,
    selectedSpecialties,
    selectedCities,
    selectedDegrees,
    sortConfig,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSpecialtyChange = (values: string[]) => {
    setSelectedSpecialties(values);
  };

  const handleCityChange = (values: string[]) => {
    setSelectedCities(values);
  };

  const handleDegreeChange = (values: string[]) => {
    setSelectedDegrees(values);
  };

  const handleSort = (column: keyof Advocate) => {
    setSortConfig((currentSort) => ({
      column,
      direction:
        currentSort.column === column && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedCities([]);
    setSelectedDegrees([]);
    setSortConfig({ column: null, direction: "asc" });
  };

  const tableHeaders = TABLE_HEADERS.map((header) => {
    const columnKey = HEADER_TO_PROPERTY_MAP[header];
    const isSortable = columnKey !== undefined;

    return {
      label: header,
      onClick: isSortable ? () => handleSort(columnKey) : undefined,
      sortDirection:
        isSortable && sortConfig.column === columnKey
          ? sortConfig.direction
          : null,
    };
  });

  const isFilteringActive =
    searchTerm ||
    selectedSpecialties.length > 0 ||
    selectedCities.length > 0 ||
    selectedDegrees.length > 0 ||
    sortConfig.column !== null;

  return (
    <main className="mx-6 my-8">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>

      <div className="mb-8 space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search advocates..."
        />

        <div className="flex flex-wrap gap-3 mt-2">
          <SpecialtyDropdown
            advocates={advocates}
            selectedSpecialties={selectedSpecialties}
            onSpecialtyChange={handleSpecialtyChange}
          />
          <CityDropdown
            advocates={advocates}
            selectedCities={selectedCities}
            onCityChange={handleCityChange}
          />
          <DegreeDropdown
            advocates={advocates}
            selectedDegrees={selectedDegrees}
            onDegreeChange={handleDegreeChange}
          />
          {isFilteringActive && (
            <button
              onClick={resetAllFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      <Table headers={tableHeaders}>
        {filteredAdvocates.map((advocate) => (
          <tr key={advocate.id} className="border-b border-gray-200">
            <td className="px-4 py-3">{advocate.firstName}</td>
            <td className="px-4 py-3">{advocate.lastName}</td>
            <td className="px-4 py-3">{advocate.city}</td>
            <td className="px-4 py-3">{advocate.degree}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {advocate.specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-4 py-3">{advocate.yearsOfExperience}</td>
            <td className="px-4 py-3">{advocate.phoneNumber}</td>
          </tr>
        ))}
      </Table>
    </main>
  );
}
