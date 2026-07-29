// Shared types for the Rodeo Road Log feature.

export type Category = "jackpot" | "college";
export type StayType = "hotel" | "campground";
export type ArenaType = "" | "indoor" | "outdoor";
export type Ground = "" | "Hard" | "Deep" | "Sloppy" | "Freshly dragged" | "Good";

export interface Run {
  id: string;
  date: string; // ISO yyyy-mm-dd, or ""
  event: string;
  arena: string;
  category: Category;
  time: string; // seconds, kept as string for the input field ("" when blank)
  earnings: number; // dollars won
  entryFee: number; // dollars paid to enter
  videoLink: string;
  notes: string;
  horse: string;
  placement: string;
  barrel1Notes: string;
  barrel2Notes: string;
  barrel3Notes: string;
  ground: Ground;
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

export interface Horse {
  name: string;
  notes: string;
}

export interface RodeoData {
  runs: Run[];
  stays: Stay[];
  arenas: ArenaMap;
  horses: Horse[];
}
