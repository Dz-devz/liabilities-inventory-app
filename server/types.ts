import { z } from "zod";

export const liabilitiesSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(25, { message: "Title must be at most 25" }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Amount must be positive and reasonable.",
    }),
});

export const createSchema = liabilitiesSchema.omit({ id: true });
