import { advocates } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Advocate = InferSelectModel<typeof advocates> & {
  specialties: string[];
  city: string;
  degree: string;
  yearsOfExperience: number;
  phoneNumber: string;
};

export type SortConfig = {
  column: keyof Advocate | null;
  direction: "asc" | "desc";
}; 