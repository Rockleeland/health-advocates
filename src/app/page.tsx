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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [allDegrees, setAllDegrees] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (searchTerm) params.set("search", searchTerm);
    if (selectedSpecialties.length > 0)
      params.set("specialties", selectedSpecialties.join(","));
    if (selectedCities.length > 0)
      params.set("cities", selectedCities.join(","));
    if (selectedDegrees.length > 0)
      params.set("degrees", selectedDegrees.join(","));
    if (sortConfig.column) {
      params.set("sortColumn", sortConfig.column);
      params.set("sortDirection", sortConfig.direction);
    }
    fetch(`/api/advocates?${params.toString()}`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
        if (jsonResponse.filterOptions) {
          setAllCities(jsonResponse.filterOptions.cities);
          setAllSpecialties(jsonResponse.filterOptions.specialties);
          setAllDegrees(jsonResponse.filterOptions.degrees);
        }
        setLoading(false);
      });
  }, [
    searchTerm,
    selectedSpecialties,
    selectedCities,
    selectedDegrees,
    sortConfig,
    page,
    pageSize,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSpecialtyChange = (values: string[]) => {
    setSelectedSpecialties(values);
    setPage(1);
  };

  const handleCityChange = (values: string[]) => {
    setSelectedCities(values);
    setPage(1);
  };

  const handleDegreeChange = (values: string[]) => {
    setSelectedDegrees(values);
    setPage(1);
  };

  const handleSort = (column: keyof Advocate) => {
    setSortConfig((currentSort) => ({
      column,
      direction:
        currentSort.column === column && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedCities([]);
    setSelectedDegrees([]);
    setSortConfig({ column: null, direction: "asc" });
    setPage(1);
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

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setPage((p) => Math.min(pagination.totalPages, p + 1));

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
            allSpecialties={allSpecialties}
            selectedSpecialties={selectedSpecialties}
            onSpecialtyChange={handleSpecialtyChange}
          />
          <CityDropdown
            allCities={allCities}
            selectedCities={selectedCities}
            onCityChange={handleCityChange}
          />
          <DegreeDropdown
            allDegrees={allDegrees}
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

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table headers={tableHeaders}>
            {advocates.map((advocate) => (
              <tr key={advocate.id} className="border-b border-gray-200">
                <td className="px-4 py-3">{advocate.firstName}</td>
                <td className="px-4 py-3">{advocate.lastName}</td>
                <td className="px-4 py-3">{advocate.city}</td>
                <td className="px-4 py-3">{advocate.degree}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {advocate.payload.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-700"
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
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <span className="text-sm text-gray-500">
                Total: {pagination.total} advocates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
