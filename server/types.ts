import { z } from "zod";

export const liabilitiesSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(2).max(50),
  amount: z.string(),
});

export const createSchema = liabilitiesSchema.omit({ id: true });
