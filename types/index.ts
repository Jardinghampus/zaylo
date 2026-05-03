import type { Tables } from "@/lib/supabase/types";

export type Area = Tables<"areas">;
export type SubArea = Tables<"sub_areas">;
export type Listing = Tables<"listings">;
export type Request = Tables<"requests">;
export type RequestArea = Tables<"request_areas">;

export type AreaWithSubAreas = Area & {
  sub_areas: SubArea[];
};

export type ListingWithLocation = Listing & {
  area: Area | null;
  sub_area: SubArea | null;
};

export type RequestWithAreas = Request & {
  areas: Area[];
};

export type PropertyType = "Villa" | "Townhouse" | "Apartment" | "Penthouse";
export type Intent = "buy" | "rent";
export type ListingStatus = "pending" | "active" | "removed";
export type RequestStatus = "active" | "removed";
