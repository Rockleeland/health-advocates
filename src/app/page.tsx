"use client";

import { useEffect, useState } from "react";
import { Table } from "./components/ui/table";
import { SearchInput } from "./components/ui/search-input";
import { advocates } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Advocate = InferSelectModel<typeof advocates> & {
  specialties: string[];
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(value.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(value.toLowerCase()) ||
        advocate.city.toLowerCase().includes(value.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(value.toLowerCase()) ||
        advocate.specialties.some((s: string) =>
          s.toLowerCase().includes(value.toLowerCase())
        ) ||
        String(advocate.yearsOfExperience).includes(value)
      );
    });
    setFilteredAdvocates(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
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

  return (
    <main className="mx-6 my-8">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>

      <div className="mb-8 space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search advocates..."
        />
        {searchTerm && (
          <button
            onClick={resetSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset
          </button>
        )}
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
