"use client";

import { useEffect, useState } from "react";
import { Table } from "./components/ui/table";
import { SearchInput } from "./components/ui/search-input";
import { SpecialtyDropdown } from "./components/SpecialtyDropdown";
import { CityDropdown } from "./components/CityDropdown";
import { DegreeDropdown } from "./components/DegreeDropdown";
import { advocates } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Advocate = InferSelectModel<typeof advocates> & {
  specialties: string[];
  city: string;
  degree: string;
  yearsOfExperience: number;
  phoneNumber: string;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);

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
    setFilteredAdvocates(filtered);
  }, [
    advocates,
    searchTerm,
    selectedSpecialties,
    selectedCities,
    selectedDegrees,
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

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedCities([]);
    setSelectedDegrees([]);
  };

  const tableHeaders = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Years of Experience",
    "Phone Number",
  ];

  const isFilteringActive =
    searchTerm ||
    selectedSpecialties.length > 0 ||
    selectedCities.length > 0 ||
    selectedDegrees.length > 0;

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
