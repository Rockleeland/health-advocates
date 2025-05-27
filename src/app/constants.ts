import { Advocate } from "./types";

export const TABLE_HEADERS = [
  "First Name",
  "Last Name",
  "City",
  "Degree",
  "Specialties",
  "Years of Experience",
  "Phone Number",
] as const;

export const HEADER_TO_PROPERTY_MAP: { [key: string]: keyof Advocate } = {
  "First Name": "firstName",
  "Last Name": "lastName",
  "City": "city",
  "Degree": "degree",
  "Years of Experience": "yearsOfExperience",
}; 