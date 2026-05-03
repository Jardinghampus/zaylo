import { z } from "zod";

export const listingSchema = z
  .object({
    area_id: z.string().uuid("Select an area"),
    sub_area_id: z.string().uuid("Select a sub-area").optional(),
    property_type: z.enum(["Villa", "Townhouse", "Apartment", "Penthouse"]),
    bedrooms: z.string().min(1, "Select bedrooms"),
    vacant: z.boolean(),
    list_for_sale: z.boolean(),
    sale_price: z.number().positive().optional().nullable(),
    list_for_rent: z.boolean(),
    rent_price: z.number().positive().optional().nullable(),
    owner_name: z.string().min(2, "Enter your full name"),
    whatsapp: z.string().min(7, "Enter a valid WhatsApp number"),
    title_deed_url: z.string().url().optional().nullable(),
  })
  .refine((d) => d.list_for_sale || d.list_for_rent, {
    message: "Select at least one — for sale or for rent",
    path: ["list_for_sale"],
  })
  .refine((d) => !d.list_for_sale || (d.sale_price && d.sale_price > 0), {
    message: "Enter a sale price",
    path: ["sale_price"],
  })
  .refine((d) => !d.list_for_rent || (d.rent_price && d.rent_price > 0), {
    message: "Enter a rent price",
    path: ["rent_price"],
  });

export type ListingFormData = z.infer<typeof listingSchema>;
