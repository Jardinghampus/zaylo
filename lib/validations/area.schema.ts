import { z } from "zod";

export const areaSchema = z.object({
  name: z.string().min(2, "Area name must be at least 2 characters"),
});

export const subAreaSchema = z.object({
  name: z.string().min(2, "Sub-area name must be at least 2 characters"),
});

export type AreaFormData = z.infer<typeof areaSchema>;
export type SubAreaFormData = z.infer<typeof subAreaSchema>;
