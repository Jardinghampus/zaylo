import { z } from "zod";

export const requestSchema = z.object({
  intent: z.enum(["buy", "rent"]),
  area_ids: z.array(z.string().uuid()).min(1, "Select at least one area"),
  property_type: z.string().min(1, "Select a property type"),
  bedrooms: z.string().min(1, "Select bedrooms"),
  budget_min: z.number().positive().optional().nullable(),
  budget_max: z.number().positive().optional().nullable(),
  requester_name: z.string().min(2, "Enter your name"),
  whatsapp: z.string().min(7, "Enter a valid WhatsApp number"),
  notes: z.string().optional().nullable(),
});

export type RequestFormData = z.infer<typeof requestSchema>;
