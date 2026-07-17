// Shared types for the Rodeo Road Log feature.

export type Category = "jackpot" | "college";
export type StayType = "hotel" | "campground";
export type ArenaType = "" | "indoor" | "outdoor";

export interface Run {
  id: string;
  date: string; // ISO yyyy-mm-dd, or ""
  event: string;
  arena: string;
  category: Category;
  time: string; // seconds, kept as string for the input field ("" when blank)
  earnings: number; // dollars won
  videoLink: string;
  notes: string;
}

export interface Stay {
  id: string;
  startDate: string;
  endDate: string;
  type: StayType;
  name: string;
  arena: string; // which arena this stay was for ("" if none)
  ada: boolean;
  rating: number; // 0–5
  notes: string;
}

export interface ArenaInfo {
  type: ArenaType;
  notes: string;
}

export type ArenaMap = Record<string, ArenaInfo>;

export interface RodeoData {
  runs: Run[];
  stays: Stay[];
  arenas: ArenaMap;
}
